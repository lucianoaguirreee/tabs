'use client';

import { DndContext, DragEndEvent, DragOverEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTabStore } from '../store/useTabStore';
import { DropZone } from './DropZone';
import { ZoneId } from '../types/tabs';

export function TabGrid() {
  const { zones, moveTab, removeTab } = useTabStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source zone
    let sourceZone: ZoneId | null = null;
    for (const zoneId of [1, 2, 3, 4] as ZoneId[]) {
      if (zones[zoneId].some((tab) => tab.id === activeId)) {
        sourceZone = zoneId;
        break;
      }
    }

    if (!sourceZone) return;

    // Check if dropped on a zone
    const zoneMatch = overId.match(/^zone-(\d+)$/);
    if (zoneMatch) {
      const targetZone = Number(zoneMatch[1]) as ZoneId;
      if (sourceZone !== targetZone) {
        moveTab(activeId, sourceZone, targetZone);
      }
      return;
    }

    // Check if dropped on another tab (reordering within or between zones)
    let targetZone: ZoneId | null = null;
    let targetIndex = -1;

    for (const zoneId of [1, 2, 3, 4] as ZoneId[]) {
      const index = zones[zoneId].findIndex((tab) => tab.id === overId);
      if (index !== -1) {
        targetZone = zoneId;
        targetIndex = index;
        break;
      }
    }

    if (targetZone && targetIndex !== -1) {
      if (sourceZone === targetZone) {
        // Reordering within the same zone
        const sourceIndex = zones[sourceZone].findIndex((tab) => tab.id === activeId);
        if (sourceIndex !== targetIndex) {
          moveTab(activeId, sourceZone, targetZone, targetIndex);
        }
      } else {
        // Moving to a different zone
        moveTab(activeId, sourceZone, targetZone, targetIndex);
      }
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4 p-6 h-screen bg-gray-100">
        {/* Zone 1 (top-left) */}
        <DropZone zoneId={1} tabs={zones[1]} onRemoveTab={removeTab} />

        {/* Zone 2 (top-right) */}
        <DropZone zoneId={2} tabs={zones[2]} onRemoveTab={removeTab} />

        {/* Zone 3 (bottom-left) */}
        <DropZone zoneId={3} tabs={zones[3]} onRemoveTab={removeTab} />

        {/* Zone 4 (bottom-right) */}
        <DropZone zoneId={4} tabs={zones[4]} onRemoveTab={removeTab} />
      </div>
    </DndContext>
  );
}
