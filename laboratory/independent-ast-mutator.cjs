const ts = require('typescript');
const crypto = require('crypto');
const fs = require('fs');

/**
 * INDEPENDENT AST MUTATOR
 * ISO 17025 Compliant Lab implementation.
 * Must not import anything from certification/.
 */

function generateSemanticId(fileName, nodeKind, fnName, text, desc, type) {
  const payload = `${fileName}|${nodeKind}|${fnName}|${text}|${desc}`;
  const hex = crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);
  const prefix = type === 'Regression' ? 'AST-REG-' : 'AST-MUT-';
  return prefix + hex;
}

function resolveEnclosingFunction(node) {
  let p = node.parent;
  while (p) {
    if (p.kind === ts.SyntaxKind.FunctionDeclaration || p.kind === ts.SyntaxKind.MethodDeclaration || p.kind === ts.SyntaxKind.ArrowFunction) {
      if (p.name && p.name.kind === ts.SyntaxKind.Identifier) {
        return p.name.text;
      }
      return 'anonymous_function';
    }
    p = p.parent;
  }
  return 'global';
}

function normalizeNodeText(text) {
  return text.trim().replace(/\s+/g, ' ');
}

function buildCatalog(sourceFilePath) {
  const content = fs.readFileSync(sourceFilePath, 'utf8');
  const src = ts.createSourceFile(sourceFilePath, content, ts.ScriptTarget.Latest, true);
  const filename = sourceFilePath.replace(/^.*[\\\/]/, '');
  
  const entries = new Map();

  function pushEntry(node, cat, desc, replacement) {
    const fn = resolveEnclosingFunction(node);
    const kindName = ts.SyntaxKind[node.kind];
    const txt = normalizeNodeText(node.getText(src));
    
    const id = generateSemanticId(filename, kindName, fn, txt, desc, cat);
    
    if (!entries.has(id)) {
      entries.set(id, {
        id,
        category: cat,
        kind: kindName,
        file: filename,
        function: fn,
        description: desc,
        original: txt,
        replacement,
        hash: id.split('-').pop(),
        sourceSpan: {
          start: node.getStart(src),
          end: node.getEnd()
        }
      });
    }
  }

  function traverse(node) {
    switch (node.kind) {
      case ts.SyntaxKind.BinaryExpression: {
        const opKind = node.operatorToken.kind;
        const opMap = {
          [ts.SyntaxKind.PlusToken]: '-',
          [ts.SyntaxKind.MinusToken]: '+',
          [ts.SyntaxKind.AsteriskToken]: '/',
          [ts.SyntaxKind.SlashToken]: '*',
          [ts.SyntaxKind.EqualsEqualsEqualsToken]: '!==',
          [ts.SyntaxKind.ExclamationEqualsEqualsToken]: '===',
          [ts.SyntaxKind.LessThanToken]: '>=',
          [ts.SyntaxKind.GreaterThanToken]: '<='
        };
        const repl = opMap[opKind];
        if (repl) {
          const lText = content.substring(node.left.getStart(src), node.left.getEnd());
          const rText = content.substring(node.right.getStart(src), node.right.getEnd());
          pushEntry(node, 'Mutation', `Operator ${ts.SyntaxKind[opKind]} to ${repl}`, `${lText} ${repl} ${rText}`);
        }
        break;
      }
      case ts.SyntaxKind.TrueKeyword:
        pushEntry(node, 'Mutation', 'true -> false', 'false');
        break;
      case ts.SyntaxKind.FalseKeyword:
        pushEntry(node, 'Mutation', 'false -> true', 'true');
        break;
      case ts.SyntaxKind.NumericLiteral: {
        const numericVal = Number(node.text);
        if (!Number.isNaN(numericVal)) {
          const newNum = numericVal === 0 ? '1' : '0';
          pushEntry(node, 'Mutation', `Number ${numericVal} -> ${newNum}`, newNum);
        }
        break;
      }
      case ts.SyntaxKind.ExpressionStatement:
        pushEntry(node, 'Regression', 'Remove statement', '/* statement removed */');
        break;
      case ts.SyntaxKind.ReturnStatement:
        if (node.expression) {
          pushEntry(node, 'Regression', 'Return undefined', 'return undefined;');
        }
        break;
      case ts.SyntaxKind.IfStatement:
        pushEntry(node.expression, 'Regression', 'Force if condition to false', 'false');
        pushEntry(node.expression, 'Regression', 'Force if condition to true', 'true');
        break;
    }
    ts.forEachChild(node, traverse);
  }

  traverse(src);
  
  // Return sorted array
  return Array.from(entries.values()).sort((a, b) => a.id.localeCompare(b.id));
}

module.exports = { buildCatalog };
