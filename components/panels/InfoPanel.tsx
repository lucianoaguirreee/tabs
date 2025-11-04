'use client';

import React from 'react';
import { Info, Code, Zap } from 'lucide-react';

export default function InfoPanel() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-5 h-5 text-blue-600" />
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Información del Sistema
        </h4>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Code className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Sistema de Tabs Reorganizable
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Arrastra los paneles para reorganizarlos a tu gusto
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
          <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Rendimiento Optimizado
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Construido con Next.js 16 y React 19
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
