"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Users, DollarSign, FolderKanban, Activity, MapPin, Settings, FileText, UsersRound, X } from "lucide-react";

type InternalTab = {
  id: string;
  name: string;
  content: React.ReactNode;
};

type TabData = {
  id: string;
  name: string;
  topRowColumnSplit: number; // Ancho entre 1 y 2
  rowSplit: number; // Altura entre fila superior (1,2) y fila inferior (3+4)
  panel2Tabs: InternalTab[];
  panel3Tabs: InternalTab[];
  activePanel2Tab: string | null;
  activePanel3Tab: string | null;
};

const panel1Content = (
  <div className="p-6 h-full overflow-auto space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard Principal</h1>
      <p className="text-zinc-400">Vista general de tu sistema</p>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Total Usuarios</CardTitle>
          <Users className="h-4 w-4 text-blue-300" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">1,234</div>
          <div className="flex items-center gap-1 text-xs text-blue-200 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>12% desde el mes pasado</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-100">Ingresos</CardTitle>
          <DollarSign className="h-4 w-4 text-green-300" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">$45.2K</div>
          <div className="flex items-center gap-1 text-xs text-green-200 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>8% desde el mes pasado</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">Proyectos</CardTitle>
          <FolderKanban className="h-4 w-4 text-purple-300" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">32</div>
          <div className="flex items-center gap-1 text-xs text-purple-200 mt-1">
            <TrendingDown className="h-3 w-3" />
            <span>2% desde el mes pasado</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Actividad Reciente
        </CardTitle>
        <CardDescription>Últimas actualizaciones del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { text: 'Nuevo usuario registrado', time: '1h', status: 'success' },
          { text: 'Proyecto "Alpha" completado', time: '2h', status: 'success' },
          { text: 'Actualización del sistema', time: '3h', status: 'warning' },
          { text: 'Backup realizado', time: '4h', status: 'success' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-700/30 transition-colors">
            <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="flex-1 text-sm text-zinc-200">{item.text}</span>
            <Badge variant="outline" className="text-xs">Hace {item.time}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

const createNewTabData = (id: string, name: string): TabData => ({
  id,
  name,
  topRowColumnSplit: 50,
  rowSplit: 50,
  panel2Tabs: [
    {
      id: "p2-map",
      name: "🗺️ Mapa",
      content: (
        <div className="h-full flex flex-col p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                Vista del Mapa
              </h1>
              <p className="text-sm text-zinc-400 mt-1">Ubicaciones en tiempo real</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Satélite</Button>
              <Button size="sm" variant="outline">Terreno</Button>
              <Button size="sm" variant="outline">Tráfico</Button>
            </div>
          </div>

          <Card className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-blue-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mb-4 mx-auto text-green-200" />
                  <div className="text-2xl font-bold mb-2 text-white">Mapa Interactivo</div>
                  <Badge variant="secondary" className="mt-2">3 ubicaciones activas</Badge>
                </div>
              </div>
              {/* Marcadores simulados */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse border-2 border-white"></div>
              <div className="absolute top-2/3 left-2/3 w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse border-2 border-white"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse border-2 border-white"></div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: "p2-settings",
      name: "⚙️ Configuración",
      content: (
        <div className="p-6 h-full overflow-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Settings className="h-7 w-7" />
              Configuración del Sistema
            </h1>
            <p className="text-zinc-400 mt-1">Administra tus preferencias</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Perfil de Usuario</CardTitle>
              <CardDescription>Información personal de la cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Nombre</label>
                <input
                  type="text"
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 text-white"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Email</label>
                <input
                  type="email"
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 text-white"
                  placeholder="juan@ejemplo.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
              <CardDescription>Personaliza tu experiencia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Notificaciones por email', checked: true },
                { label: 'Modo oscuro', checked: true },
                { label: 'Actualización automática', checked: false },
                { label: 'Compartir datos analíticos', checked: false }
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
                  <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4" />
                  <span className="text-sm text-zinc-200">{item.label}</span>
                  {item.checked && <Badge variant="success" className="ml-auto">Activo</Badge>}
                </label>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button>Guardar Cambios</Button>
            <Button variant="outline">Cancelar</Button>
          </div>
        </div>
      )
    }
  ],
  panel3Tabs: [
    {
      id: "p3-files",
      name: "📁 Archivos",
      content: (
        <div className="p-6 h-full overflow-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <FileText className="h-7 w-7" />
                Explorador de Archivos
              </h1>
              <p className="text-zinc-400 mt-1">Gestiona tus documentos</p>
            </div>
            <Button>+ Nuevo Archivo</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-700 bg-zinc-800/50">
                      <th className="text-left p-4 font-semibold text-sm text-zinc-300">Nombre</th>
                      <th className="text-left p-4 font-semibold text-sm text-zinc-300">Tipo</th>
                      <th className="text-left p-4 font-semibold text-sm text-zinc-300">Tamaño</th>
                      <th className="text-left p-4 font-semibold text-sm text-zinc-300">Modificado</th>
                      <th className="text-left p-4 font-semibold text-sm text-zinc-300">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700/50">
                    {[
                      { name: 'Proyecto_Final.pdf', type: 'PDF', size: '2.4 MB', date: '12 Nov 2024', status: 'Listo', icon: '📄' },
                      { name: 'Presentación.pptx', type: 'PowerPoint', size: '5.8 MB', date: '11 Nov 2024', status: 'Listo', icon: '📊' },
                      { name: 'Datos_2024.xlsx', type: 'Excel', size: '892 KB', date: '10 Nov 2024', status: 'Procesando', icon: '📈' },
                      { name: 'Imagen_Banner.png', type: 'Imagen', size: '1.2 MB', date: '09 Nov 2024', status: 'Listo', icon: '🖼️' },
                      { name: 'Video_Tutorial.mp4', type: 'Video', size: '45.6 MB', date: '08 Nov 2024', status: 'Listo', icon: '🎥' },
                      { name: 'Backup_Sistema.zip', type: 'Archivo', size: '128 MB', date: '07 Nov 2024', status: 'Listo', icon: '📦' },
                    ].map((file, i) => (
                      <tr key={i} className="hover:bg-zinc-800/30 cursor-pointer transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{file.icon}</span>
                            <span className="font-medium text-zinc-200">{file.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-zinc-400">{file.type}</td>
                        <td className="p-4 text-sm text-zinc-400">{file.size}</td>
                        <td className="p-4 text-sm text-zinc-400">{file.date}</td>
                        <td className="p-4">
                          <Badge variant={file.status === 'Listo' ? 'success' : 'warning'}>
                            {file.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "p3-team",
      name: "👥 Equipo",
      content: (
        <div className="p-6 h-full overflow-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <UsersRound className="h-7 w-7" />
              Gestión de Equipo
            </h1>
            <p className="text-zinc-400 mt-1">Colaboradores y sus roles</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'María González', role: 'CEO', avatar: '👩‍💼', status: 'online' },
              { name: 'Carlos Ruiz', role: 'CTO', avatar: '👨‍💻', status: 'online' },
              { name: 'Ana Martínez', role: 'Diseñadora', avatar: '👩‍🎨', status: 'away' },
              { name: 'Pedro López', role: 'Desarrollador', avatar: '👨‍💻', status: 'online' },
              { name: 'Laura Sánchez', role: 'Marketing', avatar: '👩‍💼', status: 'offline' },
              { name: 'Diego Torres', role: 'Ventas', avatar: '👨‍💼', status: 'online' },
            ].map((member, i) => (
              <Card key={i} className="hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="text-5xl mb-2">{member.avatar}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-zinc-400">{member.role}</p>
                    </div>
                    <Badge
                      variant={
                        member.status === 'online' ? 'success' :
                        member.status === 'away' ? 'warning' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {member.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }
  ],
  activePanel2Tab: "p2-map",
  activePanel3Tab: "p3-files",
});

export default function Home() {
  const [tabs, setTabs] = useState<TabData[]>([
    createNewTabData("tab-1", "Tab 1"),
    createNewTabData("tab-2", "Tab 2"),
    createNewTabData("tab-3", "Tab 3"),
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);

  const [isDraggingTopRowVertical, setIsDraggingTopRowVertical] = useState(false);
  const [isDraggingRowSplit, setIsDraggingRowSplit] = useState(false);

  const [draggedTab, setDraggedTab] = useState<{ tab: InternalTab; fromPanel: number } | null>(null);

  const updateActiveTab = (updates: Partial<Omit<TabData, 'id' | 'name'>>) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, ...updates } : tab
      )
    );
  };

  const handleDragStart = (tab: InternalTab, panelId: number) => {
    setDraggedTab({ tab, fromPanel: panelId });
  };

  const handleDrop = (toPanelId: number) => {
    if (!draggedTab) return;

    // Panel 1 no acepta tabs
    if (toPanelId === 1) {
      setDraggedTab(null);
      return;
    }

    const { tab, fromPanel } = draggedTab;
    if (fromPanel === toPanelId) {
      setDraggedTab(null);
      return;
    }

    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== activeTabId) return t;

        const fromKey = `panel${fromPanel}Tabs` as keyof Pick<TabData, 'panel2Tabs' | 'panel3Tabs'>;
        const toKey = `panel${toPanelId}Tabs` as keyof Pick<TabData, 'panel2Tabs' | 'panel3Tabs'>;
        const activeFromKey = `activePanel${fromPanel}Tab` as keyof Pick<TabData, 'activePanel2Tab' | 'activePanel3Tab'>;
        const activeToKey = `activePanel${toPanelId}Tab` as keyof Pick<TabData, 'activePanel2Tab' | 'activePanel3Tab'>;

        const newFromTabs = (t[fromKey] as InternalTab[]).filter((it) => it.id !== tab.id);
        const newToTabs = [...(t[toKey] as InternalTab[]), tab];

        return {
          ...t,
          [fromKey]: newFromTabs,
          [toKey]: newToTabs,
          [activeFromKey]: newFromTabs.length > 0 ? (newFromTabs[0].id) : null,
          [activeToKey]: tab.id,
        };
      })
    );

    setDraggedTab(null);
  };

  const closeInternalTab = (panelId: number, tabId: string) => {
    if (panelId === 1) return; // Panel 1 no tiene tabs

    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== activeTabId) return t;

        const tabsKey = `panel${panelId}Tabs` as keyof Pick<TabData, 'panel2Tabs' | 'panel3Tabs'>;
        const activeKey = `activePanel${panelId}Tab` as keyof Pick<TabData, 'activePanel2Tab' | 'activePanel3Tab'>;
        const tabs = t[tabsKey] as InternalTab[];

        if (tabs.length <= 1) return t;

        const newTabs = tabs.filter((it) => it.id !== tabId);
        const currentActive = t[activeKey];

        return {
          ...t,
          [tabsKey]: newTabs,
          [activeKey]: currentActive === tabId ? newTabs[0].id : currentActive,
        };
      })
    );
  };

  const setActiveInternalTab = (panelId: number, tabId: string) => {
    if (panelId === 1) return; // Panel 1 no tiene tabs

    const activeKey = `activePanel${panelId}Tab` as keyof Pick<TabData, 'activePanel2Tab' | 'activePanel3Tab'>;
    updateActiveTab({ [activeKey]: tabId } as any);
  };

  const createNewTab = () => {
    const newTabNumber = tabs.length + 1;
    const newTab = createNewTabData(`tab-${Date.now()}`, `Tab ${newTabNumber}`);
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;

    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const currentIndex = tabs.findIndex((t) => t.id === tabId);
      const newActiveTab = newTabs[Math.max(0, currentIndex - 1)];
      setActiveTabId(newActiveTab.id);
    }
  };

  const getTabColor = (tabId: number): string => {
    const colors = {
      1: "bg-blue-500",
      2: "bg-green-500",
      3: "bg-gradient-to-br from-purple-500 to-orange-500",
    };
    return colors[tabId as 1 | 2 | 3];
  };

  const handleTopRowVerticalDrag = useCallback((e: MouseEvent) => {
    if (!topRowRef.current) return;
    const rect = topRowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, topRowColumnSplit: clampedPercentage } : tab
      )
    );
  }, [activeTabId]);

  const handleRowSplitDrag = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, rowSplit: clampedPercentage } : tab
      )
    );
  }, [activeTabId]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingTopRowVertical) handleTopRowVerticalDrag(e);
    if (isDraggingRowSplit) handleRowSplitDrag(e);
  }, [isDraggingTopRowVertical, isDraggingRowSplit, handleTopRowVerticalDrag, handleRowSplitDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingTopRowVertical(false);
    setIsDraggingRowSplit(false);
  }, []);

  useEffect(() => {
    if (isDraggingTopRowVertical || isDraggingRowSplit) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingTopRowVertical, isDraggingRowSplit, handleMouseMove, handleMouseUp]);

  const renderTab = (panelId: number, label: string) => {
    // Panel 1 no tiene tabs, solo contenido fijo
    if (panelId === 1) {
      return (
        <div
          className={`relative flex flex-col rounded-lg h-full w-full ${getTabColor(panelId)} transition-all overflow-hidden`}
        >
          <div className="flex-1 overflow-auto bg-zinc-900 bg-opacity-40 text-white">
            {panel1Content}
          </div>
        </div>
      );
    }

    // Paneles 2 y 3 tienen tabs
    const tabsKey = `panel${panelId}Tabs` as keyof Pick<TabData, 'panel2Tabs' | 'panel3Tabs'>;
    const activeKey = `activePanel${panelId}Tab` as keyof Pick<TabData, 'activePanel2Tab' | 'activePanel3Tab'>;
    const internalTabs = activeTab[tabsKey] as InternalTab[];
    const activeInternalTabId = activeTab[activeKey] as string | null;

    return (
      <div
        className={`relative flex flex-col rounded-lg h-full w-full ${getTabColor(panelId)} transition-all overflow-hidden`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(panelId)}
      >
        <Tabs value={activeInternalTabId || undefined} onValueChange={(value) => setActiveInternalTab(panelId, value)} className="h-full flex flex-col">
          <TabsList className="w-full justify-start rounded-none bg-zinc-800/80 backdrop-blur border-b border-zinc-700/50 h-auto p-1">
            {internalTabs.map((tab) => (
              <div
                key={tab.id}
                draggable
                onDragStart={() => handleDragStart(tab, panelId)}
                className="group relative flex items-center"
              >
                <TabsTrigger
                  value={tab.id}
                  className="relative data-[state=active]:bg-zinc-700/50 data-[state=active]:text-white data-[state=active]:shadow-md px-4 py-2 cursor-move"
                >
                  <span className="text-sm">{tab.name}</span>
                  {internalTabs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeInternalTab(panelId, tab.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 h-5 w-5 ml-2 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </TabsTrigger>
              </div>
            ))}
          </TabsList>

          {internalTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="flex-1 overflow-auto bg-zinc-900 bg-opacity-40 text-white mt-0 p-0">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-900 overflow-hidden">
      {/* Grid principal */}
      <div className="flex-1 p-4 overflow-hidden">
        <div ref={containerRef} className="relative h-full w-full flex flex-col gap-2">
          {/* Fila superior: 1 y 2 separadas */}
          <div ref={topRowRef} className="relative flex gap-2 overflow-hidden" style={{ height: `${activeTab.rowSplit}%` }}>
            <div className="overflow-hidden" style={{ width: `${activeTab.topRowColumnSplit}%` }}>
              {renderTab(1, "1")}
            </div>
            <div
              className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
              style={{ left: `${activeTab.topRowColumnSplit}%` }}
              onMouseDown={() => setIsDraggingTopRowVertical(true)}
            />
            <div className="overflow-hidden" style={{ width: `${100 - activeTab.topRowColumnSplit}%` }}>
              {renderTab(2, "2")}
            </div>
          </div>

          {/* Handle horizontal para ajustar altura entre filas */}
          <div
            className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-orange-500 cursor-row-resize z-20 -translate-y-1/2"
            style={{ top: `${activeTab.rowSplit}%` }}
            onMouseDown={() => setIsDraggingRowSplit(true)}
          />

          {/* Fila inferior: 3+4 juntas */}
          <div className="overflow-hidden" style={{ height: `${100 - activeTab.rowSplit}%` }}>
            {renderTab(3, "3 + 4")}
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <Tabs value={activeTabId} onValueChange={setActiveTabId} className="flex-shrink-0">
        <TabsList className="w-full justify-start rounded-none bg-zinc-800/95 backdrop-blur h-auto p-0 border-t border-zinc-700/50">
          {tabs.map((tab) => (
            <div key={tab.id} className="group relative flex items-center">
              <TabsTrigger
                value={tab.id}
                className="relative data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-none rounded-none border-t-2 border-transparent data-[state=active]:border-t-zinc-400 px-4 py-2.5"
              >
                <span className="text-sm font-medium">{tab.name}</span>
                {tabs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 h-5 w-5 ml-2 hover:bg-zinc-600/50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </TabsTrigger>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={createNewTab}
            className="ml-2 h-9 px-2 hover:bg-zinc-700/50"
            title="Nuevo tab"
          >
            <span className="text-lg">+</span>
          </Button>
        </TabsList>
      </Tabs>
    </div>
  );
}
