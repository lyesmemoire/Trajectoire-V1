#!/usr/bin/env node
/**
 * Seed LOCAL pour les captures d'écran du design « Calm » — hors CI, jamais lancé automatiquement.
 *
 * Crée dans la base Supabase LOCALE (127.0.0.1:54322) :
 *   - un utilisateur de test (Auth + public.users) avec l'onboarding fait et un abonnement PRO actif ;
 *   - une simulation terminée et son rapport.
 *
 * Garde-fous : refuse de s'exécuter si la base n'est pas 127.0.0.1:54322 ; n'écrit rien ailleurs.
 * Les clés locales viennent de `supabase status -o env` (jamais lues dans un fichier .env, jamais affichées).
 * Le mot de passe de test est généré, écrit dans le fichier indiqué par --out (hors dépôt) et jamais affiché.
 *
 * Usage : node scripts/seed-calm-screenshots.cjs --out <fichier.json>
 * Idempotent : relancer supprime puis recrée l'utilisateur de test local.
 */
const { execSync, spawnSync } = require("node:child_process")
const crypto = require("node:crypto")
const fs = require("node:fs")

const EMAIL = "calm-test@trajectoire.local"
const DB_CONTAINER = process.env.SEED_DB_CONTAINER || "supabase_db_Trajectoire"
const outIdx = process.argv.indexOf("--out")
const out = outIdx > -1 ? process.argv[outIdx + 1] : null
if (!out) throw new Error("Indiquez --out <fichier.json> (hors dépôt)")

// 1. Clés et URL locales
const env = {}
for (const line of execSync("npx --no-install supabase status -o env", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n")) {
  const m = /^([A-Z0-9_]+)="?(.*?)"?$/.exec(line.trim())
  if (m) env[m[1]] = m[2]
}
const api = env.API_URL
const dbUrl = env.DB_URL
if (!/^http:\/\/127\.0\.0\.1:54321$/.test(api || "") || !/@127\.0\.0\.1:54322\//.test(dbUrl || "")) {
  throw new Error("[SAFETY] La base n'est pas la base locale 127.0.0.1:54322 : abandon.")
}
const service = env.SERVICE_ROLE_KEY
if (!service) throw new Error("SERVICE_ROLE_KEY locale introuvable")

const sql = (q) => {
  const r = spawnSync("docker", ["exec", "-i", DB_CONTAINER, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1", "-At"], { input: q, encoding: "utf8" })
  if (r.status !== 0) throw new Error("SQL : " + r.stderr)
  return r.stdout.trim()
}
const lit = (v) => (v === null ? "NULL" : "'" + String(v).replace(/'/g, "''") + "'")

async function main() {
  // 2. (Ré)initialisation de l'utilisateur de test
  const existing = sql(`select id from auth.users where email=${lit(EMAIL)}`)
  if (existing) {
    sql(`delete from public.reports where session_id in (select id from public.interview_sessions where user_id='${existing}'::uuid);
         delete from public.interview_sessions where user_id='${existing}'::uuid;
         delete from public."Subscription" where "userId"=${lit(existing)};
         delete from public."CareerProfile" where "userId"=${lit(existing)};
         delete from public.users where id=${lit(existing)};`)
    await fetch(`${api}/auth/v1/admin/users/${existing}`, { method: "DELETE", headers: { apikey: service, Authorization: `Bearer ${service}` } })
  }

  const password = "Calm-" + crypto.randomBytes(9).toString("base64url") + "!1"
  const res = await fetch(`${api}/auth/v1/admin/users`, {
    method: "POST",
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password, email_confirm: true, user_metadata: { name: "Camille Test" } }),
  })
  if (!res.ok) throw new Error("Création Auth : " + res.status)
  const id = (await res.json()).id

  // 3. Profil applicatif, onboarding fait, abonnement PRO actif
  const onboarding = JSON.stringify({ version: 1, targetJob: { title: "Chargée de projet", sector: "Services", level: "Confirmé" }, goal: { interviewType: "behavioral" }, cvProvided: false })
  sql(`insert into public.users (id,email,name,"updatedAt","referralCode",plan,"onboardingCompleted","onboardingData","onboardingCompletedAt")
       values (${lit(id)},${lit(EMAIL)},'Camille Test',now(),${lit("CALM" + id.slice(0, 6))},'PRO',true,${lit(onboarding)}::jsonb,now());
       insert into public."Subscription" (id,"userId","stripeCustomerId","stripeSubId",status,"currentPeriodEnd","updatedAt")
       values (${lit("sub_" + id.slice(0, 8))},${lit(id)},'cus_local_test','sub_local_test','active',now() + interval '30 days',now());
       insert into public."CareerProfile" (id,"userId","employabilityScore","updatedAt") values (${lit("cp_" + id.slice(0, 8))},${lit(id)},62,now());`)

  // 4. Simulation terminée et rapport
  const sessionId = crypto.randomUUID()
  sql(`insert into public.interview_sessions (id,user_id,job_title,status,level,interview_type,score,duration_seconds,started_at,completed_at)
       values ('${sessionId}'::uuid,'${id}'::uuid,'Chargée de projet','completed','Confirmé','RH',74,900,now() - interval '1 hour',now() - interval '45 minutes');`)
  const reportId = crypto.randomUUID()
  const arr = (xs) => "ARRAY[" + xs.map(lit).join(",") + "]::text[]"
  sql(`insert into public.reports (id,session_id,overall_score,strengths,improvements,communication,technical,confidence,summary,recommendation)
       values ('${reportId}'::uuid,'${sessionId}'::uuid,74,
       ${arr(["Vos exemples sont concrets et bien structurés : on comprend vite le contexte, votre action et le résultat.", "Votre ton posé inspire confiance."])},
       ${arr(["Quantifiez davantage vos résultats : un chiffre par exemple rend votre impact immédiatement crédible.", "Reformulez votre motivation pour le poste en une phrase claire."])},
       78,70,75,
       'Un entretien solide, avec une bonne maîtrise de la structure des réponses.',
       'Préparez deux ou trois résultats chiffrés avant votre prochain entretien.');`)

  fs.writeFileSync(out, JSON.stringify({ email: EMAIL, password, userId: id, sessionId, reportId }, null, 2))
  console.log("Seed local terminé (identifiants écrits dans le fichier --out, non affichés).")
}
main().catch((e) => { console.error(e.message); process.exit(1) })
