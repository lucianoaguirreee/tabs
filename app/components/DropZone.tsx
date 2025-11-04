'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Tab, ZoneId } from '../types/tabs';
import { DraggableTab } from './DraggableTab';

interface DropZoneProps {
  zoneId: ZoneId;
  tabs: Tab[];
  onRemoveTab: (tabId: string) => void;
}

export function DropZone({ zoneId, tabs, onRemoveTab }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${zoneId}`,
  });

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
      `}
    >
      <div className="text-sm font-semibold text-gray-600 mb-2">
        Zone {zoneId}
      </div>

      <SortableContext
        items={tabs.map((tab) => tab.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
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
