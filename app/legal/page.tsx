export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">
          Mentions Légales
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">
              Éditeur du site
            </h2>
            <p className="text-gray-600">
              Le présent site est édité par Trajectoire.
            </p>
          </section>

          <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">
              Hébergement
            </h2>
            <p className="text-gray-600">
              Le site est hébergé par Vercel Inc.
            </p>
          </section>

          <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">
              Propriété intellectuelle
            </h2>
            <p className="text-gray-600">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">
              Contact
            </h2>
            <p className="text-gray-600">
              Pour toute question relative aux mentions légales, vous pouvez nous contacter via le formulaire de contact disponible sur le site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
