// Shapes returned by the backend topology/automation endpoints. These mirror
// the normalization done in `backend/app/ha_registry.py`.

export interface HaArea {
  area_id: string;
  name: string;
}

export interface HaEntity {
  entity_id: string;
  name: string;
  domain: string;
  area_id: string | null;
  device_id: string | null;
  device_name: string | null;
}

export interface HaScene {
  entity_id: string;
  name: string;
  area_id: string | null;
  /** Entity ids the scene controls (from the scene state attributes). */
  entities: string[];
}

export interface HaAutomation {
  entity_id: string;
  name: string;
  area_id: string | null;
  /** Numeric config id used to fetch the automation config; may be null. */
  numeric_id: string | null;
  /** Entities/scenes/devices the automation references (parsed from config). */
  references: ReferencedIds;
}

export interface Topology {
  areas: HaArea[];
  entities: HaEntity[];
  scenes: HaScene[];
  automations: HaAutomation[];
}

/** Ids an automation config references, split by kind. */
export interface ReferencedIds {
  entities: string[];
  scenes: string[];
  devices: string[];
}

export interface AutomationDetail {
  config: Record<string, unknown>;
  referenced: ReferencedIds;
}

/** Live state of a single entity (from HA's REST /api/states/<id>). */
export interface EntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

/** Synthetic area id used to group entities that have no assigned area. */
export const UNASSIGNED_AREA_ID = "__unassigned__";
