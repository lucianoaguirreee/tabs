"use client";

import { useState } from "react";

type TabId = 1 | 2 | 3 | 4;
type MergedGroup = TabId[];

export default function Home() {
  const [mergedGroups, setMergedGroups] = useState<MergedGroup[]>([
    [1],
    [2],
    [3],
    [4],
  ]);

  const findGroupIndex = (tabId: TabId): number => {
    return mergedGroups.findIndex((group) => group.includes(tabId));
  };

  const canMerge = (tab1: TabId, tab2: TabId): boolean => {
    const group1Index = findGroupIndex(tab1);
    const group2Index = findGroupIndex(tab2);
    return group1Index !== group2Index;
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

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-900 p-4">
      <h1 className="mb-4 text-2xl font-bold text-white">
        Sistema de Pestañas 2x2
      </h1>

      {/* Controles de merge */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => mergeTabs(1, 2)}
          disabled={!canMerge(1, 2)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Juntar 1-2
        </button>
        <button
          onClick={() => mergeTabs(1, 3)}
          disabled={!canMerge(1, 3)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Juntar 1-3
        </button>
        <button
          onClick={() => mergeTabs(2, 4)}
          disabled={!canMerge(2, 4)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Juntar 2-4
        </button>
        <button
          onClick={() => mergeTabs(3, 4)}
          disabled={!canMerge(3, 4)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Juntar 3-4
        </button>
      </div>

      {/* Grid de pestañas - ocupa todo el espacio restante */}
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-2">
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
      </div>

      {/* Información de estado */}
      <div className="mt-4 rounded bg-zinc-800 p-4 text-white">
        <h2 className="mb-2 font-bold">Estado actual:</h2>
        <pre className="text-sm">
          {JSON.stringify(mergedGroups, null, 2)}
        </pre>
      </div>
    </div>
  );
}
