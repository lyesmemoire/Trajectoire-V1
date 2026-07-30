import fs from 'fs';

const routes = [
  "app/api/admin/threat-intel/route.ts",
  "app/api/admin-backup/route.ts",
  "app/api/config.php/route.ts",
  "app/api/health/route.ts",
  "app/api/interview/feedback/route.ts",
  "app/api/interview/generate/route.ts",
  "app/api/optimize/route.ts",
  "app/api/register/route.ts",
  "app/api/upload/route.ts",
];

for (const r of routes) {
  try {
    const c = fs.readFileSync(r, "utf8");
    if (!c.includes("dynamic = 'force-dynamic'")) {
      const updated = "export const dynamic = 'force-dynamic';\n\n" + c;
      fs.writeFileSync(r, updated);
      console.log("FIXED:", r);
    } else {
      console.log("SKIP:", r);
    }
  } catch {
    console.log("ERROR:", r, e.message);
  }
}
