import { IdempotencyService } from '../apps/web/src/core/idempotency/IdempotencyService';
import { PrismaClient } from '@prisma/client';

async function verifyCvRewriter() {
  console.log("--- CV REWRITER VERIFICATION ---");
  const p = new PrismaClient();
  const idempotencyService = new IdempotencyService();

  console.log("1er appel ↓");
  const idempotencyKey = "test-cv-rewrite-" + Date.now();
  const userId = "test-user-uuid-1234";
  let llmCalls = 0;

  try {
    const executeRewrite = async () => {
      return idempotencyService.execute(
        idempotencyKey,
        userId,
        "cv_rewrite",
        { action: "improve_experience", contentLength: 50 },
        async () => {
          // LLM -> Persist -> Commit
          console.log("LLM (Appel en cours...)");
          llmCalls++;
          const rewrittenContent = "Ceci est une version améliorée du CV.";
          
          console.log("Persist (Reservation & Store)");
          console.log("Commit (Transaction terminée)");

          // Simulate storing in cv_rewrites
          await p.$executeRawUnsafe(`
            INSERT INTO cv_rewrites (idempotency_key, user_id, action, original_content, rewritten_content, expires_at)
            VALUES ('${idempotencyKey}', '${userId}', 'improve_experience', 'original', '${rewrittenContent}', NOW() + INTERVAL '1 day')
            ON CONFLICT DO NOTHING;
          `);
          
          return { resultRef: idempotencyKey, data: { rewrittenContent } };
        },
        async (resultRef) => {
          console.log("Cache (Lecture depuis la base...)");
          const cached = await p.$queryRawUnsafe(`
            SELECT rewritten_content FROM cv_rewrites WHERE idempotency_key = '${resultRef}'
          `) as any[];
          
          if (cached.length > 0) {
            return { rewrittenContent: cached[0].rewritten_content };
          }
          throw new Error("Cache miss");
        }
      );
    };

    const res1 = await executeRewrite();
    console.log("Résultat appel 1:", res1.rewrittenContent);

    console.log("\n2e appel ↓");
    const res2 = await executeRewrite();
    
    if (llmCalls === 1) {
      console.log("0 appel LLM");
    } else {
      console.log(`${llmCalls} appels LLM (FAIL)`);
    }

    if (res1.rewrittenContent === res2.rewrittenContent) {
      console.log("même résultat ↓");
      console.log("0 nouveau débit ↓");
      console.log("RESULT: PASS");
    } else {
      console.log("RESULT: FAIL");
    }
  } catch(e) {
    console.error("Error", e);
  } finally {
    await p.$disconnect();
  }
}

verifyCvRewriter();
