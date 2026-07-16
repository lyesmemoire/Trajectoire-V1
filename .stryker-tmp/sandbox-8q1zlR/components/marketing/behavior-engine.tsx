// @ts-nocheck
"use client";

import React from "react";
import { Cpu, Database } from "lucide-react";
import { HOME_STRATEGY } from "@/lib/marketing/homepage-copy";

export function BehavioralEngineSection() {
  return (
    <section className="section px-6 bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-full">
              <Cpu className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-medium tracking-[1.5px] uppercase text-[var(--text-secondary)]">
                Technologie avancée
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] leading-none">
              {HOME_STRATEGY.engine.title}
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed">
              {HOME_STRATEGY.engine.subtitle}
            </p>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {HOME_STRATEGY.engine.features.map((feature, i) => (
              <div
                key={i}
                className="card p-8 space-y-5"
              >
                <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {feature.title}
                </h3>
                <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
