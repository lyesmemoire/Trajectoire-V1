"use client";

import dynamic from 'next/dynamic';
import React from 'react';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/design-system";

const loading = () => (
  <Card className="bg-white border border-gray-200/60 shadow-sm">
    <CardHeader>
      <CardTitle className="text-gray-900">Progression</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64 w-full animate-pulse bg-slate-100 rounded" />
    </CardContent>
  </Card>
);

export const ProgressChart = dynamic(() => import('./progress-chart.client').then(m => m.ProgressChart), { ssr: false, loading });
