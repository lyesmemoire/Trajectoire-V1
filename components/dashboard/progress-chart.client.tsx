"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProgressChartProps {
  data?: Array<{
    name: string;
    score: number;
  }>;
}

const defaultData = [
  { name: "Sem 1", score: 45 },
  { name: "Sem 2", score: 52 },
  { name: "Sem 3", score: 58 },
  { name: "Sem 4", score: 65 },
  { name: "Sem 5", score: 72 },
  { name: "Sem 6", score: 78 },
];

export function ProgressChart({ data = defaultData }: ProgressChartProps) {
  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#111827" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#111827"
                strokeWidth={2}
                dot={{ fill: "#111827", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#111827", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </m.div>
      </CardContent>
    </Card>
  );
}
