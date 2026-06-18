import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Page introuvable</h1>
      <p className="not-found-description">
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="not-found-actions">
        <Link href="/" className="not-found-link">
          Retour à l&apos;accueil
        </Link>
        <Link href="/dashboard" className="not-found-link-secondary">
          Aller au Dashboard
        </Link>
      </div>
    </div>
  );
}
