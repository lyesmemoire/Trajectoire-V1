import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

/**
 * Page racine — Landing page marketing.
 *
 * - Utilisateur connecté  → redirect /dashboard
 * - Visiteur non connecté → landing page complète
 */
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="landing-page">
      {/* ── Navigation ── */}
      <nav className="landing-nav">
        <span className="landing-nav-brand">Trajectoire</span>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">
            Fonctionnalités
          </a>
          <a href="#how-it-works" className="landing-nav-link">
            Comment ça marche
          </a>
          <a href="#pricing" className="landing-nav-link">
            Tarifs
          </a>
          <Link href="/login" className="landing-nav-link">
            Connexion
          </Link>
          <Link href="/register" className="landing-nav-cta">
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <span>✦</span>
          <span>Évaluation professionnelle par IA · Résultats en 20 min</span>
        </div>

        <h1 className="landing-hero-title">
          Découvrez votre{" "}
          <span className="landing-hero-title-gradient">
            véritable potentiel
          </span>{" "}
          professionnel
        </h1>

        <p className="landing-hero-subtitle">
          Trajectoire analyse vos compétences comportementales et cognitives
          à travers un entretien vocal piloté par IA. Obtenez un rapport
          exécutif détaillé — comme les candidats des cabinets de recrutement
          haut de gamme.
        </p>

        <div className="landing-hero-actions">
          <Link href="/register" className="landing-btn-primary">
            Démarrer mon évaluation →
          </Link>
          <a href="#how-it-works" className="landing-btn-secondary">
            Voir comment ça fonctionne
          </a>
        </div>

        <p className="landing-hero-trust">
          Sans carte bancaire · 1 rapport gratuit · Résultats confidentiels
        </p>
      </section>

      {/* ── Fonctionnalités ── */}
      <section id="features" className="landing-section">
        <p className="landing-section-label">Fonctionnalités</p>
        <h2 className="landing-section-title">
          Un assessment complet en une seule session
        </h2>
        <p className="landing-section-subtitle">
          Notre IA reproduit les méthodes d&apos;évaluation des cabinets
          spécialisés, accessibles à tous, à tout moment.
        </p>

        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🎙️</div>
            <h3 className="landing-feature-title">Entretien vocal piloté par IA</h3>
            <p className="landing-feature-desc">
              Un entretien structuré de 20 minutes, guidé par notre IA,
              pour évaluer vos compétences comportementales avec précision.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">📊</div>
            <h3 className="landing-feature-title">Rapport exécutif détaillé</h3>
            <p className="landing-feature-desc">
              Analyse multidimensionnelle : leadership, communication, gestion
              du stress, prise de décision et intégrité professionnelle.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">🏆</div>
            <h3 className="landing-feature-title">Score percentile</h3>
            <p className="landing-feature-desc">
              Situez-vous par rapport à d&apos;autres professionnels. Comprenez
              vos points forts et vos axes de développement prioritaires.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">🔒</div>
            <h3 className="landing-feature-title">Confidentialité totale</h3>
            <p className="landing-feature-desc">
              Vos données ne sont jamais partagées. Votre rapport est
              accessible uniquement depuis votre espace personnel.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">⚡</div>
            <h3 className="landing-feature-title">Résultats immédiats</h3>
            <p className="landing-feature-desc">
              Votre rapport est généré dès la fin de l&apos;entretien.
              Pas d&apos;attente, pas d&apos;intermédiaire humain.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">🎯</div>
            <h3 className="landing-feature-title">Simulation de décisions</h3>
            <p className="landing-feature-desc">
              Analyse de vos réponses à des scénarios de décision complexes
              pour révéler votre style managérial réel.
            </p>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <div id="how-it-works" className="landing-steps-container">
        <div className="landing-steps-inner">
          <p className="landing-section-label">Processus</p>
          <h2 className="landing-section-title">
            De l&apos;inscription au rapport en 3 étapes
          </h2>

          <div className="landing-steps-grid">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3 className="landing-step-title">Créez votre compte</h3>
              <p className="landing-step-desc">
                Inscription en 30 secondes. Aucune carte bancaire requise
                pour démarrer votre premier entretien.
              </p>
            </div>

            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3 className="landing-step-title">Passez l&apos;entretien</h3>
              <p className="landing-step-desc">
                Notre IA vous pose des questions structurées et analyse
                vos réponses vocales en temps réel. Durée : 15 à 25 minutes.
              </p>
            </div>

            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3 className="landing-step-title">Consultez votre rapport</h3>
              <p className="landing-step-desc">
                Accédez immédiatement à votre rapport exécutif complet,
                avec scores, analyse narrative et recommandations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pricing ── */}
      <section id="pricing" className="landing-section">
        <p className="landing-section-label">Tarifs</p>
        <h2 className="landing-section-title">
          Simple, transparent, sans engagement
        </h2>
        <p className="landing-section-subtitle">
          Commencez gratuitement. Passez au Pro pour débloquer l&apos;intégralité
          de votre rapport exécutif.
        </p>

        <div className="landing-pricing-grid">
          {/* Plan Gratuit */}
          <div className="landing-pricing-card">
            <p className="landing-pricing-plan">Gratuit</p>
            <div className="landing-pricing-price">
              <span className="landing-pricing-amount">0€</span>
              <span className="landing-pricing-period">/mois</span>
            </div>
            <p className="landing-pricing-desc">
              Pour découvrir Trajectoire et réaliser votre premier entretien.
            </p>
            <ul className="landing-pricing-features">
              <li className="landing-pricing-feature">
                <span className="landing-pricing-check">✓</span>
                1 entretien vocal complet
              </li>
              <li className="landing-pricing-feature">
                <span className="landing-pricing-check">✓</span>
                Aperçu du rapport (scores globaux)
              </li>
              <li className="landing-pricing-feature">
                <span className="landing-pricing-check">✓</span>
                Accès à votre espace personnel
              </li>
            </ul>
            <Link href="/register" className="landing-pricing-cta secondary">
              Commencer gratuitement
            </Link>
          </div>

          {/* Plan Pro */}
          <div className="landing-pricing-card featured">
            <span className="landing-pricing-badge">
              Early adopter — offre limitée
            </span>
            <p className="landing-pricing-plan">Pro</p>
            <div className="landing-pricing-price">
              <span className="landing-pricing-amount">19€</span>
              <span className="landing-pricing-period">/mois</span>
            </div>
            <p className="landing-pricing-desc">
              Accès illimité à l&apos;analyse complète. Prix early adopter
              (habituellement 29€/mois).
            </p>
            <ul className="landing-pricing-features">
              <li className="landing-pricing-feature">
                <span className="landing-pricing-check">✓</span>
                Entretiens illimités
              </li>
              <li className="landing-pricing-feature">
                <span className="landing-pricing-check">✓</span>
                Rapport exécutif complet (toutes sections)
              </li>
              <li className="landing-pricing-feature">
                <span className="landing-pricing-check">✓</span>
                Analyse narrative IA approfondie
              </li>
              <li className="landing-pricing-feature">
                <span className="landing-pricing-check">✓</span>
                Simulation de décisions &amp; intégrité
              </li>
              <li className="landing-pricing-feature">
                <span className="landing-pricing-check">✓</span>
                Historique de tous vos entretiens
              </li>
            </ul>
            <Link href="/register" className="landing-pricing-cta primary">
              Démarrer l&apos;évaluation Pro →
            </Link>
          </div>
        </div>

        <p className="landing-pricing-note">
          Sans engagement · Annulable à tout moment · Paiement sécurisé Stripe
        </p>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="landing-footer">
          <span className="landing-footer-brand">Trajectoire</span>
          <span className="landing-footer-copy">
            © {new Date().getFullYear()} Trajectoire. Tous droits réservés.
          </span>
          <div className="landing-footer-links">
            <Link href="/login" className="landing-footer-link">
              Connexion
            </Link>
            <Link href="/register" className="landing-footer-link">
              Inscription
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
