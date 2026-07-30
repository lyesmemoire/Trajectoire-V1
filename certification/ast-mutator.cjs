const ts = require('typescript');
const crypto = require('crypto');
const fs = require('fs');

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function getNormalizedText(node, sourceFile) {
  return node.getText(sourceFile).trim().replace(/\s+/g, ' ');
}

function findEnclosingFunction(node) {
  let curr = node.parent;
  while (curr) {
    if (ts.isFunctionDeclaration(curr) || ts.isMethodDeclaration(curr) || ts.isArrowFunction(curr)) {
      if (curr.name && ts.isIdentifier(curr.name)) {
        return curr.name.text;
      }
      return 'anonymous_function';
    }
    curr = curr.parent;
  }
  return 'global';
}

function generateCatalog(sourceFilePath) {
  const code = fs.readFileSync(sourceFilePath, 'utf8');
  const sourceFile = ts.createSourceFile(sourceFilePath, code, ts.ScriptTarget.Latest, true);
  
  const catalog = [];
  const fileName = sourceFilePath.split(/[\\/]/).pop();

  function addMutation(node, category, description, replacement) {
    const fnName = findEnclosingFunction(node);
    const nodeKind = ts.SyntaxKind[node.kind];
    const text = getNormalizedText(node, sourceFile);
    
    // Semantic ID
    const rawId = `${fileName}|${nodeKind}|${fnName}|${text}|${description}`;
    const hash = sha256(rawId).substring(0, 16);
    const id = `AST-${category === 'Regression' ? 'REG' : 'MUT'}-${hash}`;
    
    // Prevent duplicates (some nodes might be visited multiple times if we are not careful)
    if (!catalog.find(c => c.id === id)) {
      catalog.push({
        id,
        category,
        kind: nodeKind,
        file: fileName,
        function: fnName,
        description,
        original: text,
        replacement,
        hash,
        sourceSpan: {
          start: node.getStart(sourceFile),
          end: node.getEnd()
        }
      });
    }
  }

  function visit(node) {
    // 1. Operator Mutations
    if (ts.isBinaryExpression(node)) {
      const op = node.operatorToken.kind;
      let repl = null;
      if (op === ts.SyntaxKind.PlusToken) repl = '-';
      else if (op === ts.SyntaxKind.MinusToken) repl = '+';
      else if (op === ts.SyntaxKind.AsteriskToken) repl = '/';
      else if (op === ts.SyntaxKind.SlashToken) repl = '*';
      else if (op === ts.SyntaxKind.EqualsEqualsEqualsToken) repl = '!==';
      else if (op === ts.SyntaxKind.ExclamationEqualsEqualsToken) repl = '===';
      else if (op === ts.SyntaxKind.LessThanToken) repl = '>=';
      else if (op === ts.SyntaxKind.GreaterThanToken) repl = '<=';
      
      if (repl) {
        const left = code.substring(node.left.getStart(sourceFile), node.left.getEnd());
        const right = code.substring(node.right.getStart(sourceFile), node.right.getEnd());
        addMutation(node, 'Mutation', `Operator ${ts.SyntaxKind[op]} to ${repl}`, `${left} ${repl} ${right}`);
      }
    }

    // 2. Boolean Mutations
    if (node.kind === ts.SyntaxKind.TrueKeyword) {
      addMutation(node, 'Mutation', 'true -> false', 'false');
    }
    if (node.kind === ts.SyntaxKind.FalseKeyword) {
      addMutation(node, 'Mutation', 'false -> true', 'true');
    }

    // 3. Literal Mutations (Numeric)
    if (ts.isNumericLiteral(node)) {
      const val = parseFloat(node.text);
      if (!isNaN(val)) {
        const repl = val === 0 ? '1' : '0';
        addMutation(node, 'Mutation', `Number ${val} -> ${repl}`, repl);
      }
    }

    // 4. Regression Scenarios (Statement Removal)
    if (ts.isExpressionStatement(node)) {
      addMutation(node, 'Regression', 'Remove statement', '/* statement removed */');
    }

    // 5. Regression Scenarios (Return modification)
    if (ts.isReturnStatement(node) && node.expression) {
      addMutation(node, 'Regression', 'Return undefined', 'return undefined;');
    }

    // 6. Regression Scenarios (If Condition)
    if (ts.isIfStatement(node)) {
      addMutation(node.expression, 'Regression', 'Force if condition to false', 'false');
      addMutation(node.expression, 'Regression', 'Force if condition to true', 'true');
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  
  // Sort catalog deterministically
  catalog.sort((a, b) => a.id.localeCompare(b.id));
  
  return catalog;
}

if (require.main === module) {
  const file = process.argv[2];
  if (file) {
    console.log(JSON.stringify(generateCatalog(file), null, 2));
  } else {
    console.log('Usage: node ast-mutator.cjs <file>');
  }
}

module.exports = { generateCatalog };
