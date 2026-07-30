'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NavbarProps {
  isAuthenticated?: boolean
  userPlan?: 'free' | 'starter' | 'pro' | 'expert'
  userName?: string
}

const navLinks = [
  { href: '/analyze', label: 'Analyser' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/history', label: 'Historique' },
  { href: '/pricing', label: 'Tarifs' },
]

export function Navbar({
  isAuthenticated = false, userPlan = 'free', userName }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-ivoire-50/80 backdrop-blur-md border-b border-ivoire-200">
      <nav className="max-w-7xl mx-auto px-6 h-[73px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl text-ink-900 tracking-tight"
        >
          Trajectoire
        </Link>

        {/* Desktop nav links */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-sm font-medium transition-colors duration-200
                    ${active ? 'text-ink-900' : 'text-ink-400 hover:text-ink-900'}
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Badge variant={userPlan === 'starter' ? 'free' : userPlan} />

              <span className="text-sm text-ink-600">{userName}</span>

              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  Paramètres
                </Button>
              </Link>

              <button
                onClick={handleLogout}
                className="
                  p-2 rounded-full text-ink-400 hover:text-ink-900 hover:bg-ivoire-100
                  transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-400
                "
                aria-label="Se déconnecter"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Commencer
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-400 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-ivoire-50/95 backdrop-blur-md border-t border-ivoire-200 px-6 py-6 space-y-4">
          {isAuthenticated &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-base font-medium text-ink-700 hover:text-ink-900"
              >
                {link.label}
              </Link>
            ))}

          <div className="pt-4 border-t border-ivoire-200 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant={userPlan === 'starter' ? 'free' : userPlan} />
                  <span className="text-sm text-ink-600">{userName}</span>
                </div>
                <Button variant="secondary" onClick={handleLogout}>
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button variant="primary" className="w-full">
                    Commencer
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
