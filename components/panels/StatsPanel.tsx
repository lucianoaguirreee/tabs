'use client';

import React from 'react';
import { Activity, Users, ShoppingCart, DollarSign } from 'lucide-react';

const stats = [
  { label: 'Usuarios', value: '2,543', icon: Users, color: 'text-blue-600' },
  { label: 'Ventas', value: '1,234', icon: ShoppingCart, color: 'text-green-600' },
  { label: 'Ingresos', value: '$45.2k', icon: DollarSign, color: 'text-yellow-600' },
  { label: 'Actividad', value: '98%', icon: Activity, color: 'text-purple-600' },
];

export default function StatsPanel() {
  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-4 h-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {stat.value}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
