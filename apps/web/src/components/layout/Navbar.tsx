"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<string>("FREE");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch subscription plan
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", user.id)
          .single();
        
        if (subscription && typeof subscription === 'object' && 'plan' in subscription) {
          setPlan((subscription as any).plan);
        }
      }
    }

    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const getPlanBadgeColor = () => {
    switch (plan) {
      case "FREE":
        return "bg-slate-100 text-slate-700";
      case "PRO":
        return "bg-blue-100 text-blue-700";
      case "STARTER":
        return "bg-green-100 text-green-700";
      case "EXPERT":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
          >
            Trajectoire
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <Link
                  href="/#features"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="/pricing"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Tarifs
                </Link>
                <Link
                  href="/contact"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Commencer
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/pricing"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Tarifs
                </Link>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor()}`}>
                  {plan}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Se déconnecter"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {!user ? (
              <>
                <Link
                  href="/#features"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="/pricing"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tarifs
                </Link>
                <Link
                  href="/contact"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-3 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full px-4 py-2 text-center text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full px-4 py-2 text-center bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Commencer
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/pricing"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tarifs
                </Link>
                <div className="flex items-center gap-2 py-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor()}`}>
                    {plan}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-center text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Se déconnecter"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
