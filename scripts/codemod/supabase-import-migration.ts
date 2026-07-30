import { Project, SyntaxKind } from "ts-morph"

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
})

const sourceFiles = project.getSourceFiles([
  "app/**/*.ts",
  "app/**/*.tsx",
  "components/**/*.ts",
  "components/**/*.tsx",
  "lib/**/*.ts",
])

function replaceImport(sourceFile: unknown) {
  const imports = sourceFile.getImportDeclarations()

  imports.forEach((imp: unknown) => {
    const moduleSpecifier = imp.getModuleSpecifierValue()

    // CASE 1: legacy supabase import
    if (moduleSpecifier === "@/lib/supabase") {
      const namedImports = imp.getNamedImports().map((i: unknown) => i.getName())

      imp.remove()

      if (namedImports.includes("createClient")) {
        sourceFile.addImportDeclaration({
          moduleSpecifier: "@/lib/supabase/client",
          namedImports: ["supabase"],
        })
        
        // Also need to replace createClient() calls with just 'supabase'
        const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        calls.forEach((call: unknown) => {
           if (call.getExpression().getText() === "createClient") {
               call.replaceWithText("supabase")
           }
        })
      }

      return
    }

    // CASE 2: direct service client misuse
    if (moduleSpecifier.includes("service-client")) {
      imp.setModuleSpecifier("@/lib/supabase/service")
    }
  })
}

sourceFiles.forEach((file) => {
  replaceImport(file)
})

project.save().then(() => {
  console.log("✅ Supabase import migration complete")
})
