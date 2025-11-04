'use client';

import React, { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';

export interface PanelConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultPosition: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface DraggableGridProps {
  panels: PanelConfig[];
  cols?: number;
  rowHeight?: number;
}

export default function DraggableGrid({
  panels,
  cols = 12,
  rowHeight = 100
}: DraggableGridProps) {
  const [layouts, setLayouts] = useState<Layout[]>(
    panels.map(panel => ({
      i: panel.id,
      x: panel.defaultPosition.x,
      y: panel.defaultPosition.y,
      w: panel.defaultPosition.w,
      h: panel.defaultPosition.h,
      minW: 2,
      minH: 1,
    }))
  );

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayouts(newLayout);
  };

  return (
    <div className="w-full h-full overflow-auto p-4">
      <GridLayout
        className="layout"
        layout={layouts}
        cols={cols}
        rowHeight={rowHeight}
        width={1200}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        compactType={null}
        preventCollision={false}
      >
        {panels.map(panel => (
          <div
            key={panel.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden flex flex-col"
          >
            <div className="drag-handle bg-zinc-100 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 cursor-move flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {panel.title}
              </h3>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {panel.content}
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
