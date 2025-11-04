"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type TabId = 1 | 2 | 3 | 4;
type MergedGroup = TabId[];

type TabData = {
  id: string;
  name: string;
  mergedGroups: MergedGroup[];
  columnSplit: number;
  leftColumnRowSplit: number;
  rightColumnRowSplit: number;
  topRowColumnSplit: number;
  bottomRowColumnSplit: number;
  rowSplit: number; // Split vertical entre filas cuando hay merge horizontal
};

const createNewTabData = (id: string, name: string): TabData => ({
  id,
  name,
  mergedGroups: [[1], [2], [3], [4]],
  columnSplit: 50,
  leftColumnRowSplit: 50,
  rightColumnRowSplit: 50,
  topRowColumnSplit: 50,
  bottomRowColumnSplit: 50,
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
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingLeftHorizontal, setIsDraggingLeftHorizontal] = useState(false);
  const [isDraggingRightHorizontal, setIsDraggingRightHorizontal] = useState(false);
  const [isDraggingTopRowVertical, setIsDraggingTopRowVertical] = useState(false);
  const [isDraggingBottomRowVertical, setIsDraggingBottomRowVertical] = useState(false);
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

  const findGroupIndex = (tabId: TabId): number => {
    return activeTab.mergedGroups.findIndex((group) => group.includes(tabId));
  };

  const findGroupByTab = (tabId: TabId): MergedGroup | undefined => {
    return activeTab.mergedGroups.find((group) => group.includes(tabId));
  };

  const canMerge = (tab1: TabId, tab2: TabId): boolean => {
    const group1 = findGroupByTab(tab1);
    const group2 = findGroupByTab(tab2);

    if (!group1 || !group2) return false;
    if (group1 === group2) return false;

    if ((tab1 === 1 && tab2 === 2) || (tab1 === 2 && tab2 === 1)) {
      const has1And3 = group1.includes(1) && group1.includes(3);
      const has2And4 = group2.includes(2) && group2.includes(4);
      const has1And3_inv = group2.includes(1) && group2.includes(3);
      const has2And4_inv = group1.includes(2) && group1.includes(4);
      if (has1And3 || has2And4 || has1And3_inv || has2And4_inv) return false;
    }

    if ((tab1 === 3 && tab2 === 4) || (tab1 === 4 && tab2 === 3)) {
      const has1And3 = group1.includes(1) && group1.includes(3);
      const has2And4 = group2.includes(2) && group2.includes(4);
      const has1And3_inv = group2.includes(1) && group2.includes(3);
      const has2And4_inv = group1.includes(2) && group1.includes(4);
      if (has1And3 || has2And4 || has1And3_inv || has2And4_inv) return false;
    }

    if ((tab1 === 1 && tab2 === 3) || (tab1 === 3 && tab2 === 1)) {
      const has1And2 = group1.includes(1) && group1.includes(2);
      const has3And4 = group2.includes(3) && group2.includes(4);
      const has1And2_inv = group2.includes(1) && group2.includes(2);
      const has3And4_inv = group1.includes(3) && group1.includes(4);
      if (has1And2 || has3And4 || has1And2_inv || has3And4_inv) return false;
    }

    if ((tab1 === 2 && tab2 === 4) || (tab1 === 4 && tab2 === 2)) {
      const has1And2 = group1.includes(1) && group1.includes(2);
      const has3And4 = group2.includes(3) && group2.includes(4);
      const has1And2_inv = group2.includes(1) && group2.includes(2);
      const has3And4_inv = group1.includes(3) && group1.includes(4);
      if (has1And2 || has3And4 || has1And2_inv || has3And4_inv) return false;
    }

    return true;
  };

  const mergeTabs = (tab1: TabId, tab2: TabId) => {
    if (!canMerge(tab1, tab2)) return;

    const group1Index = findGroupIndex(tab1);
    const group2Index = findGroupIndex(tab2);

    const newGroups = activeTab.mergedGroups.filter(
      (_, index) => index !== group1Index && index !== group2Index
    );
    const mergedGroup = [
      ...activeTab.mergedGroups[group1Index],
      ...activeTab.mergedGroups[group2Index],
    ].sort((a, b) => a - b);

    newGroups.push(mergedGroup);
    updateActiveTab({ mergedGroups: newGroups });
  };

  const splitGroup = (groupIndex: number) => {
    const group = activeTab.mergedGroups[groupIndex];
    if (group.length <= 1) return;

    const newGroups = activeTab.mergedGroups.filter((_, index) => index !== groupIndex);
    group.forEach((tabId) => {
      newGroups.push([tabId]);
    });

    // Detectar el tipo de merge y preservar el ancho configurado
    const updates: Partial<Omit<TabData, 'id' | 'name'>> = { mergedGroups: newGroups };

    // Si se separa 1-2 (horizontal arriba), transferir bottomRowColumnSplit a topRowColumnSplit
    if (group.includes(1) && group.includes(2)) {
      updates.topRowColumnSplit = activeTab.bottomRowColumnSplit;
    }

    // Si se separa 3-4 (horizontal abajo), transferir topRowColumnSplit a bottomRowColumnSplit
    if (group.includes(3) && group.includes(4)) {
      updates.bottomRowColumnSplit = activeTab.topRowColumnSplit;
    }

    updateActiveTab(updates);
  };

  const getTabColor = (tabId: TabId): string => {
    const colors = {
      1: "bg-blue-500",
      2: "bg-green-500",
      3: "bg-purple-500",
      4: "bg-orange-500",
    };
    return colors[tabId];
  };

  const handleVerticalDrag = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, columnSplit: clampedPercentage } : tab
      )
    );
  }, [activeTabId]);

  const handleLeftHorizontalDrag = useCallback((e: MouseEvent) => {
    if (!leftColumnRef.current) return;
    const rect = leftColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, leftColumnRowSplit: clampedPercentage } : tab
      )
    );
  }, [activeTabId]);

  const handleRightHorizontalDrag = useCallback((e: MouseEvent) => {
    if (!rightColumnRef.current) return;
    const rect = rightColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, rightColumnRowSplit: clampedPercentage } : tab
      )
    );
  }, [activeTabId]);

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

  const handleBottomRowVerticalDrag = useCallback((e: MouseEvent) => {
    if (!bottomRowRef.current) return;
    const rect = bottomRowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, bottomRowColumnSplit: clampedPercentage } : tab
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
    if (isDraggingVertical) handleVerticalDrag(e);
    if (isDraggingLeftHorizontal) handleLeftHorizontalDrag(e);
    if (isDraggingRightHorizontal) handleRightHorizontalDrag(e);
    if (isDraggingTopRowVertical) handleTopRowVerticalDrag(e);
    if (isDraggingBottomRowVertical) handleBottomRowVerticalDrag(e);
    if (isDraggingRowSplit) handleRowSplitDrag(e);
  }, [isDraggingVertical, isDraggingLeftHorizontal, isDraggingRightHorizontal, isDraggingTopRowVertical, isDraggingBottomRowVertical, isDraggingRowSplit, handleVerticalDrag, handleLeftHorizontalDrag, handleRightHorizontalDrag, handleTopRowVerticalDrag, handleBottomRowVerticalDrag, handleRowSplitDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingVertical(false);
    setIsDraggingLeftHorizontal(false);
    setIsDraggingRightHorizontal(false);
    setIsDraggingTopRowVertical(false);
    setIsDraggingBottomRowVertical(false);
    setIsDraggingRowSplit(false);
  }, []);

  useEffect(() => {
    if (isDraggingVertical || isDraggingLeftHorizontal || isDraggingRightHorizontal || isDraggingTopRowVertical || isDraggingBottomRowVertical || isDraggingRowSplit) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingVertical, isDraggingLeftHorizontal, isDraggingRightHorizontal, isDraggingTopRowVertical, isDraggingBottomRowVertical, isDraggingRowSplit, handleMouseMove, handleMouseUp]);

  const getExpansionOptions = (tabId: TabId) => {
    const options: { direction: string; targetTab: TabId; icon: string; label: string }[] = [];

    if (tabId === 1) {
      if (canMerge(1, 2)) options.push({ direction: "right", targetTab: 2, icon: "→", label: "Derecha" });
      if (canMerge(1, 3)) options.push({ direction: "down", targetTab: 3, icon: "↓", label: "Abajo" });
    } else if (tabId === 2) {
      if (canMerge(2, 1)) options.push({ direction: "left", targetTab: 1, icon: "←", label: "Izquierda" });
      if (canMerge(2, 4)) options.push({ direction: "down", targetTab: 4, icon: "↓", label: "Abajo" });
    } else if (tabId === 3) {
      if (canMerge(3, 1)) options.push({ direction: "up", targetTab: 1, icon: "↑", label: "Arriba" });
      if (canMerge(3, 4)) options.push({ direction: "right", targetTab: 4, icon: "→", label: "Derecha" });
    } else if (tabId === 4) {
      if (canMerge(4, 2)) options.push({ direction: "up", targetTab: 2, icon: "↑", label: "Arriba" });
      if (canMerge(4, 3)) options.push({ direction: "left", targetTab: 3, icon: "←", label: "Izquierda" });
    }

    return options;
  };

  const renderTab = (group: MergedGroup | null, groupIndex: number) => {
    if (!group) return null;

    const isGrouped = group.length > 1;

    return (
      <div
        className={`group relative flex flex-col items-center justify-center rounded-lg h-full w-full ${
          group.length === 1 ? getTabColor(group[0]) : "bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500"
        } transition-all`}
      >
        <div className="text-4xl font-bold text-white">
          {group.length === 1 ? `${group[0]}` : group.join(" + ")}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isGrouped ? (
            <button
              onClick={() => splitGroup(groupIndex)}
              className="flex items-center gap-2 rounded-lg bg-white/90 hover:bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-lg backdrop-blur transition-all hover:scale-105"
              title="Separar"
            >
              <span className="text-lg">⊟</span>
              <span>Separar</span>
            </button>
          ) : (
            <>
              {getExpansionOptions(group[0]).map((option) => (
                <button
                  key={option.direction}
                  onClick={() => mergeTabs(group[0], option.targetTab)}
                  className="flex items-center gap-2 rounded-lg bg-white/90 hover:bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-lg backdrop-blur transition-all hover:scale-105"
                  title={`Expandir hacia ${option.label}`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  const group1 = findGroupByTab(1);
  const group2 = findGroupByTab(2);
  const group3 = findGroupByTab(3);
  const group4 = findGroupByTab(4);

  const has12 = group1 && group1.includes(1) && group1.includes(2);
  const has13 = group1 && group1.includes(1) && group1.includes(3);
  const has24 = group2 && group2.includes(2) && group2.includes(4);
  const has34 = group3 && group3.includes(3) && group3.includes(4);

  const groupIndex1 = group1 ? findGroupIndex(group1[0]) : -1;
  const groupIndex2 = group2 ? findGroupIndex(group2[0]) : -1;
  const groupIndex3 = group3 ? findGroupIndex(group3[0]) : -1;
  const groupIndex4 = group4 ? findGroupIndex(group4[0]) : -1;

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-900">
      {/* Grid principal */}
      <div className="flex-1 p-4 pb-0">
        <div ref={containerRef} className="relative h-full flex gap-2">
          {has12 ? (
            <div className="flex flex-col w-full gap-2">
              {/* Fila superior: 1-2 merged */}
              <div style={{ height: `${activeTab.rowSplit}%` }}>
                {renderTab(group1, groupIndex1)}
              </div>
              {/* Handle horizontal para ajustar altura entre filas */}
              <div
                className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-orange-500 cursor-row-resize z-20 -translate-y-1/2"
                style={{ top: `${activeTab.rowSplit}%` }}
                onMouseDown={() => setIsDraggingRowSplit(true)}
              />
              {/* Fila inferior: 3 y 4 separadas */}
              <div ref={bottomRowRef} className="relative flex gap-2" style={{ height: `${100 - activeTab.rowSplit}%` }}>
                <div style={{ width: `${activeTab.bottomRowColumnSplit}%` }}>
                  {renderTab(group3, groupIndex3)}
                </div>
                <div
                  className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
                  style={{ left: `${activeTab.bottomRowColumnSplit}%` }}
                  onMouseDown={() => setIsDraggingBottomRowVertical(true)}
                />
                <div style={{ width: `${100 - activeTab.bottomRowColumnSplit}%` }}>
                  {renderTab(group4, groupIndex4)}
                </div>
              </div>
            </div>
          ) : has34 ? (
            <div className="flex flex-col w-full gap-2">
              {/* Fila superior: 1 y 2 separadas */}
              <div ref={topRowRef} className="relative flex gap-2" style={{ height: `${activeTab.rowSplit}%` }}>
                <div style={{ width: `${activeTab.topRowColumnSplit}%` }}>
                  {renderTab(group1, groupIndex1)}
                </div>
                <div
                  className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
                  style={{ left: `${activeTab.topRowColumnSplit}%` }}
                  onMouseDown={() => setIsDraggingTopRowVertical(true)}
                />
                <div style={{ width: `${100 - activeTab.topRowColumnSplit}%` }}>
                  {renderTab(group2, groupIndex2)}
                </div>
              </div>
              {/* Handle horizontal para ajustar altura entre filas */}
              <div
                className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-orange-500 cursor-row-resize z-20 -translate-y-1/2"
                style={{ top: `${activeTab.rowSplit}%` }}
                onMouseDown={() => setIsDraggingRowSplit(true)}
              />
              {/* Fila inferior: 3-4 merged */}
              <div style={{ height: `${100 - activeTab.rowSplit}%` }}>
                {renderTab(group3, groupIndex3)}
              </div>
            </div>
          ) : (
            <>
              <div
                ref={leftColumnRef}
                className="relative flex flex-col gap-2"
                style={{ width: `${activeTab.columnSplit}%` }}
              >
                {has13 ? (
                  <div className="h-full">
                    {renderTab(group1, groupIndex1)}
                  </div>
                ) : (
                  <>
                    <div style={{ height: `${activeTab.leftColumnRowSplit}%` }}>
                      {renderTab(group1, groupIndex1)}
                    </div>
                    <div
                      className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-green-500 cursor-row-resize z-10 -translate-y-1/2"
                      style={{ top: `${activeTab.leftColumnRowSplit}%` }}
                      onMouseDown={() => setIsDraggingLeftHorizontal(true)}
                    />
                    <div style={{ height: `${100 - activeTab.leftColumnRowSplit}%` }}>
                      {renderTab(group3, groupIndex3)}
                    </div>
                  </>
                )}
              </div>

              <div
                className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
                style={{ left: `${activeTab.columnSplit}%` }}
                onMouseDown={() => setIsDraggingVertical(true)}
              />

              <div
                ref={rightColumnRef}
                className="relative flex flex-col gap-2"
                style={{ width: `${100 - activeTab.columnSplit}%` }}
              >
                {has24 ? (
                  <div className="h-full">
                    {renderTab(group2, groupIndex2)}
                  </div>
                ) : (
                  <>
                    <div style={{ height: `${activeTab.rightColumnRowSplit}%` }}>
                      {renderTab(group2, groupIndex2)}
                    </div>
                    <div
                      className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-purple-500 cursor-row-resize z-10 -translate-y-1/2"
                      style={{ top: `${activeTab.rightColumnRowSplit}%` }}
                      onMouseDown={() => setIsDraggingRightHorizontal(true)}
                    />
                    <div style={{ height: `${100 - activeTab.rightColumnRowSplit}%` }}>
                      {renderTab(group4, groupIndex4)}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
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
