import fs from "fs";
import path from "path";

// ──────────────────────────────────────────────────────────────────────────────
// Configuration des règles d'architecture
// ──────────────────────────────────────────────────────────────────────────────

const ALLOWED_DISPATCH = [
  "gateway.ts",
  "voice-sink-ws.ts",
  "transport-binding.ts", // Implémente l'interface
];

const ALLOWED_ON_EVENT = [
  "voice-runtime.ts",
  "transport-binding.ts",
];

// Fichiers autorisés à appeler `.send(` sur le TransportBinding
const ALLOWED_TRANSPORT_SEND = [
  "voice-runtime.ts",
  "transport-binding.ts",
];

// Appels `.send(` ignorés car ils ciblent des WebSockets ou des réponses HTTP
const SAFE_SEND_CALLERS = ["ws", "socket", "bridge", "res", "app", "reply", "connection", "raw", "rawSocket", "client"];

// ──────────────────────────────────────────────────────────────────────────────

let hasError = false;

function walkDir(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith(".ts") || dirPath.endsWith(".tsx")) {
      callback(dirPath);
    }
  });
}

function checkArchitecture() {
  const targetDir = path.resolve(process.cwd(), "apps/realtime-gateway/src");

  walkDir(targetDir, (filePath) => {
    const code = fs.readFileSync(filePath, "utf-8");
    // Suppression naïve des commentaires pour éviter les faux positifs
    const cleanCode = code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*/g, "");
    
    const baseName = path.basename(filePath);

    // 1. Règle dispatch : Seuls les producteurs légitimes peuvent émettre un event entrant
    if (/\.dispatch\s*\(|\bdispatch\s*\(|\{\s*dispatch\s*\}\s*=/.test(cleanCode)) {
      if (!ALLOWED_DISPATCH.includes(baseName) && !baseName.endsWith(".test.ts")) {
        console.error(`❌ [Architecture Error] appel ou destructuration de 'dispatch' dans un fichier non autorisé : ${baseName}`);
        hasError = true;
      }
    }

    // 2. Règle onEvent : Seul le runtime écoute les événements entrants
    if (/\.onEvent\s*\(/.test(cleanCode)) {
      if (!ALLOWED_ON_EVENT.includes(baseName)) {
        console.error(`❌ [Architecture Error] .onEvent() appelé dans un fichier non autorisé : ${baseName}`);
        hasError = true;
      }
    }

    // 3. Règle isolation : Interdiction d'importer l'ancien dossier src/interview
    if (
      /from\s+["'](\.\.\/)+interview\//.test(cleanCode) ||
      /import\s+["'](\.\.\/)+interview\//.test(cleanCode) ||
      /from\s+["']\.\/interview\//.test(cleanCode) ||
      /import\s+["']\.\/interview\//.test(cleanCode)
    ) {
      console.error(`❌ [Architecture Error] Import legacy vers 'src/interview/' détecté dans : ${baseName}`);
      hasError = true;
    }

    // 4. Règle transport send : Seul le runtime émet des instructions vers le client
    // On cherche les appels `variable.send(` (ex: `transport.send(`)
    const sendRegex = /\b(\w+)\.send\s*\(/g;
    let match;
    while ((match = sendRegex.exec(cleanCode)) !== null) {
      const caller = match[1];
      if (!SAFE_SEND_CALLERS.includes(caller) && !ALLOWED_TRANSPORT_SEND.includes(baseName)) {
        console.error(`❌ [Architecture Error] Appel non autorisé à '${caller}.send()' détecté dans : ${baseName}`);
        console.error(`   -> Si c'est un WebSocket, ajoutez la variable '${caller}' dans SAFE_SEND_CALLERS.`);
        hasError = true;
      }
    }
  });

  if (hasError) {
    console.error("\n💥 Échec de la certification architecturale !");
    process.exit(1);
  } else {
    console.log("✅ Certification architecturale réussie. L'intégrité du flux Inbound/Outbound est respectée.");
  }
}

checkArchitecture();
