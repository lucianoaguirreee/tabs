'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tab } from '../types/tabs';

interface DraggableTabProps {
  tab: Tab;
  onRemove: (tabId: string) => void;
}

export function DraggableTab({ tab, onRemove }: DraggableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        ${tab.color || 'bg-blue-500'}
        text-white
        rounded-lg
        p-3
        cursor-move
        hover:opacity-90
        transition-opacity
        flex
        items-center
        justify-between
        gap-2
        shadow-md
      `}
    >
      <span className="font-medium">{tab.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(tab.id);
        }}
        className="
          hover:bg-white/20
          rounded
          px-2
          py-1
          text-sm
          transition-colors
        "
      >
        ✕
      </button>
    </div>
  );
}
