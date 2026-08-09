// apps/web/src/app/signup-conversion/page.tsx
//
// Page de signup avec contexte de conversion
// MVP-009 — Conversion Funnel

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Chrome, Github, Mail, ArrowLeft } from 'lucide-react'
import { PreviewTokenManager } from '@/lib/preview-analysis/previewTokenManager'

export default function SignupConversionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [acceptCGU, setAcceptCGU] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword || !fullName) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (!acceptCGU) {
      setError('Vous devez accepter les conditions d\'utilisation.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (signUpError) throw signUpError

      setSuccess(true)

      // Auto-claim de la preview si un token existe
      const previewToken = PreviewTokenManager.getSessionToken()
      if (previewToken) {
        try {
          await fetch('/api/auth/claim-preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ previewToken }),
          })
          PreviewTokenManager.clearSessionToken()
          
          // Rediriger vers /welcome après claim réussi
          setTimeout(() => {
            router.push('/welcome')
          }, 1000)
        } catch (err) {
          console.error('Error claiming preview:', err)
        }
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const { data, error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      // OAuth redirect will happen automatically
    }
  }

  const handleGithubSignIn = async () => {
    const { data, error } = await createClient().auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      // OAuth redirect will happen automatically
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-ivoire-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-premium text-center">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-ink-900 mb-2">
            Compte créé avec succès !
          </h2>
          <p className="text-ink-600 mb-6">
            Vérifiez votre email pour activer votre compte.
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Aller au dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivoire-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-ink-600 hover:text-ink-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-premium">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-ink-900 mb-2">
              Créez votre compte
            </h1>
            <p className="text-ink-600">
              Sauvegardez votre analyse et accédez à toutes les fonctionnalités
            </p>
          </div>

          {/* Social Sign In */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={handleGoogleSignIn}
              variant="secondary"
              className="w-full h-12"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continuer avec Google
            </Button>
            <Button
              onClick={handleGithubSignIn}
              variant="secondary"
              className="w-full h-12"
            >
              <Github className="w-5 h-5 mr-2" />
              Continuer avec Github
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ivoire-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-ink-500">ou</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-ink-900 mb-1">
                Nom complet
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-900 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-900 mb-1">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-900 mb-1">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="cgu"
                checked={acceptCGU}
                onChange={(e) => setAcceptCGU(e.target.checked)}
                className="mt-1"
                required
              />
              <label htmlFor="cgu" className="text-sm text-ink-600">
                J'accepte les{' '}
                <a href="/terms" className="underline hover:text-ink-900">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="underline hover:text-ink-900">
                  politique de confidentialité
                </a>
              </label>
            </div>

            {error && (
              <p className="text-sm text-brick-600 bg-brick-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-600 mt-6">
            Déjà un compte ?{' '}
            <a href="/login" className="font-medium text-ink-900 hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
