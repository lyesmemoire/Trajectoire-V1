"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string) => {
    setLoading(plan)
    try {
      // In development, skip Stripe and go directly to dashboard
      if (process.env.NODE_ENV === 'development') {
        router.push('/dashboard')
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        console.error('Payment failed')
        router.push('/signup')
      }
    } catch (error) {
      console.error('Payment error:', error)
      router.push('/signup')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-ivoire-50">
      <section className="bg-ivoire-50 py-20 md:py-36">
        <div className="max-w-5xl mx-auto px-5 md:px-6 text-center">

          <p className="text-xs tracking-[0.2em] uppercase text-bronze-700 mb-6">
            Tarifs
          </p>

          <h1 className="
            text-4xl
            md:text-5xl
            font-serif
            font-semibold
            tracking-tight
            text-ink-900
          ">
            Un investissement structuré.
          </h1>

          <p className="mt-6 text-lg text-ink-600">
            Pour une progression mesurable.
          </p>

          <div className="mt-24 grid md:grid-cols-3 gap-10">

            {/* Starter */}
            <div className="p-12 bg-white/70 backdrop-blur-xl border border-ivoire-200 rounded-2xl text-left shadow-premium">
              <h3 className="text-lg font-serif font-semibold text-ink-900 mb-2">
                Starter
              </h3>
              <p className="text-sm text-ink-600 mb-8">
                Pour commencer.
              </p>
              <p className="text-4xl font-serif font-semibold text-ink-900 mb-2">
                29€
              </p>
              <p className="text-ink-400 text-sm mb-10">
                / mois
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => handleSubscribe('starter')}
                disabled={loading === 'starter'}
              >
                {loading === 'starter' ? 'Chargement...' : 'Choisir Starter'}
              </Button>
            </div>

            {/* Pro — Recommandé */}
            <div className="
              p-12
              bg-white/70 backdrop-blur-xl
              border-2 border-bronze-600
              rounded-2xl
              text-left
              relative
              shadow-premium-lg
            ">
              <div className="
                absolute
                -top-4
                left-1/2
                -translate-x-1/2
                bg-bronze-600
                text-white
                text-xs
                px-4
                py-1
                rounded-full
                font-medium
                uppercase tracking-wide
              ">
                Recommandé
              </div>

              <h3 className="text-lg font-serif font-semibold text-ink-900 mb-2">
                Pro
              </h3>
              <p className="text-sm text-ink-600 mb-8">
                Pour performer.
              </p>
              <p className="text-5xl font-serif font-semibold text-ink-900 mb-2">
                59€
              </p>
              <p className="text-ink-400 text-sm mb-10">
                / mois
              </p>
              <Button 
                variant="premium" 
                className="w-full"
                onClick={() => handleSubscribe('pro')}
                disabled={loading === 'pro'}
              >
                {loading === 'pro' ? 'Chargement...' : 'Choisir Pro'}
              </Button>
            </div>

            {/* Expert */}
            <div className="p-12 bg-ink-900 border-2 border-ink-900 rounded-2xl text-left shadow-premium-lg">
              <h3 className="text-lg font-serif font-semibold text-bronze-400 mb-2">
                Expert
              </h3>
              <p className="text-sm text-ink-400 mb-8">
                Pour dominer.
              </p>
              <p className="text-4xl font-serif font-semibold text-bronze-400 mb-2">
                99€
              </p>
              <p className="text-ink-500 text-sm mb-10">
                / mois
              </p>
              <Button 
                variant="secondary" 
                className="w-full bg-white text-ink-900 border-white hover:bg-ivoire-100"
                onClick={() => handleSubscribe('expert')}
                disabled={loading === 'expert'}
              >
                {loading === 'expert' ? 'Chargement...' : 'Choisir Expert'}
              </Button>
            </div>

          </div>

        </div>
      </section>
    </div>
  )
}
