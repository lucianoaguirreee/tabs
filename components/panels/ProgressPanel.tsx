'use client';

import React from 'react';
import { Target } from 'lucide-react';

const projects = [
  { name: 'Desarrollo Frontend', progress: 85, color: 'bg-blue-600' },
  { name: 'API Backend', progress: 70, color: 'bg-green-600' },
  { name: 'Testing', progress: 45, color: 'bg-yellow-600' },
  { name: 'Documentación', progress: 60, color: 'bg-purple-600' },
];

export default function ProgressPanel() {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-blue-600" />
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Progreso de Proyectos
        </h4>
      </div>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {project.name}
              </span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
              <div
                className={`${project.color} h-full rounded-full transition-all duration-500`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
