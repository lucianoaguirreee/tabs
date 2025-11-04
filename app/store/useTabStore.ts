import { create } from 'zustand';
import { Tab, ZoneId, TabsState, ZoneLayout, LayoutDirection } from '../types/tabs';

const initialTabs: Tab[] = [
  { id: 'tab-1', title: 'Tab 1', content: 'Content for Tab 1', color: 'bg-blue-500' },
  { id: 'tab-2', title: 'Tab 2', content: 'Content for Tab 2', color: 'bg-green-500' },
  { id: 'tab-3', title: 'Tab 3', content: 'Content for Tab 3', color: 'bg-purple-500' },
  { id: 'tab-4', title: 'Tab 4', content: 'Content for Tab 4', color: 'bg-orange-500' },
  { id: 'tab-5', title: 'Tab 5', content: 'Content for Tab 5', color: 'bg-pink-500' },
];

// Initial layout: 2x2 grid
const initialLayout: ZoneLayout = {
  id: 'root',
  type: 'split',
  direction: 'vertical',
  children: [
    {
      id: 'top',
      type: 'split',
      direction: 'horizontal',
      children: [
        { id: 'zone-1', type: 'zone', zoneId: 1 },
        { id: 'zone-2', type: 'zone', zoneId: 2 },
      ],
    },
    {
      id: 'bottom',
      type: 'split',
      direction: 'horizontal',
      children: [
        { id: 'zone-3', type: 'zone', zoneId: 3 },
        { id: 'zone-4', type: 'zone', zoneId: 4 },
      ],
    },
  ],
};

export const useTabStore = create<TabsState>((set, get) => ({
  zones: {
    1: [initialTabs[0], initialTabs[1]],
    2: [initialTabs[2]],
    3: [initialTabs[3]],
    4: [initialTabs[4]],
  },
  layout: initialLayout,

  addTab: (zoneId: ZoneId, tab: Tab) =>
    set((state) => ({
      zones: {
        ...state.zones,
        [zoneId]: [...state.zones[zoneId], tab],
      },
    })),

  removeTab: (tabId: string) =>
    set((state) => {
      const newZones = { ...state.zones };

      // Find and remove the tab from its zone
      Object.keys(newZones).forEach((zoneKey) => {
        const zoneId = Number(zoneKey) as ZoneId;
        newZones[zoneId] = newZones[zoneId].filter((tab) => tab.id !== tabId);
      });

      return { zones: newZones };
    }),

  moveTab: (tabId: string, fromZone: ZoneId, toZone: ZoneId, toIndex?: number) =>
    set((state) => {
      const newZones = { ...state.zones };

      // Find the tab in the source zone
      const tabIndex = newZones[fromZone].findIndex((tab) => tab.id === tabId);
      if (tabIndex === -1) return state;

      const [tab] = newZones[fromZone].splice(tabIndex, 1);

      // Add to destination zone
      if (toIndex !== undefined) {
        newZones[toZone].splice(toIndex, 0, tab);
      } else {
        newZones[toZone].push(tab);
      }

      return { zones: newZones };
    }),

  getTabLocation: (tabId: string) => {
    const state = get();

    for (const zoneKey of Object.keys(state.zones)) {
      const zoneId = Number(zoneKey) as ZoneId;
      const index = state.zones[zoneId].findIndex((tab) => tab.id === tabId);

      if (index !== -1) {
        return { zoneId, index };
      }
    }

    return null;
  },

  mergeZones: (zoneId1: ZoneId, zoneId2: ZoneId, direction: LayoutDirection) =>
    set((state) => {
      // Combine tabs from both zones into the first zone
      const newZones = { ...state.zones };
      newZones[zoneId1] = [...newZones[zoneId1], ...newZones[zoneId2]];
      newZones[zoneId2] = [];

      // Update layout to reflect the merge
      const updateLayout = (layout: ZoneLayout): ZoneLayout => {
        if (layout.type === 'zone') {
          return layout;
        }

        if (layout.children) {
          const newChildren = layout.children.map(updateLayout).filter((child) => {
            // Remove the second zone from layout
            return !(child.type === 'zone' && child.zoneId === zoneId2);
          });

          // If only one child left, collapse the split
          if (newChildren.length === 1) {
            return newChildren[0];
          }

          return { ...layout, children: newChildren };
        }

        return layout;
      };

      return { zones: newZones, layout: updateLayout(state.layout) };
    }),

  splitZone: (zoneId: ZoneId, direction: LayoutDirection) =>
    set((state) => {
      // Find an empty zone to use for the split
      let emptyZone: ZoneId | null = null;
      for (const key of Object.keys(state.zones)) {
        const id = Number(key) as ZoneId;
        if (state.zones[id].length === 0 && id !== zoneId) {
          emptyZone = id;
          break;
        }
      }

      if (!emptyZone) return state; // No empty zones available

      // Update layout to add the split
      const updateLayout = (layout: ZoneLayout): ZoneLayout => {
        if (layout.type === 'zone' && layout.zoneId === zoneId) {
          return {
            id: `split-${zoneId}-${emptyZone}`,
            type: 'split',
            direction,
            children: [
              { ...layout },
              { id: `zone-${emptyZone}`, type: 'zone', zoneId: emptyZone },
            ],
          };
        }

        if (layout.children) {
          return { ...layout, children: layout.children.map(updateLayout) };
        }

        return layout;
      };

      return { layout: updateLayout(state.layout) };
    }),

  setLayout: (layout: ZoneLayout) =>
    set(() => ({
      layout,
    })),
}));
