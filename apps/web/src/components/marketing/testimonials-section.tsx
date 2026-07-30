import React from "react"
import { testimonials } from "./landing-config"
import SectionBadge from "./section-badge"

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="section px-6 border-t border-ivoire-200/20 bg-ink-900"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <SectionBadge>Témoignages candidats</SectionBadge>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight leading-tight">
            Ils ont remplacé les candidatures silencieuses par des réponses
            concrètes.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-ink-800 rounded-3xl p-8 border border-ivoire-200/20 shadow-premium flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex text-bronze-400 text-sm font-display">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-ink-400 text-sm italic leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-ivoire-200/20 mt-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bronze-500 to-ink-600 text-ivoire-50 flex items-center justify-center font-bold text-xs shadow-premium">
                  {testimonial.initials}
                </div>
                <div>
                  <strong className="text-ivoire-50 text-sm font-bold block">
                    {testimonial.author}
                  </strong>
                  <span className="text-ink-400 text-xs font-medium block">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
