import BottomTabsSystem from '@/components/BottomTabsSystem';
import DraggableGrid from '@/components/DraggableGrid';
import ChartPanel from '@/components/panels/ChartPanel';
import StatsPanel from '@/components/panels/StatsPanel';
import ListPanel from '@/components/panels/ListPanel';
import InfoPanel from '@/components/panels/InfoPanel';
import CalendarPanel from '@/components/panels/CalendarPanel';
import NotificationsPanel from '@/components/panels/NotificationsPanel';
import ProgressPanel from '@/components/panels/ProgressPanel';
import SettingsPanel from '@/components/panels/SettingsPanel';
import { Home, LayoutDashboard, BarChart3, Settings } from 'lucide-react';

export default function HomePage() {
  // Vista 1: Dashboard
  const dashboardPanels = [
    {
      id: 'stats',
      title: 'Estadísticas',
      content: <StatsPanel />,
      defaultPosition: { x: 0, y: 0, w: 6, h: 3 }
    },
    {
      id: 'chart',
      title: 'Gráfico de Tendencias',
      content: <ChartPanel />,
      defaultPosition: { x: 6, y: 0, w: 6, h: 3 }
    },
    {
      id: 'list',
      title: 'Lista de Tareas',
      content: <ListPanel />,
      defaultPosition: { x: 0, y: 3, w: 6, h: 3 }
    },
    {
      id: 'info',
      title: 'Información',
      content: <InfoPanel />,
      defaultPosition: { x: 6, y: 3, w: 6, h: 3 }
    }
  ];

  // Vista 2: Análisis
  const analyticsPanels = [
    {
      id: 'progress',
      title: 'Progreso de Proyectos',
      content: <ProgressPanel />,
      defaultPosition: { x: 0, y: 0, w: 8, h: 3 }
    },
    {
      id: 'calendar',
      title: 'Calendario',
      content: <CalendarPanel />,
      defaultPosition: { x: 8, y: 0, w: 4, h: 3 }
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      content: <NotificationsPanel />,
      defaultPosition: { x: 0, y: 3, w: 12, h: 3 }
    }
  ];

  // Vista 3: Reportes
  const reportsPanels = [
    {
      id: 'chart-main',
      title: 'Gráfico Principal',
      content: <ChartPanel />,
      defaultPosition: { x: 0, y: 0, w: 8, h: 4 }
    },
    {
      id: 'stats-mini',
      title: 'Resumen',
      content: <StatsPanel />,
      defaultPosition: { x: 8, y: 0, w: 4, h: 4 }
    },
    {
      id: 'progress-report',
      title: 'Estado del Progreso',
      content: <ProgressPanel />,
      defaultPosition: { x: 0, y: 4, w: 12, h: 3 }
    }
  ];

  // Vista 4: Configuración
  const settingsPanels = [
    {
      id: 'settings-main',
      title: 'Preferencias',
      content: <SettingsPanel />,
      defaultPosition: { x: 0, y: 0, w: 6, h: 4 }
    },
    {
      id: 'info-settings',
      title: 'Acerca del Sistema',
      content: <InfoPanel />,
      defaultPosition: { x: 6, y: 0, w: 6, h: 4 }
    },
    {
      id: 'notifications-settings',
      title: 'Gestión de Notificaciones',
      content: <NotificationsPanel />,
      defaultPosition: { x: 0, y: 4, w: 12, h: 3 }
    }
  ];

  const tabs = [
    {
      id: 'home',
      label: 'Inicio',
      icon: <Home className="w-6 h-6" />,
      content: <DraggableGrid panels={dashboardPanels} />
    },
    {
      id: 'analytics',
      label: 'Análisis',
      icon: <LayoutDashboard className="w-6 h-6" />,
      content: <DraggableGrid panels={analyticsPanels} />
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: <BarChart3 className="w-6 h-6" />,
      content: <DraggableGrid panels={reportsPanels} />
    },
    {
      id: 'settings',
      label: 'Ajustes',
      icon: <Settings className="w-6 h-6" />,
      content: <DraggableGrid panels={settingsPanels} />
    }
  ];

  return <BottomTabsSystem tabs={tabs} />;
}
