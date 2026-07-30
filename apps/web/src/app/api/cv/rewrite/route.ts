import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { IdempotencyService } from '@/core/idempotency/IdempotencyService';
import { BillingService } from '@/lib/db/billing.service';
import { improveExperience, rewriteSummary, generateImpactMetrics } from '@/lib/ai/cv-rewriter';
import { logger } from '@/lib/logger';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const REWRITE_COST = 2; // Fixed cost in credits

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  let body: { action: string; content: string; role?: string; context?: string };
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const { action, content, role, context } = body;
  if (!action || (!content && !role)) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  // Derive idempotency key from user + action + content + 10min time window.
  // Same content within the same 10min window = same key = no double charge.
  // After 10min, a new window opens and the user can request a fresh rewrite.
  const timeWindow = Math.floor(Date.now() / (10 * 60 * 1000)); // 10-minute buckets
  const contentToHash = action === 'generate_impact_metrics' ? `${role}-${context}` : content;
  const contentHash = crypto.createHash('sha256').update(`${user.id}:${action}:${contentToHash}:${timeWindow}`).digest('hex').slice(0, 32);
  const providedKey = request.headers.get("Idempotency-Key");
  
  // Use the provided key or fallback to the deterministic hash
  const effectiveIdempKey = providedKey || `rewrite-${contentHash}`;

  const ENABLE_ATS_BILLING = process.env.ENABLE_ATS_BILLING === 'true';

  if (ENABLE_ATS_BILLING && !providedKey && request.headers.get("X-Strict-Idempotency") === 'true') {
    return NextResponse.json(
      { error: 'Idempotency-Key header is required' },
      { status: 400 }
    );
  }

  const idempotencyService = new IdempotencyService();

  try {
    const finalResult = await idempotencyService.execute(
      effectiveIdempKey,
      user.id,
      "cv_rewrite",
      { action, contentLength: content?.length },
      async () => {
        let txId: string | undefined;

        // 1. Reserve Credits
        if (ENABLE_ATS_BILLING) {
          const reserveResult = await BillingService.reserveCredits({
            userId: user.id,
            amount: REWRITE_COST,
            action: "cv_rewrite" as any,
            operationId: effectiveIdempKey,
          });

          if (!reserveResult.success) {
            throw new Error(`BILLING_ERROR:${reserveResult.error}`);
          }
          txId = reserveResult.txId;
        }

        // 2. LLM Call
        let rewrittenContent = "";
        try {
          if (action === 'rewrite_summary') {
            rewrittenContent = await rewriteSummary(content);
          } else if (action === 'improve_experience') {
            rewrittenContent = await improveExperience(content);
          } else if (action === 'generate_impact_metrics' && role && context) {
            rewrittenContent = await generateImpactMetrics(role, context);
          } else {
            throw new Error("Action non supportée");
          }
        } catch (err: any) {
          if (txId) {
            await BillingService.rollbackCredits(txId, err.message);
          }
          throw err;
        }

        // 3. Commit Credits
        if (txId) {
          await BillingService.commitCredits(txId, 0);
        }

        // 4. Store result in cv_rewrites table for cache HIT retrieval
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

        await prisma.cvRewrite.create({
          data: {
            userId: user.id,
            idempotencyKey: effectiveIdempKey,
            action: action,
            originalContent: content || '',
            rewrittenContent: rewrittenContent,
            expiresAt: expiresAt,
          },
        });

        return {
          resultRef: effectiveIdempKey,
          data: { rewrittenContent }
        };
      },
      async (resultRef) => {
        // Cache HIT: Retrieve from cv_rewrites table
        const cached = await prisma.cvRewrite.findUnique({
          where: { idempotencyKey: resultRef },
        });

        if (!cached) {
          throw new Error("Cached rewrite not found - may have expired");
        }

        if (cached.expiresAt < new Date()) {
          throw new Error("Cached rewrite has expired");
        }

        return { rewrittenContent: cached.rewrittenContent };
      }
    );

    return NextResponse.json({
      success: true,
      data: finalResult.rewrittenContent,
    });

  } catch (err: any) {
    if (err.message.startsWith("BILLING_ERROR:")) {
      return NextResponse.json(
        { error: 'Crédits insuffisants ou erreur de facturation' },
        { status: 402 }
      );
    }

    logger.error({
      event: 'CV rewrite — error',
      userId: user.id,
      message: err.message,
    });

    return NextResponse.json({ error: 'Erreur lors de la réécriture' }, { status: 500 });
  }
}
