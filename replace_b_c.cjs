const fs = require('fs');
const path = require('path');

// --- B3 Scripts ---
const scripts = [
  'scripts/audit-billing-consistency.ts',
  'scripts/test-billing-load.ts',
  'test-route.ts'
];

scripts.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/process\.env\.SUPABASE_SERVICE_ROLE_KEY!?/g, 'envServer.SUPABASE_SERVICE_ROLE_KEY');
    
    // add import if not present
    if (!content.includes('envServer')) {
      const depth = file.split('/').length - 1;
      const prefix = depth > 0 ? '../'.repeat(depth) : './';
      content = `import { envServer } from "${prefix}lib/env.server";\n` + content;
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

// --- B4 Realtime Gateway ---
const gatewayFiles = [
  'apps/realtime-gateway/src/server/auth.ts',
  'apps/realtime-gateway/src/server/routes/billing.ts',
  'apps/realtime-gateway/src/server/routes/engine.ts',
  'apps/realtime-gateway/src/server/routes/interviews.ts',
  'apps/realtime-gateway/src/voice-interview/adapters/voice-websocket-v3.ts',
  'apps/realtime-gateway/src/voice-interview/billing/usage-service.ts',
  'apps/realtime-gateway/src/voice-interview/persistence/supabase-interview-repository.ts'
];

gatewayFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('process.env.SUPABASE_SERVICE_ROLE_KEY')) {
      // Add zod import if not present
      if (!content.includes('import { z }')) {
        content = `import { z } from "zod";\n` + content;
      }
      
      // Add validation logic if not present
      if (!content.includes('GatewayEnvSchema')) {
        const schemaBlock = `
const GatewayEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:  z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});
const gatewayEnv = GatewayEnvSchema.parse(process.env);
`;
        // insert after imports
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const nextLineIndex = content.indexOf('\\n', lastImportIndex);
          content = content.slice(0, nextLineIndex !== -1 ? nextLineIndex : 0) + schemaBlock + content.slice(nextLineIndex !== -1 ? nextLineIndex : 0);
        } else {
          content = schemaBlock + content;
        }
      }
      
      content = content.replace(/process\.env\.NEXT_PUBLIC_SUPABASE_URL!?,/g, 'gatewayEnv.NEXT_PUBLIC_SUPABASE_URL,');
      content = content.replace(/process\.env\.SUPABASE_SERVICE_ROLE_KEY!?/g, 'gatewayEnv.SUPABASE_SERVICE_ROLE_KEY');
      
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
});

// --- Phase C ---
const phaseC = {
  'lib/mistral.ts': [
    [/process\.env\.MISTRAL_API_KEY!?/g, 'envServer.MISTRAL_API_KEY']
  ],
  'lib/openai.ts': [ // or similar if exists
    [/process\.env\.OPENAI_API_KEY!?/g, 'envServer.OPENAI_API_KEY'],
    [/process\.env\.OPENAI_BASE_URL!?/g, 'envServer.OPENAI_BASE_URL']
  ],
  'lib/stripe.ts': [
    [/process\.env\.STRIPE_SECRET_KEY!?/g, 'envServer.STRIPE_SECRET_KEY']
  ],
  'app/api/stripe/webhook/route.ts': [
    [/process\.env\.STRIPE_WEBHOOK_SECRET!?/g, 'envServer.STRIPE_WEBHOOK_SECRET']
  ]
};

Object.entries(phaseC).forEach(([file, replaces]) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    replaces.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    
    if (!content.includes('envServer')) {
      const depth = file.split('/').length - 1;
      const prefix = depth > 0 ? '../'.repeat(depth) : './';
      content = `import { envServer } from "@/lib/env.server";\n` + content;
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
