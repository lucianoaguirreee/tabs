"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type TabData = {
  id: string;
  name: string;
  topRowColumnSplit: number; // Ancho entre 1 y 2
  rowSplit: number; // Altura entre fila superior (1,2) y fila inferior (3+4)
};

const createNewTabData = (id: string, name: string): TabData => ({
  id,
  name,
  topRowColumnSplit: 50,
  rowSplit: 50,
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

  const updateActiveTab = (updates: Partial<Omit<TabData, 'id' | 'name'>>) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, ...updates } : tab
      )
    );
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

  const renderTab = (tabId: number, label: string) => {
    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg h-full w-full ${getTabColor(tabId)} transition-all`}
      >
        <div className="text-4xl font-bold text-white">
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-900">
      {/* Grid principal */}
      <div className="flex-1 p-4 pb-0">
        <div ref={containerRef} className="relative h-full flex flex-col gap-2">
          {/* Fila superior: 1 y 2 separadas */}
          <div ref={topRowRef} className="relative flex gap-2" style={{ height: `${activeTab.rowSplit}%` }}>
            <div style={{ width: `${activeTab.topRowColumnSplit}%` }}>
              {renderTab(1, "1")}
            </div>
            <div
              className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
              style={{ left: `${activeTab.topRowColumnSplit}%` }}
              onMouseDown={() => setIsDraggingTopRowVertical(true)}
            />
            <div style={{ width: `${100 - activeTab.topRowColumnSplit}%` }}>
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
          <div style={{ height: `${100 - activeTab.rowSplit}%` }}>
            {renderTab(3, "3 + 4")}
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="flex items-center gap-1 bg-zinc-800 px-2 py-1 border-t border-zinc-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
              activeTab.id === tab.id
                ? "bg-zinc-900 text-white"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            }`}
          >
            <span className="text-sm font-medium">{tab.name}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-zinc-600 rounded p-0.5 transition-opacity"
                title="Cerrar tab"
              >
                <span className="text-xs">✕</span>
              </button>
            )}
          </button>
        ))}

        <button
          onClick={createNewTab}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-all ml-1"
          title="Nuevo tab"
        >
          <span className="text-lg">+</span>
        </button>
      </div>
    </div>
  );
}
