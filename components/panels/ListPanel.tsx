'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const tasks = [
  { id: 1, title: 'Completar diseño UI', status: 'completed', icon: CheckCircle2, color: 'text-green-600' },
  { id: 2, title: 'Revisar código backend', status: 'in-progress', icon: Clock, color: 'text-yellow-600' },
  { id: 3, title: 'Actualizar documentación', status: 'in-progress', icon: Clock, color: 'text-yellow-600' },
  { id: 4, title: 'Resolver bug crítico', status: 'pending', icon: AlertCircle, color: 'text-red-600' },
  { id: 5, title: 'Implementar tests', status: 'pending', icon: AlertCircle, color: 'text-red-600' },
];

export default function ListPanel() {
  return (
    <div className="h-full">
      <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
        Tareas Recientes
      </h4>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <task.icon className={`w-5 h-5 ${task.color}`} />
            <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
