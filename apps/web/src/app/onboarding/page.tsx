'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ChevronRight, Upload, FileText, Sparkles, Check, ArrowRight } from "lucide-react"
import { OnboardingResolver } from "@/lib/onboarding/OnboardingResolver"
import { FlowEngine } from "@/lib/onboarding/FlowEngine"
import { OnboardingStep } from "@/types/onboarding"

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [initialized, setInitialized] = useState(false)
  
  // Adaptive onboarding state
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null)
  const [journeyType, setJourneyType] = useState<'full' | 'ats-first' | 'minimal'>('full')
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 })
  const [canSkip, setCanSkip] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)
  
  // Step-specific state
  const [fullName, setFullName] = useState("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [jobFile, setJobFile] = useState<File | null>(null)
  const [matchingComplete, setMatchingComplete] = useState(false)
  const [copilotComplete, setCopilotComplete] = useState(false)
  const [atsAnalysisReady, setAtsAnalysisReady] = useState(false)

  // Initialize adaptive onboarding
  useEffect(() => {
    initializeOnboarding()
  }, [])

  const initializeOnboarding = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Initialize flow
      const flowContext = await FlowEngine.initializeFlow(user.id)
      setJourneyType(flowContext.journey)
      setCanSkip(flowContext.canSkip)
      setCanGoBack(flowContext.canGoBack)

      // Get current step
      const resolution = await OnboardingResolver.resolveOnboarding(user.id)
      setCurrentStep(resolution.currentStep)
      
      // Calculate progress
      if (resolution.currentStep) {
        const stepProgress = await FlowEngine.getFlowContext(user.id)
        setProgress(stepProgress.progress)
      }

      setInitialized(true)
    } catch (err) {
      console.error("Error initializing onboarding:", err)
      setError("Erreur lors de l'initialisation de l'onboarding")
    }
  }

  const handleNext = async () => {
    if (!currentStep) return

    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      // Handle step-specific logic
      if (currentStep.id === 'welcome' && !fullName.trim()) {
        setError("Veuillez entrer votre nom")
        setLoading(false)
        return
      }

      if (currentStep.id === 'welcome') {
        await saveUserData({ fullName })
      }

      // Execute flow action
      const result = await FlowEngine.executeFlowAction(user.id, 'next')
      setCurrentStep(result.currentStep)
      setProgress(prev => ({
        ...prev,
        current: prev.current + 1,
        percentage: Math.round(((prev.current + 1) / prev.total) * 100)
      }))

      // Auto-trigger completion animations
      if (result.currentStep?.id === 'matching') {
        setTimeout(() => setMatchingComplete(true), 2000)
      }
      if (result.currentStep?.id === 'copilot') {
        setTimeout(() => setCopilotComplete(true), 2000)
      }
      if (result.currentStep?.id === 'ats-analysis') {
        setTimeout(() => setAtsAnalysisReady(true), 1500)
      }

      // Check if onboarding is complete
      if (result.isCompleted) {
        await completeOnboarding()
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = async () => {
    if (!currentStep || !canGoBack) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const result = await FlowEngine.executeFlowAction(user.id, 'back')
      setCurrentStep(result.currentStep)
      setProgress(prev => ({
        ...prev,
        current: Math.max(0, prev.current - 1),
        percentage: Math.round((Math.max(0, prev.current - 1) / prev.total) * 100)
      }))
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  const handleSkip = async () => {
    if (!currentStep || !canSkip) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const result = await FlowEngine.executeFlowAction(user.id, 'skip')
      setCurrentStep(result.currentStep)
      
      if (result.isCompleted) {
        await completeOnboarding()
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  const saveUserData = async (data: any) => {
    try {
      const supabase = createClient()
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la synchronisation")
      }
    } catch (err) {
      console.error("Error saving user data:", err)
    }
  }

  const completeOnboarding = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      await saveUserData({ onboardingCompleted: true })
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  if (!initialized) {
    return (
      <div className="min-h-screen bg-ivoire-50 flex items-center justify-center">
        <div className="animate-pulse text-ink-600">Chargement...</div>
      </div>
    )
  }

  const renderStepContent = () => {
    if (!currentStep) return null

    switch (currentStep.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-serif font-bold text-ink-900">
              {journeyType === 'ats-first' ? 'Votre analyse est prête' : 'Bienvenue sur Trajectoire'}
            </h1>
            <p className="text-ink-600">
              {journeyType === 'ats-first' 
                ? 'Découvrez votre rapport ATS et optimisez votre CV.'
                : 'Commençons par vous connaître pour personnaliser votre expérience.'}
            </p>
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-ivoire-300 text-ink-900 bg-white placeholder-ink-400 focus:outline-none focus:border-bronze-400 focus:ring-2 focus:ring-bronze-400/20 transition-all text-lg"
                placeholder="Jean Dupont"
              />
            </div>
          </div>
        )

      case 'upload-cv':
        return (
          <div className="text-center space-y-6">
            <div className="bg-bronze-100 p-8 rounded-2xl border-2 border-dashed border-bronze-300">
              <Upload className="w-12 h-12 text-bronze-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-ink-900">Importez votre CV</h2>
              <p className="text-ink-600 text-sm">PDF, DOCX jusqu'à 10MB</p>
              <Button className="mt-4">Choisir un fichier</Button>
            </div>
            <p className="text-ink-500 text-sm">Vous pourrez importer votre CV plus tard depuis le dashboard.</p>
          </div>
        )

      case 'upload-job':
        return (
          <div className="text-center space-y-6">
            <div className="bg-bronze-100 p-8 rounded-2xl border-2 border-dashed border-bronze-300">
              <FileText className="w-12 h-12 text-bronze-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-ink-900">Importez une fiche de poste</h2>
              <p className="text-ink-600 text-sm">PDF, DOCX jusqu'à 10MB</p>
              <Button className="mt-4">Choisir un fichier</Button>
            </div>
            <p className="text-ink-500 text-sm">Optionnel - vous pourrez l'ajouter plus tard.</p>
          </div>
        )

      case 'matching':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-ink-900">Premier Matching</h2>
            <p className="text-ink-600">Analysons votre profil par rapport au marché.</p>
            {matchingComplete ? (
              <div className="bg-green-100 p-6 rounded-xl">
                <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 font-semibold">Analyse terminée !</p>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-4 bg-ivoire-200 rounded w-48 mx-auto" />
              </div>
            )}
          </div>
        )

      case 'ats-analysis':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-ink-900">Votre analyse ATS</h2>
            <p className="text-ink-600">Consultez votre rapport d'analyse.</p>
            {atsAnalysisReady ? (
              <div className="bg-bronze-100 p-6 rounded-xl">
                <Check className="w-8 h-8 text-bronze-600 mx-auto mb-2" />
                <p className="text-bronze-700 font-semibold">Analyse prête !</p>
                <Link href="/dashboard" className="inline-flex items-center mt-4 text-bronze-600 hover:underline">
                  Voir le rapport <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-4 bg-ivoire-200 rounded w-48 mx-auto" />
              </div>
            )}
          </div>
        )

      case 'copilot':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-ink-900">Découvrez votre Copilot IA</h2>
            <p className="text-ink-600">Votre assistant personnel pour votre carrière.</p>
            {copilotComplete ? (
              <div className="bg-bronze-100 p-6 rounded-xl">
                <Sparkles className="w-8 h-8 text-bronze-600 mx-auto mb-2" />
                <p className="text-bronze-700 font-semibold">Votre copilot est prêt !</p>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-4 bg-ivoire-200 rounded w-48 mx-auto" />
              </div>
            )}
          </div>
        )

      case 'interview':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-ink-900">Entretien IA</h2>
            <p className="text-ink-600">Préparez vos entretiens avec l'IA.</p>
            <div className="bg-bronze-100 p-6 rounded-xl">
              <Sparkles className="w-8 h-8 text-bronze-600 mx-auto mb-2" />
              <p className="text-bronze-700 font-semibold">Simulation d'entretien disponible</p>
            </div>
          </div>
        )

      default:
        return <div>Étape inconnue</div>
    }
  }

  return (
    <div className="min-h-screen bg-ivoire-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="text-2xl font-serif font-bold text-ink-900 mb-8">
        Trajectoire
      </Link>

      {/* Progress bar */}
      {progress.total > 0 && (
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: progress.total }).map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    progress.current > i
                      ? 'bg-bronze-600 text-white'
                      : 'bg-ivoire-200 text-ink-400'
                  }`}
                >
                  {progress.current > i ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < progress.total - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${progress.current > i ? 'bg-bronze-600' : 'bg-ivoire-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-ink-600">
            Étape {progress.current} sur {progress.total} ({progress.percentage}%)
          </p>
        </div>
      )}

      {/* Main card */}
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-ivoire-200 shadow-premium">
        {/* Step content */}
        {renderStepContent()}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-brick-50 border border-brick-100 rounded-xl">
            <p className="text-brick-600 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8">
          {canGoBack && progress.current > 1 && (
            <Button variant="ghost" onClick={handleBack} disabled={loading}>
              Retour
            </Button>
          )}
          <div /> {/* Spacer */}
          <Button
            onClick={handleNext}
            disabled={loading}
            className="bg-bronze-600 hover:bg-bronze-700"
          >
            {progress.current === progress.total ? 'Terminer' : 'Continuer'}
            {progress.current < progress.total && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Skip link */}
        {canSkip && progress.current < progress.total && (
          <p className="mt-6 text-center text-sm text-ink-600">
            <button onClick={handleSkip} className="text-bronze-600 font-medium hover:underline">
              Passer cette étape
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
