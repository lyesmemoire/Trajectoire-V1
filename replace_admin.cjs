const fs = require('fs');

const files = [
  'app/api/admin/ban-user/route.ts',
  'app/api/admin/dashboard-metrics/route.ts',
  'app/api/admin/fraud-users/route.ts',
  'app/api/admin/restore-credits/route.ts',
  'app/api/admin/unflag-user/route.ts',
  'app/api/cron/check-costs/route.ts',
  'app/api/cron/cleanup-transactions/route.ts'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace import
    content = content.replace(
      /import\s+\{\s*createClient\s*\}\s+from\s+["']@supabase\/supabase-js["'];?\r?\n/g,
      'import { createAdminClient } from "@/lib/supabase/service";\n'
    );
    
    // Replace instantiation
    content = content.replace(
      /const\s+supabase\s*=\s*createClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY!,?\s*\);/g,
      'const supabase = createAdminClient();'
    );
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
