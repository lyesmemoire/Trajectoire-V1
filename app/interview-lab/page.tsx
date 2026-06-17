"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Target, 
  Zap, 
  UserCircle, 
  Clock, 
  FileText, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InterviewLabPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [targetLevel, setTargetLevel] = useState("Direction");
  const [difficulty, setDifficulty] = useState("Exigeant");
  const [recruiterStyle, setRecruiterStyle] = useState("Direct orienté résultats");
  const [duration, setDuration] = useState("15 min");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const OptionSelector = ({ 
    label, 
    options, 
    currentValue, 
    setter, 
    icon: Icon 
  }: { 
    label: string, 
    options: string[], 
    currentValue: string, 
    setter: (val: string) => void,
    icon: any 
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
          {label}
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setter(option)}
            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
              currentValue === option 
                ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]" 
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            Simuler votre entretien stratégique
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-medium"
          >
            Préparez l'entretien exact que vous allez passer.
          </motion.p>
        </div>

        {/* Main Form */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 space-y-12"
              >
                {/* Step 1: Job Title */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Poste visé
                    </label>
                  </div>
                  <input 
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Ex: Directeur des Opérations, VP Engineering..."
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-200 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>

                {/* Step 2: Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Description du poste
                    </label>
                  </div>
                  <textarea 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Collez la description du poste (fortement recommandé)..."
                    className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-200 outline-none transition-all text-slate-900 font-medium resize-none"
                  />
                </div>

                {/* Step 3: CV Upload */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Votre CV
                    </label>
                  </div>
                  <div className="relative group">
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".pdf,.docx"
                    />
                    <div className={`w-full p-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 ${
                      fileName ? "border-slate-900 bg-slate-50" : "border-slate-200 group-hover:border-slate-300 bg-white"
                    }`}>
                      <div className="p-3 bg-slate-100 rounded-full">
                        <Upload className={`w-5 h-5 ${fileName ? "text-slate-900" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {fileName ? fileName : "Importer votre CV (PDF, DOCX)"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Ce document servira à calibrer les questions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex justify-center">
                  <Button 
                    className="px-12 py-7 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center gap-3 group"
                    onClick={() => setStep(2)}
                  >
                    Continuer
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 space-y-12"
              >
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Modifier le contexte
                </button>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                  <OptionSelector 
                    label="Niveau ciblé" 
                    options={["Senior", "Direction", "Board"]} 
                    currentValue={targetLevel} 
                    setter={setTargetLevel}
                    icon={UserCircle}
                  />
                  <OptionSelector 
                    label="Difficulté" 
                    options={["Standard", "Exigeant", "Board-level"]} 
                    currentValue={difficulty} 
                    setter={setDifficulty}
                    icon={Zap}
                  />
                  <OptionSelector 
                    label="Style recruteur" 
                    options={["Bienveillant structuré", "Direct orienté résultats", "Challengeant stratégique"]} 
                    currentValue={recruiterStyle} 
                    setter={setRecruiterStyle}
                    icon={UserCircle}
                  />
                  <OptionSelector 
                    label="Durée" 
                    options={["10 min", "15 min", "20 min"]} 
                    currentValue={duration} 
                    setter={setDuration}
                    icon={Clock}
                  />
                </div>

                <div className="mt-10 p-6 rounded-xl border border-neutral-200 bg-white">
                  <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">
                    Transformation attendue
                  </p>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Cette simulation vise à transformer votre posture :
                    passer d’un discours descriptif à une autorité décisionnelle explicite.
                  </p>
                </div>

                <div className="pt-10 flex justify-center">
                  <Button 
                    className="px-12 py-7 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center gap-3 group"
                    onClick={() => alert("Lancement de la simulation...")}
                  >
                    Démarrer l’entretien stratégique
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer hint */}
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            Algorithme de simulation calibré pour les postes de Direction
          </p>
        </div>
      </div>
    </div>
  );
}
