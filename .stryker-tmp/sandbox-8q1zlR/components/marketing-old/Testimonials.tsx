// @ts-nocheck
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Martinez",
    role: "Frontend Developer",
    company: "Ex-Candidate → Hired at Spotify",
    image: "/testimonials/sarah.jpg", // À remplacer
    rating: 5,
    text: "J'ai postulé 50 fois sans réponse. Après avoir optimisé mon CV avec AI Career Copilot, j'ai reçu 3 entretiens en 2 semaines. Le simulateur m'a préparé aux questions exactes qu'on m'a posées chez Spotify.",
  },
  {
    name: "Thomas Lefebvre",
    role: "Product Manager Senior",
    company: "Transition Startup → GAFAM",
    image: "/testimonials/thomas.jpg",
    rating: 5,
    text: "Les questions d'entretien générées par l'IA étaient EXACTEMENT celles qu'Amazon m'a posées. La note de 89/100 m'a donné confiance et j'ai décroché l'offre à 120K€.",
  },
  {
    name: "Marie Dubois",
    role: "Data Scientist",
    company: "Reconversion réussie",
    image: "/testimonials/marie.jpg",
    rating: 5,
    text: "En reconversion depuis la finance, mon CV était trop technique. L'analyse ATS m'a aidé à reformuler mon expérience pour le Big Data. Résultat : 5 entretiens sur 8 candidatures.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-4">
        {/* Titre */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Ils ont transformé leur recherche d'emploi
          </h2>
          <p className="text-xl text-gray-400">
            Plus de 1 200 candidats nous font confiance
          </p>
        </div>

        {/* Grille Témoignages */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-red-900/30 bg-gradient-to-br from-red-950/20 to-black p-8 transition-all hover:border-red-700/50 hover:shadow-xl hover:shadow-red-900/30"
            >
              {/* Icône Quote */}
              <Quote className="absolute right-8 top-8 h-12 w-12 text-red-900/30" />

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              {/* Texte */}
              <p className="relative z-10 mb-6 text-gray-300">
                "{testimonial.text}"
              </p>

              {/* Auteur */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                  <p className="text-xs text-red-400">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
