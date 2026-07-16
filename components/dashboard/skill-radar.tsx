"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const loading = () => (
  <div className="h-[350px] w-full bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex flex-col">
    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
      Profil de Compétences
    </h3>
    <div className="flex-1 w-full animate-pulse bg-slate-100 rounded-2xl" />
  </div>
);

const SkillRadar = dynamic(() => import('./skill-radar.client'), { ssr: false, loading });
export default SkillRadar;
