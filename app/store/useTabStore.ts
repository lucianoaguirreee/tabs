import { create } from 'zustand';
import { Tab, ZoneId, TabsState } from '../types/tabs';

const initialTabs: Tab[] = [
  { id: 'tab-1', title: 'Tab 1', content: 'Content for Tab 1', color: 'bg-blue-500' },
  { id: 'tab-2', title: 'Tab 2', content: 'Content for Tab 2', color: 'bg-green-500' },
  { id: 'tab-3', title: 'Tab 3', content: 'Content for Tab 3', color: 'bg-purple-500' },
  { id: 'tab-4', title: 'Tab 4', content: 'Content for Tab 4', color: 'bg-orange-500' },
  { id: 'tab-5', title: 'Tab 5', content: 'Content for Tab 5', color: 'bg-pink-500' },
];

export const useTabStore = create<TabsState>((set, get) => ({
  zones: {
    1: [initialTabs[0], initialTabs[1]],
    2: [initialTabs[2]],
    3: [initialTabs[3]],
    4: [initialTabs[4]],
  },

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
}));
