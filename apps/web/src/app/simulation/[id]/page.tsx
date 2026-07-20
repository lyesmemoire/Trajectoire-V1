"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type Session = {
  id: string;
  job_title: string;
  interview_type: string;
  level: string;
  duration_seconds: number;
  status: string;
};

export default function SimulationSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(({ id: sessionId }) => {
      fetchSession(sessionId);
    });
  }, [params]);

  async function fetchSession(id: string) {
    try {
      const response = await fetch(`/api/simulation/${id}`);
      if (!response.ok) {
        throw new Error("Session introuvable");
      }
      const data = await response.json();
      setSession(data.session);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;

    if (!content.trim()) return;

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/simulation/message", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      // Recharger les messages
      const { id } = await params;
      await fetchSession(id);
      
      // Réinitialiser le formulaire
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSending(false);
    }
  }

  async function handleEndSession() {
    const { id } = await params;
    const formData = new FormData();
    formData.append("sessionId", id);

    try {
      const response = await fetch("/api/simulation/end", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError("Erreur lors de la fin de session");
      }
    } catch (err) {
      setError("Erreur lors de la fin de session");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-600">Chargement de la simulation...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-2"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{session.job_title}</h1>
          <p className="text-slate-600">
            {session.interview_type} · {session.level} · {Math.floor(session.duration_seconds / 60)} minutes
          </p>
        </div>
        <button
          onClick={handleEndSession}
          disabled={sending}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Terminer
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Progression</span>
          <span>{messages.length} messages</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(messages.length / 20 * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            <p>Préparation de votre entretien...</p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6">
        <input type="hidden" name="sessionId" value={session.id} />
        <div className="flex gap-4">
          <textarea
            name="content"
            required
            placeholder="Votre réponse..."
            disabled={sending}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:opacity-50"
            rows={3}
          />
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors self-end disabled:opacity-50"
          >
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </form>
    </div>
  );
}
