"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardSkeleton } from "@/components/design-system";
import { Button } from "@/components/design-system";
import {
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

import { InterviewConfig, RecruiterProfile, MicroState } from "./types/interview";
import { useInterviewChat } from "./hooks/useInterviewChat";
import { useRecruiterBehavior } from "./hooks/useRecruiterBehavior";
import { useInterviewEvaluation } from "./hooks/useInterviewEvaluation";
import { useInterviewReport } from "./hooks/useInterviewReport";

import { InterviewHeader } from "./components/interview/InterviewHeader";
import { RecruiterCard } from "./components/interview/RecruiterCard";
import { ConversationPanel } from "./components/interview/ConversationPanel";
import { MicrophoneControls } from "./components/interview/MicrophoneControls";
import { MicrophoneRecoveryModal } from "@/components/audio/MicrophoneRecoveryModal";
import { RecruiterNotes } from "./components/interview/RecruiterNotes";
import { LiveEvaluation } from "./components/interview/LiveEvaluation";
import { ThinkingIndicator } from "./components/interview/ThinkingIndicator";
import { InterviewFooter } from "./components/interview/InterviewFooter";
import { InterviewProgress } from "./components/interview/InterviewProgress";
import { InterviewSummary } from "./components/interview/InterviewSummary";
import dynamic from "next/dynamic";

const ReportHero = dynamic(() => import("./components/report/ReportHero").then(mod => mod.ReportHero), { loading: () => <CardSkeleton /> });
const GlobalScore = dynamic(() => import("./components/report/GlobalScore").then(mod => mod.GlobalScore), { loading: () => <CardSkeleton /> });
const QuestionAnalysis = dynamic(() => import("./components/report/QuestionAnalysis").then(mod => mod.QuestionAnalysis), { loading: () => <CardSkeleton /> });
const InterviewTimeline = dynamic(() => import("./components/report/InterviewTimeline").then(mod => mod.InterviewTimeline), { loading: () => <CardSkeleton /> });
const Highlights = dynamic(() => import("./components/report/Highlights").then(mod => mod.Highlights), { loading: () => <CardSkeleton /> });
const Improvements = dynamic(() => import("./components/report/Improvements").then(mod => mod.Improvements), { loading: () => <CardSkeleton /> });
const STARAnalysis = dynamic(() => import("./components/report/STARAnalysis").then(mod => mod.STARAnalysis), { loading: () => <CardSkeleton /> });
const LanguageAnalysis = dynamic(() => import("./components/report/LanguageAnalysis").then(mod => mod.LanguageAnalysis), { loading: () => <CardSkeleton /> });
const PostureAnalysis = dynamic(() => import("./components/report/PostureAnalysis").then(mod => mod.PostureAnalysis), { loading: () => <CardSkeleton /> });
const RecruiterVision = dynamic(() => import("./components/report/RecruiterVision").then(mod => mod.RecruiterVision), { loading: () => <CardSkeleton /> });
const Comparison = dynamic(() => import("./components/report/Comparison").then(mod => mod.Comparison), { loading: () => <CardSkeleton /> });
const ActionPlan = dynamic(() => import("./components/report/ActionPlan").then(mod => mod.ActionPlan), { loading: () => <CardSkeleton /> });
const NextSimulation = dynamic(() => import("./components/report/NextSimulation").then(mod => mod.NextSimulation), { loading: () => <CardSkeleton /> });
const Motivation = dynamic(() => import("./components/report/Motivation").then(mod => mod.Motivation), { loading: () => <CardSkeleton /> });

type Screen = "presentation" | "configuration" | "checklist" | "tips" | "simulation" | "summary" | "report";

export default function InterviewSimulationPage() {
  const _searchParams = useSearchParams();
  const [currentScreen, setCurrentScreen] = useState<Screen>("presentation");
  const [config] = useState<InterviewConfig>({
    duration: "standard",
    language: "fr",
    difficulty: "intermediate",
    interviewType: "rh",
    position: "",
    company: "",
    sector: "",
    experience: "",
  });
  const [checklistItems, setChecklistItems] = useState({
    microphone: false,
    permissions: false,
    connection: false,
    audio: false,
    time: false,
  });

  const [elapsedTime] = useState(0);
  const [microState, setMicroState] = useState<MicroState>("idle");
  const [transcription] = useState("");
  const [questionVisible, setQuestionVisible] = useState(false);
  const [microButtonVisible, setMicroButtonVisible] = useState(false);
  const [showSilenceMessage, setShowSilenceMessage] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState("");
  const [_questionCount, setQuestionCount] = useState(0);
  const [totalQuestions] = useState(8);
  const [showMicRecovery, setShowMicRecovery] = useState(false);
  const [micRecoveryReason] = useState<string>("SILENT_FAILURE");

  const { conversationHistory, sendMessage } = useInterviewChat(config);
  const { behavior, privateNotes, getRandomThinkingMessage, addRandomNote, getChallengePhrase, getRandomThinkingDuration, adaptExpressionBasedOnResponse, simulateNoteTaking } = useRecruiterBehavior(config);
  const { liveScores, incrementDifficulty: incrementEvalDifficulty } = useInterviewEvaluation();
  const { report, isLoading: reportLoading, error: reportError } = useInterviewReport({ config, conversationHistory, duration: elapsedTime, liveScores });
  
  const getRecruiterProfile = (): RecruiterProfile => {
    switch (config.interviewType) {
      case "direction":
        return {
          name: "Philippe Martin",
          title: "Directeur GÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ral",
          company: "ExecutivePartners",
          experience: "Cabinet Executive Search ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ 20 ans d'expÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rience",
          traits: ["Calme", "StratÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gique", "TrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨s exigeant"],
          style: "SynthÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tique",
          personality: "Exigeant",
          openingMessage: config.difficulty === "expert"
            ? "Bonjour. Nous allons Ã©changer pendant environ 25 minutes. Je vais vous poser plusieurs questions afin d'Ã©valuer votre capacitÃ© Ã  diriger Ã  un niveau stratÃ©gique. Prenez votre temps."
            : "Bonjour. Merci d'Ãªtre prÃ©sent aujourd'hui.",
        };
      case "technical":
        return {
          name: "Sophie Laurent",
          title: "CTO",
          company: "InnovationTech",
          experience: "Entreprise internationale ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ 15 ans d'expÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rience",
          traits: ["Analytique", "Pragmatique", "Exigeant"],
          style: "Technique",
          personality: "PrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cis",
          openingMessage: "Bonjour. Merci d'ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªtre prÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©sent aujourd'hui.",
        };
      case "commercial":
        return {
          name: "Thomas Bernard",
          title: "VP Commercial",
          company: "GlobalSales",
          experience: "Scale-up en croissance ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ 10 ans d'expÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rience",
          traits: ["Bienveillant", "Dynamique", "Accompagnateur"],
          style: "Dynamique",
          personality: "Enthousiaste",
          openingMessage: "Bonjour. Bienvenue dans cet entretien.",
        };
      default:
        return {
          name: "Claire Dubois",
          title: "Directrice RH",
          company: "TalentCorp",
          experience: "Entreprise internationale ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ 15 ans d'expÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rience",
          traits: ["Analytique", "Exigeante", "Empathique"],
          style: "Comportemental",
          personality: "Exigeante",
          openingMessage: "Bonjour. Bienvenue dans cet entretien.",
        };
    }
  };

  useEffect(() => {
    if (currentScreen === "checklist") {
      const runChecks = async () => {
        await new Promise((r) => setTimeout(r, 500));
        setChecklistItems((prev) => ({ ...prev, microphone: true }));
        await new Promise((r) => setTimeout(r, 500));
        setChecklistItems((prev) => ({ ...prev, permissions: true }));
        await new Promise((r) => setTimeout(r, 500));
        setChecklistItems((prev) => ({ ...prev, connection: true }));
        await new Promise((r) => setTimeout(r, 500));
        setChecklistItems((prev) => ({ ...prev, audio: true }));
        await new Promise((r) => setTimeout(r, 500));
        setChecklistItems((prev) => ({ ...prev, time: true }));
      };
      runChecks();
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === "simulation" && !isInterviewComplete) {
      setQuestionVisible(false);
      setMicroButtonVisible(false);
      
      const timer1 = setTimeout(() => {
        setQuestionVisible(true);
      }, 300);
      
      const timer2 = setTimeout(() => {
        setMicroButtonVisible(true);
      }, 800);
      
      const noteTakingInterval = setInterval(() => {
        if (behavior.isTakingNotes) {
          addRandomNote();
        }
      }, 3000);

      const randomNoteInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          simulateNoteTaking(2000, () => {});
        }
      }, 8000);

      const challengeInterval = setInterval(() => {
        if (Math.random() > 0.8 && config.difficulty !== "beginner") {
          setCurrentChallenge(getChallengePhrase());
          setShowChallenge(true);
          setTimeout(() => setShowChallenge(false), 5000);
        }
      }, 15000);

      let silenceTimer: NodeJS.Timeout;
      const resetSilenceTimer = () => {
        clearTimeout(silenceTimer);
        setShowSilenceMessage(false);
        if (microState === "listening") {
          silenceTimer = setTimeout(() => {
            setShowSilenceMessage(true);
          }, 5000);
        }
      };

      resetSilenceTimer();
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearInterval(noteTakingInterval);
        clearInterval(randomNoteInterval);
        clearInterval(challengeInterval);
        clearTimeout(silenceTimer);
      };
    }
  }, [currentScreen, isInterviewComplete, behavior.isTakingNotes, addRandomNote, simulateNoteTaking, config.difficulty, getChallengePhrase, microState]);

  const handleStart = () => {
    setCurrentScreen("configuration");
  };

  const handleConfigNext = () => {
    setCurrentScreen("checklist");
  };

  const handleChecklistNext = () => {
    setCurrentScreen("tips");
  };

  const handleTipsNext = () => {
    setCurrentScreen("simulation");
  };

  const handleMicroToggle = () => {
    if (microState === "idle") {
      setMicroState("listening");
    } else if (microState === "listening") {
      setMicroState("speaking");
    } else if (microState === "speaking") {
      setMicroState("analyzing");
      setTimeout(() => {
        setMicroState("thinking");
        const thinkingDuration = getRandomThinkingDuration();

        setTimeout(() => {
          setMicroState("idle");
          addRandomNote();
          incrementEvalDifficulty();

          const averageScore = Object.values(liveScores).reduce((total, score) => total + score, 0) / Object.values(liveScores).length;
          adaptExpressionBasedOnResponse(
            averageScore >= 75 ? "good" : averageScore >= 50 ? "average" : "poor",
          );

          void sendMessage({
            text: transcription.trim() || "Je suis prÃƒÆ’Ã‚Âªt ÃƒÆ’Ã‚Â  rÃƒÆ’Ã‚Â©pondre ÃƒÆ’Ã‚Â  votre prochaine question.",
          });

          setQuestionCount((count) => {
            const nextCount = count + 1;
            if (nextCount >= totalQuestions) {
              setTimeout(() => setIsInterviewComplete(true), 2000);
            }
            return nextCount;
          });
        }, thinkingDuration);
      }, 1000);
    }
  };

  const handleEndInterview = () => {
    setIsInterviewComplete(true);
  };

  const handleContinueToReport = () => {
    setCurrentScreen("report");
  };

  const profile = getRecruiterProfile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentScreen === "presentation" && (
            <motion.div
              key="presentation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="bg-white border border-gray-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Simulation d'entretien</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">
                    EntraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®nez-vous avec notre IA pour votre prochain entretien.
                  </p>
                  <Button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700">
                    Commencer
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentScreen === "configuration" && (
            <motion.div
              key="configuration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="bg-white border border-gray-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">Configurez votre entretien.</p>
                  <Button onClick={handleConfigNext} className="bg-blue-600 hover:bg-blue-700">
                    Valider ma configuration
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentScreen === "checklist" && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="bg-white border border-gray-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">VÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(checklistItems).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        {value ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300" />
                        )}
                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleChecklistNext} className="bg-blue-600 hover:bg-blue-700 mt-6">
                    Lancer ma simulation
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentScreen === "tips" && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="bg-white border border-gray-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Conseils</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">Quelques conseils avant de commencer.</p>
                  <Button onClick={handleTipsNext} className="bg-blue-600 hover:bg-blue-700">
                    DÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©marrer mon entretien
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentScreen === "simulation" && !isInterviewComplete && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <InterviewHeader
                config={config}
                elapsedTime={elapsedTime}
                currentQuestion={1}
                totalQuestions={8}
              />
              
              <RecruiterCard profile={profile} behavior={behavior} />
              
              {questionVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8"
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 shadow-sm">
                    <CardContent className="p-8">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Question 1</p>
                      <h3 className="text-2xl font-serif font-semibold text-gray-900 leading-relaxed">
                        Pouvez-vous me parler d'une situation oÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¹ vous avez dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â» gÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rer un conflit important dans votre ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©quipe ?
                      </h3>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {microButtonVisible && !showMicRecovery && (
                <MicrophoneControls
                  microState={microState}
                  onToggle={handleMicroToggle}
                />
              )}

              <div className="flex justify-center w-full my-4">
                <MicrophoneRecoveryModal 
                  isOpen={showMicRecovery}
                  reason={micRecoveryReason}
                  onRetry={() => setShowMicRecovery(false)}
                  onSwitchToText={() => setShowMicRecovery(false)}
                />
              </div>

              {showChallenge && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8"
                >
                  <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Target className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">Challenge</p>
                          <p className="text-sm text-gray-700">{currentChallenge}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <ConversationPanel messages={conversationHistory} transcription={transcription} />

              {showSilenceMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center mb-8"
                >
                  <div className="bg-gray-50 border border-gray-200 rounded-full px-6 py-3">
                    <p className="text-sm text-gray-600">
                      Prenez votre temps. Je suis la pour vous écouter.
                    </p>
                  </div>
                </motion.div>
              )}

              {behavior.isThinking && (
                <ThinkingIndicator message={getRandomThinkingMessage()} />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white border border-gray-200/60 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Suivi en direct</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Scores en direct</p>
                        <LiveEvaluation scores={liveScores} />
                      </div>
                      <InterviewProgress remainingTopics={["Vision stratÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gique", "Prise de dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cision", "Communication", "Innovation", "Leadership"]} />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Conseils IA</p>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-gray-700">
                            Utilisez la mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©thode STAR pour structurer votre rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ponse. Donnez des exemples concrets.
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Notes privÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©es</p>
                        <RecruiterNotes notes={privateNotes} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <InterviewFooter onEnd={handleEndInterview} />
            </motion.div>
          )}

          {isInterviewComplete && (
            <InterviewSummary onContinue={handleContinueToReport} />
          )}

          {currentScreen === "report" && report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {reportLoading && <p>Chargement du rapport...</p>}
              {reportError && <p>Erreur: {reportError}</p>}
              {!reportLoading && !reportError && (
                <>
                  <ReportHero report={report} />
                  <GlobalScore report={report} />
                  <QuestionAnalysis report={report} />
                  <InterviewTimeline report={report} />
                  <Highlights report={report} />
                  <Improvements report={report} />
                  <STARAnalysis report={report} />
                  <LanguageAnalysis report={report} />
                  <PostureAnalysis report={report} />
                  <RecruiterVision report={report} />
                  <Comparison report={report} />
                  <ActionPlan report={report} />
                  <NextSimulation report={report} />
                  <Motivation report={report} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}







