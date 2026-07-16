import { useState, useEffect } from "react";
import { Button } from "@/components/design-system/button";
import { MessageSquare, Send, Mic, MicOff } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";

interface Step6InterviewProps {
  journey: any;
  journeyId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step6Interview({ journey, journeyId, onNext, onPrevious }: Step6InterviewProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  const startInterview = async () => {
    setError(null);
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "startInterview",
          journeyId,
          stepData: {
            jobTitle: journey.data?.jobOfferDescription || "Poste cible",
            jobDescription: journey.data?.jobOfferDescription,
            candidateSummary: journey.data?.profile,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSessionId(result.data?.sessionId);
        setIsStarted(true);
        setCanProceed(true);
        setMessages([
          { role: "assistant", content: "Bonjour ! Je suis votre coach d'entretien. Commençons par une première question : pouvez-vous me présenter votre parcours professionnel ?" },
        ]);
      } else {
        setError(result.error || "Erreur lors du démarrage de l'entretien");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages([...messages, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: result.data?.reply || "" }]);
      } else {
        setError(result.error || "Erreur lors de l'envoi du message");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!isStarted) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Simulation d'entretien</h2>
          <p className="text-gray-600">
            Préparez-vous pour votre entretien avec une simulation interactive en temps réel.
          </p>
        </div>

        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-3">Ce à quoi vous attendre</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Questions d'entretien personnalisées</li>
            <li>• Feedback en temps réel</li>
            <li>• Analyse de vos réponses</li>
            <li>• Conseils d'amélioration</li>
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Précédent
          </Button>
          <Button onClick={startInterview} className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Commencer l'entretien
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Simulation d'entretien</h2>
        <p className="text-gray-600">
          Répondez aux questions et recevez un feedback instantané.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Tapez votre réponse..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "error" : "outline"}
          className="flex items-center gap-2"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isRecording ? "Arrêter" : "Micro"}
        </Button>
        <Button onClick={sendMessage} className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          Envoyer
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Voir le rapport final
        </Button>
      </div>
    </div>
  );
}
