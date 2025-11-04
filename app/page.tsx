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

  // Estado para resize: porcentajes de la primera columna y primera fila
  const [columnSplit, setColumnSplit] = useState(50); // % para primera columna
  const [rowSplit, setRowSplit] = useState(50); // % para primera fila

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);

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

  const getGridPosition = (group: MergedGroup): string => {
    const hasTab1 = group.includes(1);
    const hasTab2 = group.includes(2);
    const hasTab3 = group.includes(3);
    const hasTab4 = group.includes(4);

    // Si tiene todas las pestañas (4)
    if (group.length === 4) {
      return "col-span-2 row-span-2";
    }

    // Si tiene 3 pestañas
    if (group.length === 3) {
      // Cualquier grupo de 3 ocupa todo el espacio
      return "col-span-2 row-span-2";
    }

    // Si tiene 2 pestañas
    if (group.length === 2) {
      // Vertical izquierda (1,3)
      if (hasTab1 && hasTab3) return "col-start-1 col-span-1 row-span-2";
      // Vertical derecha (2,4)
      if (hasTab2 && hasTab4) return "col-start-2 col-span-1 row-span-2";
      // Horizontal arriba (1,2)
      if (hasTab1 && hasTab2) return "col-span-2 row-start-1 row-span-1";
      // Horizontal abajo (3,4)
      if (hasTab3 && hasTab4) return "col-span-2 row-start-2 row-span-1";
      // Diagonal u otro caso
      return "col-span-2 row-span-2";
    }

    // Posición individual (1 pestaña)
    if (hasTab1) return "col-start-1 row-start-1";
    if (hasTab2) return "col-start-2 row-start-1";
    if (hasTab3) return "col-start-1 row-start-2";
    if (hasTab4) return "col-start-2 row-start-2";

    return "";
  };

  // Manejo de resize vertical (columnas)
  const handleVerticalDrag = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Limitar entre 20% y 80%
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setColumnSplit(clampedPercentage);
  }, []);

  // Manejo de resize horizontal (filas)
  const handleHorizontalDrag = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;

    // Limitar entre 20% y 80%
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setRowSplit(clampedPercentage);
  }, []);

  // Event listeners para drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingVertical) {
      handleVerticalDrag(e);
    }
    if (isDraggingHorizontal) {
      handleHorizontalDrag(e);
    }
  }, [isDraggingVertical, isDraggingHorizontal, handleVerticalDrag, handleHorizontalDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingVertical(false);
    setIsDraggingHorizontal(false);
  }, []);

  // Agregar/remover event listeners
  useEffect(() => {
    if (isDraggingVertical || isDraggingHorizontal) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingVertical, isDraggingHorizontal, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-900 p-4">
      <h1 className="mb-4 text-2xl font-bold text-white">
        Sistema de Pestañas 2x2 con Resize
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
            setRowSplit(50);
          }}
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
        >
          Reset Tamaños
        </button>
      </div>

      {/* Grid de pestañas con resize */}
      <div
        ref={containerRef}
        className="relative flex-1"
        style={{
          display: 'grid',
          gridTemplateColumns: `${columnSplit}% ${100 - columnSplit}%`,
          gridTemplateRows: `${rowSplit}% ${100 - rowSplit}%`,
          gap: '0.5rem',
        }}
      >
        {mergedGroups.map((group, groupIndex) => {
          const gridPosition = getGridPosition(group);
          return (
            <div
              key={groupIndex}
              className={`relative flex flex-col items-center justify-center rounded-lg ${gridPosition} ${
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
        })}

        {/* Resize handle vertical (columnas) */}
        <div
          className="absolute top-0 bottom-0 w-2 bg-zinc-700 hover:bg-blue-500 cursor-col-resize z-10 -translate-x-1/2"
          style={{ left: `${columnSplit}%` }}
          onMouseDown={() => setIsDraggingVertical(true)}
        />

        {/* Resize handle horizontal (filas) */}
        <div
          className="absolute left-0 right-0 h-2 bg-zinc-700 hover:bg-blue-500 cursor-row-resize z-10 -translate-y-1/2"
          style={{ top: `${rowSplit}%` }}
          onMouseDown={() => setIsDraggingHorizontal(true)}
        />
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
              {`Columna 1: ${columnSplit.toFixed(1)}%\nColumna 2: ${(100 - columnSplit).toFixed(1)}%\nFila 1: ${rowSplit.toFixed(1)}%\nFila 2: ${(100 - rowSplit).toFixed(1)}%`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
