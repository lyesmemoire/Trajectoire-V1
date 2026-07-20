"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Mail } from "lucide-react";

export default function ContactPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          ← Retour à l'accueil
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Contactez-nous</h1>
          <p className="text-slate-600 mb-8">
            Une question ? Nous répondons sous 24h.
          </p>

          <div className="bg-slate-50 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg" aria-hidden="true">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                <a
                  href="mailto:support@trajectoire.app"
                  className="text-blue-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  support@trajectoire.app
                </a>
              </div>
            </div>
          </div>

          {user && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Retour au tableau de bord
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
