"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const loading = () => <div className="w-full h-[300px] animate-pulse bg-slate-100 rounded-lg border border-slate-200" />;

export const PressureGraph = dynamic(() => import('./pressure-graph.client').then(m => m.PressureGraph), { ssr: false, loading });
