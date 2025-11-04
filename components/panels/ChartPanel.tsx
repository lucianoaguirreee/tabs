'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function ChartPanel() {
  const data = [65, 75, 70, 85, 90, 95, 100];
  const maxValue = Math.max(...data);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Tendencia de Datos
        </h4>
      </div>
      <div className="flex-1 flex items-end justify-between gap-2">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                 style={{ height: `${(value / maxValue) * 100}%` }}
            />
            <span className="text-xs text-zinc-500">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
