import React from "react";
import { testimonials } from "./landing-config";
import SectionBadge from "./section-badge";

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="py-24 px-6 border-t border-slate-100 bg-slate-50/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <SectionBadge>Témoignages candidats</SectionBadge>
          <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 tracking-tight leading-tight">
            Ils ont remplacé les candidatures silencieuses par des réponses
            concrètes.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex text-amber-400 text-sm font-display">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm italic leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <strong className="text-slate-800 text-sm font-bold block">
                    {testimonial.author}
                  </strong>
                  <span className="text-slate-500 text-xs font-medium block">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
