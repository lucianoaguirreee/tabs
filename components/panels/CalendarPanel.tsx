'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export default function CalendarPanel() {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const dates = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Noviembre 2025
        </h4>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 py-2"
          >
            {day}
          </div>
        ))}
        {dates.map(date => (
          <div
            key={date}
            className={`
              text-center text-sm p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer transition-colors
              ${date === 4 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-zinc-700 dark:text-zinc-300'}
            `}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
}
