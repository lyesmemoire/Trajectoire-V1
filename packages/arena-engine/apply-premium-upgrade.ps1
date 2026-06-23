Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step { param($m) Write-Host "`n* $m" -ForegroundColor Cyan }
function Write-Ok   { param($m) Write-Host "  [OK] $m" -ForegroundColor Green }
function Write-Warn { param($m) Write-Host "  [WARN] $m" -ForegroundColor Yellow }

function Backup-File {
    param($Path)
    if (Test-Path $Path) {
        $backup = "$Path.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item $Path $backup
        Write-Warn "Backup créé : $backup"
    }
}

function Write-UTF8 {
    param($Path, $Content)
    $dir = Split-Path $Path -Parent
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    [System.IO.File]::WriteAllText(
        (Join-Path (Get-Location) $Path),
        $Content,
        [System.Text.UTF8Encoding]::new($false)
    )
    Write-Ok $Path
}

Write-Host "`nPremium Upgrade - Safe Deployment Mode" -ForegroundColor Magenta
Write-Host "   $(Get-Location)`n"

# ============================================================
# 1. Replace premium-prompt.ts
# ============================================================

Write-Step "Updating premium-prompt.ts"

Backup-File "lib\interview\premium-prompt.ts"

$contentPrompt = @'
import { PremiumInterviewSession } from "@/types/premium-interview"

export function buildPremiumPrompt(
  session: PremiumInterviewSession,
  transcript: { role: "interviewer" | "candidate"; content: string }[]
) {
  return [
    {
      role: "system",
      content: `
You are simulating a REAL job interview.

You are NOT an AI assistant.
You are a professional recruiter.

PERSONA:
${getPersonaDescription(session.persona)}

INTERVIEW CONTEXT:
- Job Title: ${session.jobTitle}
- Company: ${session.company ?? "Not specified"}
- Phase: ${session.phase}
- Difficulty: ${session.difficulty}
- Stress Level: ${session.stressLevel}/100

BEHAVIOR RULES:
- React to the candidate’s previous answer.
- Interrupt vague answers.
- Ask follow-up questions.
- Increase difficulty if answers are strong.
- Apply pressure if stress level > 60.
- Never explain your reasoning.
- Keep reply under 120 words.

SCORING:
Return STRICT JSON only.

{
  "reply": "string",
  "internal_analysis": {
    "answer_quality": "weak | average | strong | excellent",
    "detected_issues": [],
    "next_phase": "intro | cv_deep_dive | technical_case | behavioral | pressure_test | closing",
    "stress_delta": number,
    "scores_delta": {
      "technical": number,
      "coherence": number,
      "confidence": number
    }
  }
}
`
    },
    ...transcript.map((m) => ({
      role: m.role === "candidate" ? "user" : "assistant",
      content: m.content,
    })),
  ]
}

function getPersonaDescription(persona: string) {
  switch (persona) {
    case "big_tech_senior":
      return "You are a FAANG Senior Engineering Manager. You demand metrics and depth."
    case "technical_lead":
      return "You focus on implementation details and architecture."
    case "aggressive_recruiter":
      return "You are direct and high-pressure."
    case "startup_founder":
      return "You value ownership and impact."
    default:
      return "You are a structured corporate HR interviewer."
  }
}
'@

Write-UTF8 "lib\interview\premium-prompt.ts" $contentPrompt

# ============================================================
# 2. Replace continue route
# ============================================================

Write-Step "Updating continue route"

Backup-File "app\api\interview\premium\continue\route.ts"

$contentRoute = @'
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { requireAuth } from "@/lib/auth"
import { getOpenAIClient } from "@/lib/openai"
import { buildPremiumPrompt } from "@/lib/interview/premium-prompt"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { sessionId, answer } = await req.json()

  const { data: session } = await (supabase as any)
    .from("premium_interview_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  const transcript = [
    ...session.transcript,
    { role: "candidate", content: answer },
  ]

  const openai = getOpenAIClient()

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: buildPremiumPrompt(session, transcript) as any,
  })

  const raw = completion.choices[0].message.content ?? "{}"

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "Invalid AI response" }, { status: 500 })
  }

  const reply = parsed.reply
  const analysis = parsed.internal_analysis

  const newStress = Math.min(
    100,
    Math.max(0, session.stress_level + analysis.stress_delta)
  )

  const updatedTranscript = [
    ...transcript,
    { role: "interviewer", content: reply },
  ]

  await (supabase as any)
    .from("premium_interview_sessions")
    .update({
      transcript: updatedTranscript,
      phase: analysis.next_phase,
      stress_level: newStress,
      technical_score:
        session.technical_score + analysis.scores_delta.technical,
      coherence_score:
        session.coherence_score + analysis.scores_delta.coherence,
      confidence_score:
        session.confidence_score + analysis.scores_delta.confidence,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)

  return NextResponse.json({ reply })
}
'@

Write-UTF8 "app\api\interview\premium\continue\route.ts" $contentRoute

# ============================================================
# 3. Verify TypeScript
# ============================================================

Write-Step "Checking TypeScript"

$tsc = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Ok "TypeScript OK"
} else {
  Write-Warn "TypeScript errors detected:"
  $tsc | Select-Object -First 20
  exit 1
}

Write-Host "`nPremium upgrade applied safely." -ForegroundColor Green
