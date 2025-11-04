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

  const [isDraggingVertical, setIsDraggingVertical] = useState(false); // handle vertical (columnas)
  const [isDraggingLeftHorizontal, setIsDraggingLeftHorizontal] = useState(false); // handle horizontal izquierdo
  const [isDraggingRightHorizontal, setIsDraggingRightHorizontal] = useState(false); // handle horizontal derecho

  const findGroupIndex = (tabId: TabId): number => {
    return mergedGroups.findIndex((group) => group.includes(tabId));
  };

  const findGroupByTab = (tabId: TabId): MergedGroup | undefined => {
    return mergedGroups.find((group) => group.includes(tabId));
  };

  // Reglas de merge mejoradas con validación de conflictos espaciales
  const canMerge = (tab1: TabId, tab2: TabId): boolean => {
    const group1 = findGroupByTab(tab1);
    const group2 = findGroupByTab(tab2);

    if (!group1 || !group2) return false;

    // No se pueden juntar si ya están en el mismo grupo
    if (group1 === group2) return false;

    // Verificar conflictos espaciales

    // Si intentamos juntar 1-2 (horizontal arriba)
    if ((tab1 === 1 && tab2 === 2) || (tab1 === 2 && tab2 === 1)) {
      // No permitir si 1 está en un grupo vertical (1-3) o 2 está en un grupo vertical (2-4)
      const has1And3 = group1.includes(1) && group1.includes(3);
      const has2And4 = group2.includes(2) && group2.includes(4);
      const has1And3_inv = group2.includes(1) && group2.includes(3);
      const has2And4_inv = group1.includes(2) && group1.includes(4);

      if (has1And3 || has2And4 || has1And3_inv || has2And4_inv) {
        return false;
      }
    }

    // Si intentamos juntar 3-4 (horizontal abajo)
    if ((tab1 === 3 && tab2 === 4) || (tab1 === 4 && tab2 === 3)) {
      // No permitir si 3 está en un grupo vertical (1-3) o 4 está en un grupo vertical (2-4)
      const has1And3 = group1.includes(1) && group1.includes(3);
      const has2And4 = group2.includes(2) && group2.includes(4);
      const has1And3_inv = group2.includes(1) && group2.includes(3);
      const has2And4_inv = group1.includes(2) && group1.includes(4);

      if (has1And3 || has2And4 || has1And3_inv || has2And4_inv) {
        return false;
      }
    }

    // Si intentamos juntar 1-3 (vertical izquierda)
    if ((tab1 === 1 && tab2 === 3) || (tab1 === 3 && tab2 === 1)) {
      // No permitir si 1 está en un grupo horizontal (1-2) o 3 está en un grupo horizontal (3-4)
      const has1And2 = group1.includes(1) && group1.includes(2);
      const has3And4 = group2.includes(3) && group2.includes(4);
      const has1And2_inv = group2.includes(1) && group2.includes(2);
      const has3And4_inv = group1.includes(3) && group1.includes(4);

      if (has1And2 || has3And4 || has1And2_inv || has3And4_inv) {
        return false;
      }
    }

    // Si intentamos juntar 2-4 (vertical derecha)
    if ((tab1 === 2 && tab2 === 4) || (tab1 === 4 && tab2 === 2)) {
      // No permitir si 2 está en un grupo horizontal (1-2) o 4 está en un grupo horizontal (3-4)
      const has1And2 = group1.includes(1) && group1.includes(2);
      const has3And4 = group2.includes(3) && group2.includes(4);
      const has1And2_inv = group2.includes(1) && group2.includes(2);
      const has3And4_inv = group1.includes(3) && group1.includes(4);

      if (has1And2 || has3And4 || has1And2_inv || has3And4_inv) {
        return false;
      }
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

  // Manejo de resize vertical (entre columnas)
  const handleVerticalDrag = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Limitar entre 20% y 80%
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setColumnSplit(clampedPercentage);
  }, []);

  // Manejo de resize horizontal columna izquierda (entre 1 y 3)
  const handleLeftHorizontalDrag = useCallback((e: MouseEvent) => {
    if (!leftColumnRef.current) return;

    const rect = leftColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;

    // Limitar entre 20% y 80%
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setLeftColumnRowSplit(clampedPercentage);
  }, []);

  // Manejo de resize horizontal columna derecha (entre 2 y 4)
  const handleRightHorizontalDrag = useCallback((e: MouseEvent) => {
    if (!rightColumnRef.current) return;

    const rect = rightColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;

    // Limitar entre 20% y 80%
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setRightColumnRowSplit(clampedPercentage);
  }, []);

  // Event listeners para drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingVertical) {
      handleVerticalDrag(e);
    }
    if (isDraggingLeftHorizontal) {
      handleLeftHorizontalDrag(e);
    }
    if (isDraggingRightHorizontal) {
      handleRightHorizontalDrag(e);
    }
  }, [isDraggingVertical, isDraggingLeftHorizontal, isDraggingRightHorizontal, handleVerticalDrag, handleLeftHorizontalDrag, handleRightHorizontalDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingVertical(false);
    setIsDraggingLeftHorizontal(false);
    setIsDraggingRightHorizontal(false);
  }, []);

  // Agregar/remover event listeners
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

  // Funciones auxiliares para renderizado
  const getTabsInPosition = (position: TabId): MergedGroup | null => {
    const group = mergedGroups.find(g => g.includes(position));
    if (!group) return null;

    // Si el grupo solo contiene esta pestaña, retornarlo
    if (group.length === 1 && group[0] === position) return group;

    // Si el grupo contiene múltiples pestañas
    if (group.length > 1) {
      // Para pestañas 1 y 2, retornar el grupo si contiene ambas (1-2)
      if (position === 1 || position === 2) {
        if (group.includes(1) && group.includes(2)) return group;
      }
      // Para pestañas 3 y 4, retornar el grupo si contiene ambas (3-4)
      if (position === 3 || position === 4) {
        if (group.includes(3) && group.includes(4)) return group;
      }
      // Para pestañas 1 y 3, retornar el grupo si contiene ambas (1-3)
      if (position === 1 || position === 3) {
        if (group.includes(1) && group.includes(3)) return group;
      }
      // Para pestañas 2 y 4, retornar el grupo si contiene ambas (2-4)
      if (position === 2 || position === 4) {
        if (group.includes(2) && group.includes(4)) return group;
      }
      // Si contiene 3 o 4 pestañas
      if (group.length >= 3) return group;
    }

    // Si solo contiene esta pestaña individual
    if (group.includes(position)) return group;

    return null;
  };

  const renderTab = (group: MergedGroup | null, groupIndex: number) => {
    if (!group) return null;

    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg h-full ${
          group.length === 1 ? getTabColor(group[0]) : "bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500"
        }`}
      >
        <div className="text-4xl font-bold text-white">
          {group.length === 1
            ? `Pestaña ${group[0]}`
            : `Pestañas ${group.join(", ")}`}
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

  // Obtener grupos para cada posición
  const tab1Group = getTabsInPosition(1);
  const tab2Group = getTabsInPosition(2);
  const tab3Group = getTabsInPosition(3);
  const tab4Group = getTabsInPosition(4);

  const tab1GroupIndex = tab1Group ? findGroupIndex(tab1Group[0]) : -1;
  const tab2GroupIndex = tab2Group ? findGroupIndex(tab2Group[0]) : -1;
  const tab3GroupIndex = tab3Group ? findGroupIndex(tab3Group[0]) : -1;
  const tab4GroupIndex = tab4Group ? findGroupIndex(tab4Group[0]) : -1;

  // Verificar si las columnas están merged verticalmente
  const isLeftColumnMerged = tab1Group && tab1Group.includes(1) && tab1Group.includes(3);
  const isRightColumnMerged = tab2Group && tab2Group.includes(2) && tab2Group.includes(4);

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-900 p-4">
      <h1 className="mb-4 text-2xl font-bold text-white">
        Sistema de Pestañas 2x2 con Resize Independiente
      </h1>

      {/* Controles de merge */}
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

      {/* Grid de pestañas con resize independiente */}
      <div
        ref={containerRef}
        className="relative flex flex-1 gap-2"
      >
        {/* Columna izquierda (1 y 3) */}
        <div
          ref={leftColumnRef}
          className="relative flex flex-col gap-2"
          style={{ width: `${columnSplit}%` }}
        >
          {/* Pestaña 1 */}
          <div style={{ height: `${leftColumnRowSplit}%` }}>
            {renderTab(tab1Group, tab1GroupIndex)}
          </div>

          {/* Handle horizontal para columna izquierda */}
          {!isLeftColumnMerged && (
            <div
              className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-green-500 cursor-row-resize z-10 -translate-y-1/2"
              style={{ top: `${leftColumnRowSplit}%` }}
              onMouseDown={() => setIsDraggingLeftHorizontal(true)}
            />
          )}

          {/* Pestaña 3 */}
          {!isLeftColumnMerged && (
            <div style={{ height: `${100 - leftColumnRowSplit}%` }}>
              {renderTab(tab3Group, tab3GroupIndex)}
            </div>
          )}
        </div>

        {/* Resize handle vertical (entre columnas) */}
        <div
          className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-20 -translate-x-1/2"
          style={{ left: `${columnSplit}%` }}
          onMouseDown={() => setIsDraggingVertical(true)}
        />

        {/* Columna derecha (2 y 4) */}
        <div
          ref={rightColumnRef}
          className="relative flex flex-col gap-2"
          style={{ width: `${100 - columnSplit}%` }}
        >
          {/* Pestaña 2 */}
          <div style={{ height: `${rightColumnRowSplit}%` }}>
            {renderTab(tab2Group, tab2GroupIndex)}
          </div>

          {/* Handle horizontal para columna derecha */}
          {!isRightColumnMerged && (
            <div
              className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-purple-500 cursor-row-resize z-10 -translate-y-1/2"
              style={{ top: `${rightColumnRowSplit}%` }}
              onMouseDown={() => setIsDraggingRightHorizontal(true)}
            />
          )}

          {/* Pestaña 4 */}
          {!isRightColumnMerged && (
            <div style={{ height: `${100 - rightColumnRowSplit}%` }}>
              {renderTab(tab4Group, tab4GroupIndex)}
            </div>
          )}
        </div>
      </div>

      {/* Información de estado */}
      <div className="mt-4 rounded bg-zinc-800 p-4 text-white">
        <h2 className="mb-2 font-bold">Estado actual:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm">Grupos:</p>
            <pre className="text-xs">
              {JSON.stringify(mergedGroups, null, 2)}
            </pre>
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
