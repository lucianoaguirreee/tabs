export type ZoneId = 1 | 2 | 3 | 4;

export interface Tab {
  id: string;
  title: string;
  content: string;
  color?: string;
}

export interface Zone {
  id: ZoneId;
  tabs: Tab[];
}

export interface TabsState {
  zones: Record<ZoneId, Tab[]>;
  addTab: (zoneId: ZoneId, tab: Tab) => void;
  removeTab: (tabId: string) => void;
  moveTab: (tabId: string, fromZone: ZoneId, toZone: ZoneId, toIndex?: number) => void;
  getTabLocation: (tabId: string) => { zoneId: ZoneId; index: number } | null;
}
