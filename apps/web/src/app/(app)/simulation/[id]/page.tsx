$script = @"
with open('C:/Users/elitebook/Desktop/design/app/page.tsx', encoding='utf-8') as f:
    old = f.read()

new_design = '''\"use client\"

import { useState, useEffect, useRef, useCallback } from \"react\"
import { useRouter } from \"next/navigation\"
import { Mic, Pause, Send, Sparkles } from \"lucide-react\"
import { useVoiceInterview } from \"@/hooks/useVoiceInterview\"

type Message = {
  id: string
  role: \"user\" | \"assistant\"
  content: string
  created_at: string
}

type Session = {
  id: string
  job_title: string
  interview_type: string
  level: string
  duration_seconds: number
  status: string
}

export default function SimulationSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [answer, setAnswer] = useState(\"\")
  const [partialTranscript, setPartialTranscript] = useState(\"\")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const router = useRouter()
  const sessionIdRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const handleTranscript = useCallback(async (text: string, durationMs?: number) => {
    setAnswer(text)
    if (sessionIdRef.current) await submitMessage(text, sessionIdRef.current, durationMs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { startRecording, stopRecording, speakText, cancelSpeaking, markBrainResponse, isRecording, isTranscribing, isSpeaking } = useVoiceInterview({
    onTranscript: handleTranscript,
    onPartialTranscript: (partial) => { setPartialTranscript(partial); setAnswer(partial) },
    onError: (msg) => { setError(msg) },
  })

  useEffect(() => { params.then(({ id }) => { sessionIdRef.current = id; fetchSession(id) }) }, [params])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: \"smooth\" }) }, [messages])

  async function fetchSession(id: string) {
    try {
      const response = await fetch(\"/api/simulation/\" + id)
      if (!response.ok) throw new Error(\"Session introuvable\")
      const data = await response.json()
      setSession(data.session)
      setMessages(data.messages || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : \"Erreur de chargement\")
    } finally {
      setLoading(false)
    }
  }

  async function submitMessage(content: string, sessionId: string, durationMs?: number) {
    if (!content.trim() || sending) return
    setSending(true)
    const formData = new FormData()
    formData.append(\"content\", content)
    formData.append(\"sessionId\", sessionId)
    if (durationMs) formData.append(\"durationMs\", durationMs.toString())
    try {
      const response = await fetch(\"/api/simulation/message\", { method: \"POST\", body: formData })
      if (!response.ok) throw new Error(\"Erreur envoi\")
      await fetchSession(sessionId)
      setAnswer(\"\")
      setPartialTranscript(\"\")
      if (voiceEnabled) {
        markBrainResponse()
        const updatedRes = await fetch(\"/api/simulation/\" + sessionId)
        if (updatedRes.ok) {
          const updated = await updatedRes.json()
          const assistantMsgs: Message[] = (updated.messages || []).filter((m: Message) => m.role === \"assistant\")
          const last = assistantMsgs[assistantMsgs.length - 1]
          if (last?.content) speakText(last.content)
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : \"Erreur inconnue\")
    } finally {
      setSending(false)
    }
  }

  async function handleSubmit() {
    if (sessionIdRef.current) await submitMessage(answer, sessionIdRef.current)
  }

  async function handleEndSession() {
    const { id } = await params
    const formData = new FormData()
    formData.append(\"sessionId\", id)
    try {
      const response = await fetch(\"/api/simulation/end\", { method: \"POST\", body: formData })
      if (response.ok) router.push(\"/dashboard\")
    } catch { setError(\"Erreur fin de session\") }
  }

  async function handleMicClick() {
    if (isRecording) {
      stopRecording()
      setIsListening(false)
    } else {
      if (isSpeaking) cancelSpeaking()
      setVoiceEnabled(true)
      setIsListening(true)
      await startRecording()
    }
  }

  const lastAssistantMessage = messages.filter((m) => m.role === \"assistant\").slice(-1)[0]
  const currentQuestion = lastAssistantMessage?.content ?? \"Chargement de la question...\"
  const messageCount = messages.length
  const progress = Math.min((messageCount / 10) * 100, 100)
  const questionNumber = Math.ceil(messageCount / 2) + 1

  if (loading) return <div className=\"flex h-screen items-center justify-center\"><p className=\"text-sm text-muted-foreground\">Chargement...</p></div>
  if (!session) return null

  return (
    <main className=\"bg-background px-5 py-6 text-foreground sm:px-8\">
      <div className=\"mx-auto flex max-w-6xl flex-col gap-6\">
        <div className=\"mb-2\">
          <p className=\"text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1\">Simulation d entretien</p>
          <h1 className=\"text-3xl font-bold tracking-tight text-foreground\">{session.job_title}</h1>
          <p className=\"mt-1 text-sm text-muted-foreground\">{session.interview_type} · {session.level} · {Math.floor(session.duration_seconds / 60)} minutes</p>
        </div>

        {error && <div className=\"rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive\">{error}</div>}

        <div className=\"grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]\">
          <section className=\"flex min-w-0 flex-col gap-4\">
            <div className=\"relative overflow-hidden rounded-2xl bg-foreground shadow-[0_24px_70px_-28px_rgba(15,23,42,0.5)]\">
              <div className=\"relative flex aspect-video items-center justify-center overflow-hidden bg-slate-950\">
                <img src=\"/interviewer.png\" alt=\"Intervieweuse IA\" className=\"absolute inset-0 size-full scale-[1.2] object-cover object-center\" />
                <div className=\"absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10\" />
                <div className=\"absolute left-5 top-5 flex items-center gap-2 rounded-full bg-slate-950/55 px-3 py-2 text-xs font-medium text-background backdrop-blur-sm\">
                  <span className=\"size-2 animate-pulse rounded-full bg-emerald-400\" />
                  Intervieweur IA
                </div>
                <div className=\"absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 rounded-b-2xl bg-gradient-to-t from-slate-950 via-slate-950/95 to-slate-950/75 px-5 py-5 text-background sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center\">
                  <div className=\"flex items-center gap-2 text-xs text-background/80\"><Mic className=\"size-4 text-primary\" /> Microphone {isRecording ? \"actif\" : \"inactif\"}</div>
                  <div className=\"flex flex-col items-center gap-2\">
                    <button type=\"button\" onClick={handleMicClick} disabled={isTranscribing} aria-label={isRecording ? \"Arreter\" : \"Parler\"} className={\"flex size-16 items-center justify-center rounded-full border-4 border-primary/80 shadow-[0_0_28px_rgba(96,165,250,0.55)] transition-transform hover:scale-105 \" + (isRecording ? \"bg-primary text-primary-foreground\" : \"bg-slate-800 text-background\")}>
                      {isRecording ? <Mic className=\"size-7\" /> : <Pause className=\"size-7\" />}
                    </button>
                    <span className=\"text-sm font-semibold\">{isRecording ? \"Ecoute en cours...\" : isTranscribing ? \"Transcription...\" : isSpeaking ? \"Reponse en cours...\" : \"Parler maintenant\"}</span>
                  </div>
                  <div className=\"flex items-center justify-center gap-1.5 sm:justify-self-end\">
                    {[18, 30, 46, 25, 58, 36, 50, 28, 42, 18].map((height, index) => <span key={index} className={\"w-1 rounded-full \" + (isRecording ? \"bg-primary animate-pulse\" : \"bg-primary/30\")} style={{ height }} />)}
                  </div>
                </div>
              </div>
            </div>
            <p className=\"text-center text-xs text-muted-foreground\">{isRecording ? \"Parlez maintenant, votre reponse sera analysee en direct.\" : \"Activez le microphone pour commencer.\"}</p>
          </section>

          <aside className=\"flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm\">
            <div className=\"flex items-center justify-between text-sm font-medium\"><span>Question {questionNumber} / 5</span><span className=\"text-xs text-muted-foreground\">{Math.round(progress)}%</span></div>
            <div className=\"mt-4 h-1.5 overflow-hidden rounded-full bg-muted\"><div className=\"h-full rounded-full bg-primary transition-all duration-500\" style={{ width: progress + \"%\" }} /></div>
            <div className=\"mt-8 flex items-start gap-3 rounded-xl bg-muted/60 p-4\">
              <div className=\"flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground\"><Sparkles className=\"size-4\" /></div>
              <p className=\"text-base font-medium leading-7\">{currentQuestion}</p>
            </div>
            <div className=\"mt-8 flex flex-1 flex-col gap-3\">
              <label className=\"text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground\">Votre reponse</label>
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder=\"Votre reponse apparaitra ici pendant que vous parlez...\" className=\"min-h-36 flex-1 resize-none rounded-xl border-0 bg-muted/40 p-4 text-sm leading-6 outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-primary\" />
              <button type=\"button\" onClick={handleSubmit} disabled={sending || !answer.trim()} className=\"inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40\"><Send className=\"size-4\" />{sending ? \"Envoi...\" : \"Envoyer ma reponse\"}</button>
              <button type=\"button\" onClick={handleEndSession} className=\"inline-flex h-9 items-center justify-center rounded-xl border border-border text-xs font-medium text-muted-foreground transition-colors hover:text-destructive\">Terminer la session</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
'''

with open('C:/Trajectoire/apps/web/src/app/(app)/simulation/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_design)
print('Done.')
"@
$script | Out-File "C:\Trajectoire\integrate_v2.py" -Encoding utf8
python C:\Trajectoire\integrate_v2.py