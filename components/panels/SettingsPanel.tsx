'use client';

import React, { useState } from 'react';
import { Settings, Moon, Bell, Globe, Lock } from 'lucide-react';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    language: 'es',
    privacy: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsOptions = [
    { key: 'darkMode' as const, label: 'Modo Oscuro', icon: Moon },
    { key: 'notifications' as const, label: 'Notificaciones', icon: Bell },
    { key: 'privacy' as const, label: 'Privacidad', icon: Lock },
  ];

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Configuración
        </h4>
      </div>
      <div className="space-y-3">
        {settingsOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <option.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {option.label}
              </span>
            </div>
            <button
              onClick={() => toggleSetting(option.key)}
              className={`
                relative w-11 h-6 rounded-full transition-colors duration-200
                ${settings[option.key] ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'}
              `}
            >
              <div
                className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
                  ${settings[option.key] ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
