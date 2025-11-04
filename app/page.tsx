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

  // Estado para resize
  const [columnSplit, setColumnSplit] = useState(50); // % para dividir columnas
  const [leftColumnRowSplit, setLeftColumnRowSplit] = useState(50); // % para dividir 1 y 3
  const [rightColumnRowSplit, setRightColumnRowSplit] = useState(50); // % para dividir 2 y 4

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

  const renderTab = (group: MergedGroup | null, groupIndex: number) => {
    if (!group) return null;

    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg h-full w-full ${
          group.length === 1 ? getTabColor(group[0]) : "bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500"
        }`}
      >
        <div className="text-4xl font-bold text-white">
          {group.length === 1 ? `Pestaña ${group[0]}` : `Pestañas ${group.join(", ")}`}
        </div>
        {group.length > 1 && (
          <button
            onClick={() => splitGroup(groupIndex)}
            className="mt-4 rounded bg-white px-4 py-2 text-black hover:bg-gray-200"
          >
            Separar
          </button>
        )}
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
      <h1 className="mb-4 text-2xl font-bold text-white">
        Sistema de Pestañas 2x2 con Resize Independiente
      </h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => mergeTabs(1, 2)}
          disabled={!canMerge(1, 2)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Juntar 1-2
        </button>
        <button
          onClick={() => mergeTabs(1, 3)}
          disabled={!canMerge(1, 3)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Juntar 1-3
        </button>
        <button
          onClick={() => mergeTabs(2, 4)}
          disabled={!canMerge(2, 4)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Juntar 2-4
        </button>
        <button
          onClick={() => mergeTabs(3, 4)}
          disabled={!canMerge(3, 4)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Juntar 3-4
        </button>
        <button
          onClick={() => {
            setColumnSplit(50);
            setLeftColumnRowSplit(50);
            setRightColumnRowSplit(50);
          }}
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
        >
          Reset Tamaños
        </button>
      </div>

      {/* Grid principal */}
      <div ref={containerRef} className="relative flex-1 flex gap-2">
        {/* CASO 1: Merge horizontal 1-2 arriba */}
        {has12 ? (
          <div className="flex flex-col w-full gap-2">
            {/* Fila superior: 1-2 merged (100% ancho) */}
            <div className="h-1/2">
              {renderTab(group1, groupIndex1)}
            </div>
            {/* Fila inferior: 3 y 4 */}
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
            {/* Fila superior: 1 y 2 */}
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
            {/* Fila inferior: 3-4 merged (100% ancho) */}
            <div className="h-1/2">
              {renderTab(group3, groupIndex3)}
            </div>
          </div>
        ) : (
          /* CASO 3: Layout por columnas (sin merge horizontal) */
          <>
            {/* Columna izquierda */}
            <div
              ref={leftColumnRef}
              className="relative flex flex-col gap-2"
              style={{ width: `${columnSplit}%` }}
            >
              {has13 ? (
                /* 1-3 merged: 100% altura */
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

            {/* Handle vertical entre columnas */}
            <div
              className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
              style={{ left: `${columnSplit}%` }}
              onMouseDown={() => setIsDraggingVertical(true)}
            />

            {/* Columna derecha */}
            <div
              ref={rightColumnRef}
              className="relative flex flex-col gap-2"
              style={{ width: `${100 - columnSplit}%` }}
            >
              {has24 ? (
                /* 2-4 merged: 100% altura */
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

      {/* Información de estado */}
      <div className="mt-4 rounded bg-zinc-800 p-4 text-white">
        <h2 className="mb-2 font-bold">Estado actual:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm">Grupos:</p>
            <pre className="text-xs">{JSON.stringify(mergedGroups, null, 2)}</pre>
          </div>
          <div>
            <p className="text-sm">Tamaños:</p>
            <pre className="text-xs">
              {`Columnas: ${columnSplit.toFixed(1)}% | ${(100 - columnSplit).toFixed(1)}%
Izq (1-3): ${leftColumnRowSplit.toFixed(1)}% | ${(100 - leftColumnRowSplit).toFixed(1)}%
Der (2-4): ${rightColumnRowSplit.toFixed(1)}% | ${(100 - rightColumnRowSplit).toFixed(1)}%`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
