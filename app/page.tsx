"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type TabId = 1 | 2 | 3 | 4;
type MergedGroup = TabId[];

export default function Home() {
  const [mergedGroups, setMergedGroups] = useState<MergedGroup[]>([
    [1],
    [2],
    [3],
    [4],
  ]);

  const [columnSplit, setColumnSplit] = useState(50);
  const [leftColumnRowSplit, setLeftColumnRowSplit] = useState(50);
  const [rightColumnRowSplit, setRightColumnRowSplit] = useState(50);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingLeftHorizontal, setIsDraggingLeftHorizontal] = useState(false);
  const [isDraggingRightHorizontal, setIsDraggingRightHorizontal] = useState(false);

  const findGroupIndex = (tabId: TabId): number => {
    return mergedGroups.findIndex((group) => group.includes(tabId));
  };

  const findGroupByTab = (tabId: TabId): MergedGroup | undefined => {
    return mergedGroups.find((group) => group.includes(tabId));
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

    const newGroups = mergedGroups.filter(
      (_, index) => index !== group1Index && index !== group2Index
    );
    const mergedGroup = [
      ...mergedGroups[group1Index],
      ...mergedGroups[group2Index],
    ].sort((a, b) => a - b);

    newGroups.push(mergedGroup);
    setMergedGroups(newGroups);
  };

  const splitGroup = (groupIndex: number) => {
    const group = mergedGroups[groupIndex];
    if (group.length <= 1) return;

    const newGroups = mergedGroups.filter((_, index) => index !== groupIndex);
    group.forEach((tabId) => {
      newGroups.push([tabId]);
    });
    setMergedGroups(newGroups);
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
    setColumnSplit(clampedPercentage);
  }, []);

  const handleLeftHorizontalDrag = useCallback((e: MouseEvent) => {
    if (!leftColumnRef.current) return;
    const rect = leftColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setLeftColumnRowSplit(clampedPercentage);
  }, []);

  const handleRightHorizontalDrag = useCallback((e: MouseEvent) => {
    if (!rightColumnRef.current) return;
    const rect = rightColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setRightColumnRowSplit(clampedPercentage);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingVertical) handleVerticalDrag(e);
    if (isDraggingLeftHorizontal) handleLeftHorizontalDrag(e);
    if (isDraggingRightHorizontal) handleRightHorizontalDrag(e);
  }, [isDraggingVertical, isDraggingLeftHorizontal, isDraggingRightHorizontal, handleVerticalDrag, handleLeftHorizontalDrag, handleRightHorizontalDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingVertical(false);
    setIsDraggingLeftHorizontal(false);
    setIsDraggingRightHorizontal(false);
  }, []);

  useEffect(() => {
    if (isDraggingVertical || isDraggingLeftHorizontal || isDraggingRightHorizontal) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingVertical, isDraggingLeftHorizontal, isDraggingRightHorizontal, handleMouseMove, handleMouseUp]);

  // Obtener direcciones de expansión disponibles para cada pestaña
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

        {/* Botones de expansión/separación */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isGrouped ? (
            /* Botón de separar */
            <button
              onClick={() => splitGroup(groupIndex)}
              className="flex items-center gap-2 rounded-lg bg-white/90 hover:bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-lg backdrop-blur transition-all hover:scale-105"
              title="Separar"
            >
              <span className="text-lg">⊟</span>
              <span>Separar</span>
            </button>
          ) : (
            /* Botones de expandir */
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

  // Detectar grupos
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
    <div className="flex h-screen w-full flex-col bg-zinc-900 p-4">
      {/* Grid principal */}
      <div ref={containerRef} className="relative flex-1 flex gap-2">
        {/* CASO 1: Merge horizontal 1-2 arriba */}
        {has12 ? (
          <div className="flex flex-col w-full gap-2">
            <div className="h-1/2">
              {renderTab(group1, groupIndex1)}
            </div>
            <div className="h-1/2 flex gap-2">
              <div style={{ width: `${columnSplit}%` }}>
                {renderTab(group3, groupIndex3)}
              </div>
              <div
                className="absolute top-1/2 h-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
                style={{ left: `${columnSplit}%`, bottom: 0 }}
                onMouseDown={() => setIsDraggingVertical(true)}
              />
              <div style={{ width: `${100 - columnSplit}%` }}>
                {renderTab(group4, groupIndex4)}
              </div>
            </div>
          </div>
        ) : has34 ? (
          /* CASO 2: Merge horizontal 3-4 abajo */
          <div className="flex flex-col w-full gap-2">
            <div className="h-1/2 flex gap-2">
              <div style={{ width: `${columnSplit}%` }}>
                {renderTab(group1, groupIndex1)}
              </div>
              <div
                className="absolute top-0 h-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
                style={{ left: `${columnSplit}%`, height: '50%' }}
                onMouseDown={() => setIsDraggingVertical(true)}
              />
              <div style={{ width: `${100 - columnSplit}%` }}>
                {renderTab(group2, groupIndex2)}
              </div>
            </div>
            <div className="h-1/2">
              {renderTab(group3, groupIndex3)}
            </div>
          </div>
        ) : (
          /* CASO 3: Layout por columnas */
          <>
            <div
              ref={leftColumnRef}
              className="relative flex flex-col gap-2"
              style={{ width: `${columnSplit}%` }}
            >
              {has13 ? (
                <div className="h-full">
                  {renderTab(group1, groupIndex1)}
                </div>
              ) : (
                <>
                  <div style={{ height: `${leftColumnRowSplit}%` }}>
                    {renderTab(group1, groupIndex1)}
                  </div>
                  <div
                    className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-green-500 cursor-row-resize z-10 -translate-y-1/2"
                    style={{ top: `${leftColumnRowSplit}%` }}
                    onMouseDown={() => setIsDraggingLeftHorizontal(true)}
                  />
                  <div style={{ height: `${100 - leftColumnRowSplit}%` }}>
                    {renderTab(group3, groupIndex3)}
                  </div>
                </>
              )}
            </div>

            <div
              className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
              style={{ left: `${columnSplit}%` }}
              onMouseDown={() => setIsDraggingVertical(true)}
            />

            <div
              ref={rightColumnRef}
              className="relative flex flex-col gap-2"
              style={{ width: `${100 - columnSplit}%` }}
            >
              {has24 ? (
                <div className="h-full">
                  {renderTab(group2, groupIndex2)}
                </div>
              ) : (
                <>
                  <div style={{ height: `${rightColumnRowSplit}%` }}>
                    {renderTab(group2, groupIndex2)}
                  </div>
                  <div
                    className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-purple-500 cursor-row-resize z-10 -translate-y-1/2"
                    style={{ top: `${rightColumnRowSplit}%` }}
                    onMouseDown={() => setIsDraggingRightHorizontal(true)}
                  />
                  <div style={{ height: `${100 - rightColumnRowSplit}%` }}>
                    {renderTab(group4, groupIndex4)}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
