'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Tab, ZoneId, LayoutDirection } from '../types/tabs';
import { DraggableTab } from './DraggableTab';
import { useState } from 'react';

interface DropZoneProps {
  zoneId: ZoneId;
  tabs: Tab[];
  onRemoveTab: (tabId: string) => void;
  onMergeZone?: (targetZoneId: ZoneId, direction: LayoutDirection) => void;
  adjacentZones?: { top?: ZoneId; bottom?: ZoneId; left?: ZoneId; right?: ZoneId };
}

export function DropZone({ zoneId, tabs, onRemoveTab, onMergeZone, adjacentZones }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${zoneId}`,
  });
  const [showMergeControls, setShowMergeControls] = useState(false);

  return (
    <div
      ref={setNodeRef}
      className={`
        border-2
        ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}
        rounded-xl
        p-4
        min-h-[200px]
        transition-colors
        flex
        flex-col
        gap-3
        relative
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-gray-600">
          Zone {zoneId}
        </div>

        {onMergeZone && (
          <button
            onClick={() => setShowMergeControls(!showMergeControls)}
            className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Opciones de merge"
          >
            ⚡
          </button>
        )}
      </div>

      {showMergeControls && onMergeZone && adjacentZones && (
        <div className="absolute top-12 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 z-10">
          <div className="text-xs font-semibold mb-2 text-gray-700">Juntar con:</div>
          <div className="flex flex-col gap-1">
            {adjacentZones.top && (
              <button
                onClick={() => {
                  onMergeZone(adjacentZones.top!, 'vertical');
                  setShowMergeControls(false);
                }}
                className="text-xs px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                ↑ Zona {adjacentZones.top}
              </button>
            )}
            {adjacentZones.bottom && (
              <button
                onClick={() => {
                  onMergeZone(adjacentZones.bottom!, 'vertical');
                  setShowMergeControls(false);
                }}
                className="text-xs px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                ↓ Zona {adjacentZones.bottom}
              </button>
            )}
            {adjacentZones.left && (
              <button
                onClick={() => {
                  onMergeZone(adjacentZones.left!, 'horizontal');
                  setShowMergeControls(false);
                }}
                className="text-xs px-3 py-1 rounded bg-green-100 hover:bg-green-200 transition-colors"
              >
                ← Zona {adjacentZones.left}
              </button>
            )}
            {adjacentZones.right && (
              <button
                onClick={() => {
                  onMergeZone(adjacentZones.right!, 'horizontal');
                  setShowMergeControls(false);
                }}
                className="text-xs px-3 py-1 rounded bg-green-100 hover:bg-green-200 transition-colors"
              >
                → Zona {adjacentZones.right}
              </button>
            )}
          </div>
        </div>
      )}

      <SortableContext
        items={tabs.map((tab) => tab.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 flex-1">
          {tabs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Arrastra tabs aquí
            </div>
          ) : (
            tabs.map((tab) => (
              <DraggableTab key={tab.id} tab={tab} onRemove={onRemoveTab} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
