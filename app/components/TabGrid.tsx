'use client';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { useTabStore } from '../store/useTabStore';
import { DropZone } from './DropZone';
import { ZoneId, ZoneLayout, LayoutDirection } from '../types/tabs';

export function TabGrid() {
  const { zones, layout, moveTab, removeTab, mergeZones } = useTabStore();

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

  const handleMergeZone = (fromZoneId: ZoneId, toZoneId: ZoneId, direction: LayoutDirection) => {
    mergeZones(fromZoneId, toZoneId, direction);
  };

  // Get adjacent zones for a given zone based on initial 2x2 layout
  const getAdjacentZones = (zoneId: ZoneId) => {
    const adjacency: Record<ZoneId, { top?: ZoneId; bottom?: ZoneId; left?: ZoneId; right?: ZoneId }> = {
      1: { right: 2, bottom: 3 },
      2: { left: 1, bottom: 4 },
      3: { top: 1, right: 4 },
      4: { top: 2, left: 3 },
    };
    return adjacency[zoneId] || {};
  };

  // Recursively render the layout tree
  const renderLayout = (node: ZoneLayout): JSX.Element => {
    if (node.type === 'zone' && node.zoneId) {
      return (
        <DropZone
          key={node.id}
          zoneId={node.zoneId}
          tabs={zones[node.zoneId]}
          onRemoveTab={removeTab}
          onMergeZone={(targetZoneId, direction) => handleMergeZone(node.zoneId!, targetZoneId, direction)}
          adjacentZones={getAdjacentZones(node.zoneId)}
        />
      );
    }

    if (node.type === 'split' && node.children) {
      const flexDirection = node.direction === 'horizontal' ? 'flex-row' : 'flex-col';
      return (
        <div key={node.id} className={`flex ${flexDirection} gap-4 flex-1`}>
          {node.children.map((child) => renderLayout(child))}
        </div>
      );
    }

    return <div key={node.id}>Invalid layout node</div>;
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="p-6 h-screen bg-gray-100 flex flex-col">
        {renderLayout(layout)}
      </div>
    </DndContext>
  );
}
