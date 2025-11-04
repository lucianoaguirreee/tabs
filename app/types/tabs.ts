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

export type LayoutDirection = 'horizontal' | 'vertical';

export interface ZoneLayout {
  id: string;
  type: 'zone' | 'split';
  // For type 'zone'
  zoneId?: ZoneId;
  // For type 'split'
  direction?: LayoutDirection;
  children?: ZoneLayout[];
  size?: number; // Percentage or flex value
}

export interface TabsState {
  zones: Record<ZoneId, Tab[]>;
  layout: ZoneLayout;
  addTab: (zoneId: ZoneId, tab: Tab) => void;
  removeTab: (tabId: string) => void;
  moveTab: (tabId: string, fromZone: ZoneId, toZone: ZoneId, toIndex?: number) => void;
  getTabLocation: (tabId: string) => { zoneId: ZoneId; index: number } | null;
  mergeZones: (zoneId1: ZoneId, zoneId2: ZoneId, direction: LayoutDirection) => void;
  splitZone: (zoneId: ZoneId, direction: LayoutDirection) => void;
  setLayout: (layout: ZoneLayout) => void;
}
