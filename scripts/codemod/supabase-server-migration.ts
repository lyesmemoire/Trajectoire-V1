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
  "services/**/*.ts"
])

function replaceImport(sourceFile: any) {
  const imports = sourceFile.getImportDeclarations()

  imports.forEach((imp: any) => {
    const moduleSpecifier = imp.getModuleSpecifierValue()

    if (moduleSpecifier === "@/lib/supabase-server") {
      const namedImports = imp.getNamedImports().map((i: any) => i.getName())
      imp.remove()

      if (namedImports.includes("createSupabaseServerClient")) {
        sourceFile.addImportDeclaration({
          moduleSpecifier: "@/lib/supabase/server",
          namedImports: ["createServerClient"],
        })
        
        const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        calls.forEach((call: any) => {
           if (call.getExpression().getText() === "createSupabaseServerClient") {
               call.getExpression().replaceWithText("createServerClient")
           }
        })
      }

      if (namedImports.includes("createSupabaseServiceClient")) {
        sourceFile.addImportDeclaration({
          moduleSpecifier: "@/lib/supabase/service",
          namedImports: ["supabaseAdmin"],
        })
        
        const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        calls.forEach((call: any) => {
           if (call.getExpression().getText() === "createSupabaseServiceClient") {
               call.replaceWithText("supabaseAdmin")
           }
        })
      }
    }
  })
}

sourceFiles.forEach((file) => {
  replaceImport(file)
})

project.save().then(() => {
  console.log("✅ Supabase-server import migration complete")
})
