// Shapes returned by the backend topology/automation endpoints. These mirror
// the normalization done in `backend/app/ha_registry.py`.

export interface HaArea {
  area_id: string;
  name: string;
}

export interface HaEntity {
  area_id: string | null;
  device_id: string | null;
  device_name: string | null;
  domain: string;
  entity_id: string;
  name: string;
  state?: string | null;
}

export interface HaScene {
  area_id: string | null;
  /** Entity ids the scene controls (from the scene state attributes). */
  entities: string[];
  entity_id: string;
  name: string;
  state?: string | null;
}

export interface HaAutomation {
  area_id: string | null;
  entity_id: string;
  name: string;
  /** Numeric config id used to fetch the automation config; may be null. */
  numeric_id: string | null;
  /** Entities/scenes/devices the automation references (parsed from config). */
  references: ReferencedIds;
  state?: string | null;
}

export interface Topology {
  areas: HaArea[];
  automations: HaAutomation[];
  entities: HaEntity[];
  scenes: HaScene[];
}

/** Ids an automation config references, split by kind. */
export interface ReferencedIds {
  devices: string[];
  entities: string[];
  scenes: string[];
}

export interface AutomationDetail {
  config: Record<string, unknown>;
  referenced: ReferencedIds;
}

/** Live state of a single entity (from HA's REST /api/states/<id>). */
export interface EntityState {
  attributes: Record<string, unknown>;
  entity_id: string;
  last_changed?: string;
  last_updated?: string;
  state: string;
}

/** Synthetic area id used to group entities that have no assigned area. */
export const UNASSIGNED_AREA_ID = '__unassigned__';
