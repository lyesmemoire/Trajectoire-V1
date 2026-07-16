"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const loading = () => <div className="w-full h-[300px] animate-pulse bg-slate-100 rounded-lg border border-slate-200" />;

export const AIFeatureCosts = dynamic(() => import('./ai-feature-costs.client').then(m => m.AIFeatureCosts), { ssr: false, loading });
