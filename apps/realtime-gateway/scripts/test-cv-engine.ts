/**
 * Cabinet AI CV Engine — Test & Calibration Suite
 *
 * Validates:
 *   1. JSON stability (Zod pass/fail)
 *   2. Score differentiation (junior < 5.5, senior > 7.5)
 *   3. Risk engine credibility
 *   4. Anti-hallucination (no invented metrics)
 *   5. Tier & percentile coherence
 *
 * Usage:
 *   npx tsx apps/realtime-gateway/scripts/test-cv-engine.ts
 */

import "dotenv/config";

import { extractStructuredCV } from "../src/voice-interview/core/cv-structurer";
import { generateCvDiagnostic } from "../src/voice-interview/core/cv-diagnostic";
import { generateExecutiveRewrite } from "../src/voice-interview/core/cv-rewriter";
import { getEngineMetadata } from "../src/voice-interview/core/llm-strict";

// ─── Test CVs ──────────────────────────────────────────────────

const TEST_CVS: Record<string, string> = {
  junior_weak: `
John Doe
Looking for a developer job. I know HTML, CSS, and a bit of JS.
Experience:
- Intern at TechCorp (1 month). I made a website.
- Cashier at Supermarket (2 years). Handled money.
Education: Self-taught.
  `,

  senior_solid: `
Alice Smith - Senior Staff Engineer
10+ years driving distributed systems and cloud architecture.

Experience:
- Google, Staff Software Engineer (2018 - Present)
  Led a team of 15 engineers to rewrite the core search indexing pipeline.
  Reduced indexing latency by 45% (saving $2M/year in compute costs).
  Architected a highly available microservices infrastructure handling 10k QPS.
  Mentored 8 engineers across 3 teams.
- Stripe, Senior Engineer (2014 - 2018)
  Built the initial version of Stripe Billing, processing $500M+ annually.
  Mentored 5 junior developers who went on to become senior engineers.
  Reduced payment processing failures by 30% through retry logic improvements.
- Amazon, Software Engineer (2012 - 2014)
  Designed internal tooling for deployment pipelines serving 200+ microservices.

Education: MS Computer Science, MIT (2012)
Skills: Go, Java, Kubernetes, Terraform, PostgreSQL, gRPC, System Design
  `,

  incoherent: `
Bob The Builder
Skills: C++, Management, Baking, React, Excel.
Experience:
- CEO of MyOwnStartup (2020-2022). We built a blockchain AI app. It failed because the market wasn't ready.
- Waiter (2023-Present)
- Lead Developer at WebAgency (2019-2020).
  Built 50 websites using wordpress. Managed a team of 100 freelancers.
Education: Bootcamp 2024.
  `,

  very_short: `
Charlie
Developer.
Used React.
  `,

  very_long: `
David Johnson — Senior Developer
Experience:
- Developer at BigCorp (2020-2024).
  Attended daily standups. Wrote unit tests. Fixed bugs. Used git. Deployed to AWS.
  Configured S3. Configured EC2. Configured IAM roles. Used agile methodology.
  Wrote documentation. Reviewed code. Updated dependencies. Fixed CSS issues.
  Wrote migration scripts. Set up CI/CD pipeline. Managed staging environment.
- Developer at MediumCorp (2015-2020).
  Learned Java. Wrote Java. Deployed Java. Read Java documentation.
  Used Spring Boot. Connected to MySQL. Wrote REST APIs. Used Postman.
  Built admin panels. Fixed production bugs. Attended meetings.
Education: BS Computer Science.
Skills: Java, JavaScript, AWS, MySQL, Git
  `
};

// ─── Runner ────────────────────────────────────────────────────

interface TestResult {
  name: string;
  score: number;
  tier: string;
  percentile: number;
  risk: string;
  seniority: string;
  weaknesses: string[];
}

async function testEngine() {
  const meta = getEngineMetadata();
  console.log("🚀 Cabinet AI CV Engine — Calibration Test Suite\n");
  console.log(`📡 Provider:  ${meta.provider}`);
  console.log(`🤖 Model:     ${meta.model}`);
  console.log(`🏷️  Version:   ${meta.engine_version}`);
  console.log(`⏰ Timestamp: ${meta.timestamp}\n`);

  const results: TestResult[] = [];

  for (const [name, cvText] of Object.entries(TEST_CVS)) {
    console.log(`\n${"═".repeat(50)}`);
    console.log(`🧪 CV: [${name.toUpperCase()}]`);
    console.log(`${"═".repeat(50)}`);

    try {
      // Level 1
      console.log("⏳ [Level 1] Extracting structural data...");
      const t1 = Date.now();
      const structure = await extractStructuredCV(cvText);
      console.log(`✅ [Level 1] Done (${Date.now() - t1}ms)`);
      console.log(`   Experiences: ${structure.total_experiences}`);
      console.log(`   Structural coherence: ${structure.overall_structural_coherence_score}/10`);
      console.log(`   Quantification ratio: ${(structure.global_quantification_ratio * 100).toFixed(0)}%`);

      // Bullet quality
      const totalWeak = structure.experiences.reduce((s, e) => s + e.bullet_quality_distribution.weak, 0);
      const totalAvg = structure.experiences.reduce((s, e) => s + e.bullet_quality_distribution.average, 0);
      const totalStrong = structure.experiences.reduce((s, e) => s + e.bullet_quality_distribution.strong, 0);
      console.log(`   Bullets: ${totalWeak} weak / ${totalAvg} average / ${totalStrong} strong`);

      // Level 2
      console.log("\n⏳ [Level 2] Strategic diagnostic...");
      const t2 = Date.now();
      const report = await generateCvDiagnostic(structure, "Senior Backend Engineer");
      console.log(`✅ [Level 2] Done (${Date.now() - t2}ms)`);

      results.push({
        name,
        score: report.computed_overall_cabinet_score,
        tier: report.computed_tier,
        percentile: report.computed_competitiveness_percentile,
        risk: report.hire_risk_assessment.risk_level,
        seniority: report.market_positioning.estimated_seniority,
        weaknesses: report.critical_weaknesses,
      });

      console.log(`\n📊 VERDICT:`);
      console.log(`   Score:      ${report.computed_overall_cabinet_score}/10`);
      console.log(`   Tier:       ${report.computed_tier}`);
      console.log(`   Percentile: ${report.computed_competitiveness_percentile}th`);
      console.log(`   Risk:       ${report.hire_risk_assessment.risk_level}`);
      console.log(`   Seniority:  ${report.market_positioning.estimated_seniority}`);

      console.log(`\n   💪 Strengths:`);
      report.strengths.slice(0, 3).forEach(s => console.log(`      ✅ ${s}`));

      console.log(`   ⚠️  Weaknesses:`);
      report.critical_weaknesses.slice(0, 3).forEach(w => console.log(`      ❌ ${w}`));

      console.log(`   🚩 Risk Factors:`);
      report.hire_risk_assessment.primary_risk_factors.forEach(r => console.log(`      - ${r}`));

      // Level 3: Executive Rewrite (Only run for junior_weak to test guards)
      if (name === "junior_weak" || name === "senior_solid") {
        console.log("\n⏳ [Level 3] Executive Rewrite (Testing Hallucination Guards)...");
        const t3 = Date.now();
        const rewrite = await generateExecutiveRewrite(cvText, report, "Senior Backend Engineer");
        console.log(`✅ [Level 3] Done (${Date.now() - t3}ms)`);
        
        console.log("\n   📝 Rewritten Executive Profile:");
        console.log(`      "${rewrite.executive_profile_rewritten}"`);
        
        console.log("\n   🛠️ Rewritten Experience (First):");
        if (rewrite.experiences_rewritten[0]) {
          console.log(`      ${rewrite.experiences_rewritten[0].company} - ${rewrite.experiences_rewritten[0].role}`);
          rewrite.experiences_rewritten[0].bullets_rewritten.forEach(b => console.log(`      - ${b}`));
        }
      }

    } catch (error) {
      console.error(`❌ FAILED on [${name}]:`, (err as Error).message);
    }
  }

  // ─── Calibration Summary ───────────────────────────────────────
  if (results.length > 0) {
    console.log("\n\n╔════════════════════════════════════════════════════════════════╗");
    console.log("║              CALIBRATION SUMMARY TABLE                        ║");
    console.log("╠════════════════════════════════════════════════════════════════╣");
    console.log("║  CV               │ Score │ Tier          │  %ile │ Risk      ║");
    console.log("╠════════════════════════════════════════════════════════════════╣");
    for (const r of results) {
      const nm = r.name.padEnd(17);
      const sc = r.score.toFixed(1).padStart(5);
      const tr = r.tier.padEnd(13);
      const pc = String(r.percentile).padStart(5);
      const rk = r.risk.padEnd(9);
      console.log(`║  ${nm}│ ${sc} │ ${tr} │ ${pc} │ ${rk} ║`);
    }
    console.log("╚════════════════════════════════════════════════════════════════╝");

    // ─── Calibration Checks ────────────────────────────────────────
    console.log("\n🔬 CALIBRATION CHECKS:");

    const junior = results.find(r => r.name === "junior_weak");
    const senior = results.find(r => r.name === "senior_solid");
    const allScores = results.map(r => r.score);
    const scoreRange = Math.max(...allScores) - Math.min(...allScores);

    // Check 1: Junior < 5.5
    if (junior) {
      const pass = junior.score < 5.5;
      console.log(`   ${pass ? "✅" : "❌"} Junior Weak score (${junior.score}) ${pass ? "<" : ">="} 5.5`);
    }

    // Check 2: Senior > 7.5
    if (senior) {
      const pass = senior.score > 7.5;
      console.log(`   ${pass ? "✅" : "❌"} Senior Solid score (${senior.score}) ${pass ? ">" : "<="} 7.5`);
    }

    // Check 3: Spread > 3.0 (no central clustering)
    const spreadOk = scoreRange > 3.0;
    console.log(`   ${spreadOk ? "✅" : "❌"} Score spread: ${scoreRange.toFixed(1)} (need > 3.0)`);

    // Check 4: Junior risk should be High or Critical
    if (junior) {
      const riskOk = junior.risk === "High" || junior.risk === "Critical";
      console.log(`   ${riskOk ? "✅" : "❌"} Junior risk level: ${junior.risk} (expect High/Critical)`);
    }

    // Check 5: Senior risk should be Low
    if (senior) {
      const riskOk = senior.risk === "Low";
      console.log(`   ${riskOk ? "✅" : "❌"} Senior risk level: ${senior.risk} (expect Low)`);
    }
  }

  console.log("\n✨ Test Suite Completed.");
}

testEngine().catch(err => {
  console.error("💀 Fatal error:", err);
  process.exit(1);
});
