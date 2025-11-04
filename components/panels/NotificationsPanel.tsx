'use client';

import React from 'react';
import { Bell, MessageSquare, Heart, UserPlus } from 'lucide-react';

const notifications = [
  {
    id: 1,
    icon: MessageSquare,
    message: 'Nuevo comentario en tu publicación',
    time: 'Hace 5 min',
    color: 'bg-blue-100 dark:bg-blue-950 text-blue-600'
  },
  {
    id: 2,
    icon: Heart,
    message: 'A 12 personas les gustó tu contenido',
    time: 'Hace 1 hora',
    color: 'bg-red-100 dark:bg-red-950 text-red-600'
  },
  {
    id: 3,
    icon: UserPlus,
    message: 'Tienes 3 nuevos seguidores',
    time: 'Hace 3 horas',
    color: 'bg-green-100 dark:bg-green-950 text-green-600'
  },
  {
    id: 4,
    icon: Bell,
    message: 'Recordatorio: Reunión a las 3 PM',
    time: 'Hace 5 horas',
    color: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-600'
  },
];

export default function NotificationsPanel() {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Notificaciones
        </h4>
        <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
          Marcar todas como leídas
        </span>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-full ${notification.color}`}>
              <notification.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-900 dark:text-zinc-100">
                {notification.message}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {notification.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
