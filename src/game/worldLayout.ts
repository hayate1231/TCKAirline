import type { AabbCollider } from './escapeLogic';

export interface WallSegment {
  id: string;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  hasPorthole?: boolean;
}

export interface InteractableAnchor {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
}

export interface GateOpenState {
  boundaryOpen: boolean;
  westGateOpen: boolean;
  demonGateOpen: boolean;
  eastGateOpen: boolean;
  hangarGateOpen: boolean;
  hatchOpen: boolean;
}

export const PLAYER_RADIUS = 0.48;
export const PLAYER_EYE_HEIGHT = 1.65;
export const PLAYER_SPAWN = {
  x: 0,
  z: 14.4,
  yaw: 0, // Facing -Z toward Boundary Gate & Central Atrium
};

export const WALL_HEIGHT = 4.6;
export const WALL_THICKNESS = 0.5;

export const CABIN_WALLS: readonly WallSegment[] = [
  // Zone H: South Rooftop Sky Balcony (x in [-7.5, 7.5], z in [16.5, 24.5])
  { id: 'wall-balcony-south', x: 0, z: 24.5, w: 15.5, d: WALL_THICKNESS, h: 1.4 },
  { id: 'wall-balcony-west', x: -7.5, z: 20.5, w: WALL_THICKNESS, d: 7.5, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-balcony-east', x: 7.5, z: 20.5, w: WALL_THICKNESS, d: 7.5, h: WALL_HEIGHT, hasPorthole: true },
  // Archway Partition between Zone A & Zone H at z = 16.5 (open 4m center doorway x in [-2.0, 2.0])
  { id: 'wall-balcony-part-l', x: -4.625, z: 16.5, w: 5.25, d: WALL_THICKNESS, h: WALL_HEIGHT },
  { id: 'wall-balcony-part-r', x: 4.625, z: 16.5, w: 5.25, d: WALL_THICKNESS, h: WALL_HEIGHT },

  // Zone A: South Awakening Deck (x in [-7.5, 7.5], z in [9.75, 16.75])
  { id: 'wall-awakening-west', x: -7.5, z: 13.25, w: WALL_THICKNESS, d: 7.0, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-awakening-east', x: 7.5, z: 13.25, w: WALL_THICKNESS, d: 7.0, h: WALL_HEIGHT, hasPorthole: true },

  // Boundary Partition Wall at z = 8.5 (3.6m doorway x in [-1.8, 1.8])
  { id: 'wall-boundary-left', x: -4.525, z: 8.5, w: 5.45, d: WALL_THICKNESS, h: WALL_HEIGHT },
  { id: 'wall-boundary-right', x: 4.525, z: 8.5, w: 5.45, d: WALL_THICKNESS, h: WALL_HEIGHT },

  // Zone B: Central Atrium North Wall at z = -8.5 (3.6m Escape Hatch x in [-1.8, 1.8])
  { id: 'wall-north-left', x: -4.525, z: -8.5, w: 5.45, d: WALL_THICKNESS, h: WALL_HEIGHT },
  { id: 'wall-north-right', x: 4.525, z: -8.5, w: 5.45, d: WALL_THICKNESS, h: WALL_HEIGHT },

  // West Partition Wall at x = -7.5 (3.6m doorway z in [-1.8, 1.8])
  { id: 'wall-west-part-n', x: -7.5, z: -5.775, w: WALL_THICKNESS, d: 7.95, h: WALL_HEIGHT },
  { id: 'wall-west-part-s', x: -7.5, z: 5.775, w: WALL_THICKNESS, d: 7.95, h: WALL_HEIGHT },

  // East Partition Wall at x = +7.5 (3.6m doorway z in [-1.8, 1.8])
  { id: 'wall-east-part-n', x: 7.5, z: -5.775, w: WALL_THICKNESS, d: 7.95, h: WALL_HEIGHT },
  { id: 'wall-east-part-s', x: 7.5, z: 5.775, w: WALL_THICKNESS, d: 7.95, h: WALL_HEIGHT },

  // Zone C: West Inner Conservatory Perimeter (x in [-18.25, -7.75], z in [-9.5, 9.5])
  { id: 'wall-west-north', x: -13.0, z: -9.5, w: 10.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-west-south', x: -13.0, z: 9.5, w: 10.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },

  // Partition between Zone C & Zone F at x = -18.5 (3.6m Demon Gate z in [-1.8, 1.8])
  { id: 'wall-demon-part-n', x: -18.5, z: -5.775, w: WALL_THICKNESS, d: 7.95, h: WALL_HEIGHT },
  { id: 'wall-demon-part-s', x: -18.5, z: 5.775, w: WALL_THICKNESS, d: 7.95, h: WALL_HEIGHT },

  // Zone F: Far-West Demon Sanctum Perimeter (x in [-29.25, -18.75], z in [-9.5, 9.5])
  { id: 'wall-farwest-north', x: -24.0, z: -9.5, w: 10.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-farwest-south', x: -24.0, z: 9.5, w: 10.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },

  // Open Archway between Zone F & Zone I at x = -29.5 (4m center passage z in [-2.0, 2.0])
  { id: 'wall-obs-part-n', x: -29.5, z: -5.875, w: WALL_THICKNESS, d: 7.75, h: WALL_HEIGHT },
  { id: 'wall-obs-part-s', x: -29.5, z: 5.875, w: WALL_THICKNESS, d: 7.75, h: WALL_HEIGHT },

  // Zone I: Outer-West Starlit Observatory Perimeter (x in [-41.25, -29.75], z in [-9.5, 9.5])
  { id: 'wall-obs-north', x: -35.5, z: -9.5, w: 11.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-obs-south', x: -35.5, z: 9.5, w: 11.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-obs-end', x: -41.5, z: 0, w: WALL_THICKNESS, d: 19.5, h: WALL_HEIGHT, hasPorthole: true },

  // Zone D: East Inner Propulsion Bay Perimeter (x in [7.75, 18.25], z in [-9.5, 9.5])
  { id: 'wall-east-north', x: 13.0, z: -9.5, w: 10.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-east-south', x: 13.0, z: 9.5, w: 10.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },

  // Partition between Zone D & Zone G at x = +18.5 (3.6m Hangar Gate z in [-1.8, 1.8])
  { id: 'wall-hangar-part-n', x: 18.5, z: -5.775, w: WALL_THICKNESS, d: 7.95, h: WALL_HEIGHT },
  { id: 'wall-hangar-part-s', x: 18.5, z: 5.775, w: WALL_THICKNESS, d: 7.95, h: WALL_HEIGHT },

  // Zone G: Far-East Deep-Sea Hangar Perimeter (x in [18.75, 29.25], z in [-9.5, 9.5])
  { id: 'wall-fareast-north', x: 24.0, z: -9.5, w: 10.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-fareast-south', x: 24.0, z: 9.5, w: 10.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },

  // Open Archway between Zone G & Zone J at x = +29.5 (4m center passage z in [-2.0, 2.0])
  { id: 'wall-turb-part-n', x: 29.5, z: -5.875, w: WALL_THICKNESS, d: 7.75, h: WALL_HEIGHT },
  { id: 'wall-turb-part-s', x: 29.5, z: 5.875, w: WALL_THICKNESS, d: 7.75, h: WALL_HEIGHT },

  // Zone J: Outer-East Abyssal Turbine Dock Perimeter (x in [29.75, 41.25], z in [-9.5, 9.5])
  { id: 'wall-turb-north', x: 35.5, z: -9.5, w: 11.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-turb-south', x: 35.5, z: 9.5, w: 11.5, d: WALL_THICKNESS, h: WALL_HEIGHT, hasPorthole: true },
  { id: 'wall-turb-end', x: 41.5, z: 0, w: WALL_THICKNESS, d: 19.5, h: WALL_HEIGHT, hasPorthole: true },

  // Zone E: North Exterior Grassland Terrace Guardrails (x in [-7.5, 7.5], z in [-24.5, -9.75])
  { id: 'terrace-west', x: -7.5, z: -17.125, w: 0.4, d: 14.75, h: 1.2 },
  { id: 'terrace-east', x: 7.5, z: -17.125, w: 0.4, d: 14.75, h: 1.2 },
  { id: 'terrace-north', x: 0, z: -24.5, w: 15.4, d: 0.4, h: 1.2 },
];

export const INTERACTABLE_ANCHORS: readonly InteractableAnchor[] = [
  // Zone A & Zone H (Chapter 1)
  { id: 'salaryman_desk', x: -4.8, y: 1.0, z: 12.6, radius: 0.9 },
  { id: 'overtime_drawer', x: -5.2, y: 0.9, z: 10.2, radius: 0.75 },
  { id: 'rooftop_fence', x: 3.8, y: 1.1, z: 21.6, radius: 0.9 },
  { id: 'sky_sketch', x: -3.8, y: 1.3, z: 21.6, radius: 0.75 },
  { id: 'boundary_door', x: 0, y: 1.5, z: 8.5, radius: 1.4 },

  // Zone B (Chapters 1, 5, 6)
  { id: 'altar', x: 0, y: 1.25, z: 0, radius: 1.1 },
  { id: 'prophecy_stele', x: -3.6, y: 1.2, z: -6.2, radius: 0.75 },
  { id: 'history_bookshelf', x: 3.6, y: 1.3, z: -6.2, radius: 0.9 },
  { id: 'war_chronicle_desk', x: -3.6, y: 1.0, z: 6.2, radius: 0.85 },
  { id: 'myth_globe', x: 3.6, y: 1.25, z: 6.2, radius: 0.85 },
  { id: 'evolution_pillar', x: 0, y: 1.25, z: -4.8, radius: 0.8 },
  { id: 'final_monument', x: 2.6, y: 1.2, z: -7.2, radius: 0.75 },
  { id: 'west_gate', x: -7.5, y: 1.5, z: 0, radius: 1.4 },
  { id: 'east_gate', x: 7.5, y: 1.5, z: 0, radius: 1.4 },
  { id: 'escape_hatch', x: 0, y: 1.5, z: -8.5, radius: 1.4 },

  // Zone C (Chapter 2)
  { id: 'apple_tree', x: -12.6, y: 1.3, z: 4.8, radius: 1.0 },
  { id: 'friend_table', x: -16.2, y: 1.0, z: 4.0, radius: 0.9 },
  { id: 'basket_plate', x: -16.2, y: 0.9, z: 7.4, radius: 0.7 },
  { id: 'withered_flower_pot', x: -9.2, y: 0.9, z: 7.8, radius: 0.7 },
  { id: 'greenhouse_lock', x: -9.2, y: 1.1, z: 3.4, radius: 0.75 },
  { id: 'chalkboard', x: -15.6, y: 1.4, z: -3.4, radius: 0.9 },
  { id: 'apprentice_bed', x: -14.0, y: 0.9, z: -7.2, radius: 1.0 },
  { id: 'age_ledger', x: -9.6, y: 1.0, z: -4.6, radius: 0.8 },
  { id: 'demon_gate', x: -18.5, y: 1.5, z: 0, radius: 1.4 },

  // Zone F & Zone I (Chapter 3)
  { id: 'village_rumor_board', x: -20.4, y: 1.35, z: 6.4, radius: 0.85 },
  { id: 'twilight_mirror', x: -27.6, y: 1.35, z: 6.8, radius: 0.85 },
  { id: 'demon_throne', x: -24.0, y: 1.3, z: 7.2, radius: 0.95 },
  { id: 'demon_seal_pedestal', x: -24.0, y: 1.2, z: 3.4, radius: 0.8 },
  { id: 'ch5_oracle_stele', x: -24.0, y: 1.25, z: -5.8, radius: 0.85 },
  { id: 'twitter_census_pillar', x: -33.5, y: 1.3, z: -5.8, radius: 0.8 },
  { id: 'star_observatory_desk', x: -37.8, y: 1.1, z: -4.6, radius: 0.9 },
  { id: 'relic_vault', x: -36.5, y: 1.2, z: 4.8, radius: 0.85 },

  // Zone D (Chapter 4)
  { id: 'chinchin_samurai', x: 11.6, y: 1.3, z: -6.4, radius: 0.85 },
  { id: 'determination_window', x: 16.4, y: 1.4, z: -4.4, radius: 0.85 },
  { id: 'tsukkomi_scroll', x: 11.6, y: 1.15, z: 6.4, radius: 0.8 },
  { id: 'valve_console', x: 15.4, y: 1.25, z: 4.2, radius: 0.95 },
  { id: 'hangar_gate', x: 18.5, y: 1.5, z: 0, radius: 1.4 },

  // Zone G & Zone J (Chapter 4)
  { id: 'dark_monitor_shrine', x: 20.6, y: 1.1, z: -6.4, radius: 0.9 },
  { id: 'warm_breeze_duct', x: 27.4, y: 1.3, z: -6.4, radius: 0.85 },
  { id: 'compass_calibrator', x: 24.0, y: 1.2, z: -4.2, radius: 0.85 },
  { id: 'submarina_blueprint', x: 33.5, y: 1.1, z: 4.6, radius: 0.9 },
  { id: 'ether_reactor_core', x: 38.0, y: 1.25, z: -4.6, radius: 0.9 },
  { id: 'submarina_dock', x: 36.8, y: 1.2, z: 5.2, radius: 0.95 },
];

export function buildWorldColliders(gates: GateOpenState): AabbCollider[] {
  const colliders: AabbCollider[] = CABIN_WALLS.map((w) => ({
    id: w.id,
    minX: w.x - w.w / 2,
    maxX: w.x + w.w / 2,
    minZ: w.z - w.d / 2,
    maxZ: w.z + w.d / 2,
  }));

  colliders.push(
    // Zone A & H
    { id: 'prop-salaryman', minX: -5.6, maxX: -4.0, minZ: 11.9, maxZ: 13.3 },
    { id: 'prop-drawer', minX: -5.8, maxX: -4.6, minZ: 9.6, maxZ: 10.8 },
    { id: 'prop-rooftop', minX: 3.0, maxX: 4.6, minZ: 20.9, maxZ: 22.3 },
    { id: 'prop-sketch', minX: -4.4, maxX: -3.2, minZ: 21.1, maxZ: 22.1 },

    // Zone B
    { id: 'prop-altar', minX: -1.15, maxX: 1.15, minZ: -1.15, maxZ: 1.15 },
    { id: 'prop-stele', minX: -4.2, maxX: -3.0, minZ: -6.7, maxZ: -5.7 },
    { id: 'prop-bookshelf', minX: 2.8, maxX: 4.4, minZ: -6.7, maxZ: -5.7 },
    { id: 'prop-war-desk', minX: -4.3, maxX: -2.9, minZ: 5.6, maxZ: 6.8 },
    { id: 'prop-myth-globe', minX: 3.0, maxX: 4.2, minZ: 5.6, maxZ: 6.8 },
    { id: 'prop-evo-pillar', minX: -0.65, maxX: 0.65, minZ: -5.4, maxZ: -4.2 },
    { id: 'prop-final-monument', minX: 2.05, maxX: 3.15, minZ: -7.75, maxZ: -6.65 },

    // Zone C
    { id: 'prop-apple-tree', minX: -13.6, maxX: -11.6, minZ: 3.8, maxZ: 5.8 },
    { id: 'prop-friend-table', minX: -17.0, maxX: -15.4, minZ: 3.3, maxZ: 4.7 },
    { id: 'prop-basket-plate', minX: -16.8, maxX: -15.6, minZ: 6.8, maxZ: 8.0 },
    { id: 'prop-flower-pot', minX: -9.8, maxX: -8.6, minZ: 7.2, maxZ: 8.4 },
    { id: 'prop-greenhouse-lock', minX: -9.8, maxX: -8.6, minZ: 2.8, maxZ: 4.0 },
    { id: 'prop-chalkboard', minX: -16.3, maxX: -14.9, minZ: -4.4, maxZ: -2.4 },
    { id: 'prop-apprentice-bed', minX: -15.1, maxX: -12.9, minZ: -8.0, maxZ: -6.4 },
    { id: 'prop-age-ledger', minX: -10.3, maxX: -8.9, minZ: -5.2, maxZ: -4.0 },

    // Zone F & Zone I
    { id: 'prop-rumor-board', minX: -21.2, maxX: -19.6, minZ: 5.8, maxZ: 7.0 },
    { id: 'prop-twilight-mirror', minX: -28.3, maxX: -26.9, minZ: 6.2, maxZ: 7.4 },
    { id: 'prop-demon-throne', minX: -24.8, maxX: -23.2, minZ: 6.4, maxZ: 8.0 },
    { id: 'prop-demon-seal', minX: -24.7, maxX: -23.3, minZ: 2.7, maxZ: 4.1 },
    { id: 'prop-ch5-oracle', minX: -24.7, maxX: -23.3, minZ: -6.5, maxZ: -5.1 },
    { id: 'prop-twitter-census', minX: -34.2, maxX: -32.8, minZ: -6.5, maxZ: -5.1 },
    { id: 'prop-star-desk', minX: -38.6, maxX: -37.0, minZ: -5.3, maxZ: -3.9 },
    { id: 'prop-relic-vault', minX: -37.3, maxX: -35.7, minZ: 4.0, maxZ: 5.6 },

    // Zone D
    { id: 'prop-samurai', minX: 10.8, maxX: 12.4, minZ: -7.2, maxZ: -5.6 },
    { id: 'prop-det-window', minX: 15.6, maxX: 17.2, minZ: -5.2, maxZ: -3.6 },
    { id: 'prop-tsukkomi-scroll', minX: 10.9, maxX: 12.3, minZ: 5.8, maxZ: 7.0 },
    { id: 'prop-valves', minX: 14.6, maxX: 16.2, minZ: 3.1, maxZ: 5.3 },

    // Zone G & Zone J
    { id: 'prop-dark-monitor', minX: 19.8, maxX: 21.4, minZ: -7.1, maxZ: -5.7 },
    { id: 'prop-warm-duct', minX: 26.7, maxX: 28.1, minZ: -7.1, maxZ: -5.7 },
    { id: 'prop-compass', minX: 23.3, maxX: 24.7, minZ: -4.9, maxZ: -3.5 },
    { id: 'prop-blueprint', minX: 32.7, maxX: 34.3, minZ: 3.9, maxZ: 5.3 },
    { id: 'prop-reactor', minX: 37.2, maxX: 38.8, minZ: -5.4, maxZ: -3.8 },
    { id: 'prop-submarina', minX: 35.8, maxX: 37.8, minZ: 4.3, maxZ: 6.1 },

    // 6 Dynamic Chapter Gates
    {
      id: 'gate-boundary-blocker',
      minX: -1.85,
      maxX: 1.85,
      minZ: 8.25,
      maxZ: 8.75,
      enabled: !gates.boundaryOpen,
    },
    {
      id: 'gate-west-blocker',
      minX: -7.75,
      maxX: -7.25,
      minZ: -1.85,
      maxZ: 1.85,
      enabled: !gates.westGateOpen,
    },
    {
      id: 'gate-demon-blocker',
      minX: -18.75,
      maxX: -18.25,
      minZ: -1.85,
      maxZ: 1.85,
      enabled: !gates.demonGateOpen,
    },
    {
      id: 'gate-east-blocker',
      minX: 7.25,
      maxX: 7.75,
      minZ: -1.85,
      maxZ: 1.85,
      enabled: !gates.eastGateOpen,
    },
    {
      id: 'gate-hangar-blocker',
      minX: 18.25,
      maxX: 18.75,
      minZ: -1.85,
      maxZ: 1.85,
      enabled: !gates.hangarGateOpen,
    },
    {
      id: 'gate-hatch-blocker',
      minX: -1.85,
      maxX: 1.85,
      minZ: -8.75,
      maxZ: -8.25,
      enabled: !gates.hatchOpen,
    },
  );

  return colliders;
}
