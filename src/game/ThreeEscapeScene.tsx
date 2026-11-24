import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  buildWorldColliders,
  CABIN_WALLS,
  INTERACTABLE_ANCHORS,
  PLAYER_EYE_HEIGHT,
  PLAYER_RADIUS,
  PLAYER_SPAWN,
  WALL_HEIGHT,
} from './worldLayout';
import { resolvePlayerMovement, type GameState } from './escapeLogic';
import type { FootstepSurface } from './audio';
import {
  createBlueprintTexture,
  createCabinWallTextures,
  createChalkboardTexture,
  createContactShadowTexture,
  createGrasslandTexture,
  createPlankWoodTextures,
  createPortholeSkyTexture,
  createProphecySteleTexture,
  createReginaFaceTexture,
  createRumorBoardTexture,
  createSamuraiPlaqueTexture,
  createSketchTexture,
} from './textures';
import {
  buildAppleBasketPlate,
  buildAppleTreeTerrarium,
  buildApprenticeBed,
  buildCentralAltar,
  buildChalkboardDesk,
  buildChinchinSamurai,
  buildCompassCalibrator,
  buildDemonLordThrone,
  buildDeterminationWindow,
  buildEscapeHatch,
  buildFlowerPot,
  buildFriendTable,
  buildGreenhouseLockbox,
  buildHistoryBookshelf,
  buildLoreDesk,
  buildMythGlobe,
  buildPlaqueBoard,
  buildProphecyStele,
  buildPropulsionConsole,
  buildReactorCore,
  buildRelicVault,
  buildRooftopFence,
  buildSalarymanDesk,
  buildScrollPedestal,
  buildSkySketchEasel,
  buildSlidingGate,
  buildSmallCabinet,
  buildSpiritFigures,
  buildStonePillar,
  buildSubmarinaDock,
  buildTwilightMirror,
  createMaterialPalette,
} from './models';

export interface MobileMoveVector {
  fwd: number;
  side: number;
}

export interface ThreeSceneProps {
  gameState: GameState;
  isDialogueOpen: boolean;
  resetToken: number;
  mobileMoveRef: MutableRefObject<MobileMoveVector>;
  onInteract: (interactableId: string) => void;
  onHoverChange: (interactableId: string | null) => void;
  onStepDistance: (surface: FootstepSurface) => void;
  onAutoEscapeTrigger: () => void;
}

const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _rayOrigin = new THREE.Vector3();
const _rayDir = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _pointerNdc = new THREE.Vector2();

function detectSoftwareGl(): boolean {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) return true;
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const gpu = String(gl.getParameter(param));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
}

function updateGateVisual(
  gate: { leftDoor: THREE.Mesh; rightDoor: THREE.Mesh; statusBeacon: THREE.Mesh },
  currentSlide: number,
  isOpen: boolean,
  dt: number,
): number {
  const nextSlide = THREE.MathUtils.damp(currentSlide, isOpen ? 1.65 : 0, 4.5, dt);
  gate.leftDoor.position.x = -0.92 - nextSlide;
  gate.rightDoor.position.x = 0.92 + nextSlide;
  const mat = gate.statusBeacon.material as THREE.MeshStandardMaterial;
  mat.color.setHex(isOpen ? 0x10b981 : 0xdc2626);
  mat.emissive.setHex(isOpen ? 0x059669 : 0x7f1d1d);
  mat.emissiveIntensity = isOpen ? 0.55 : 0.35;
  return nextSlide;
}

export function ThreeEscapeScene({
  gameState,
  isDialogueOpen,
  resetToken,
  mobileMoveRef,
  onInteract,
  onHoverChange,
  onStepDistance,
  onAutoEscapeTrigger,
}: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  const dialogueOpenRef = useRef(isDialogueOpen);
  dialogueOpenRef.current = isDialogueOpen;

  const callbacksRef = useRef({
    onInteract,
    onHoverChange,
    onStepDistance,
    onAutoEscapeTrigger,
  });
  callbacksRef.current = {
    onInteract,
    onHoverChange,
    onStepDistance,
    onAutoEscapeTrigger,
  };

  const playerPoseRef = useRef({
    x: PLAYER_SPAWN.x,
    z: PLAYER_SPAWN.z,
    yaw: PLAYER_SPAWN.yaw,
    pitch: -0.04,
    walkDist: 0,
    lastStepDist: 0,
  });

  useEffect(() => {
    playerPoseRef.current = {
      x: PLAYER_SPAWN.x,
      z: PLAYER_SPAWN.z,
      yaw: PLAYER_SPAWN.yaw,
      pitch: -0.04,
      walkDist: 0,
      lastStepDist: 0,
    };
  }, [resetToken]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.setAttribute('data-testid', 'escape-3d-canvas');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8ecdf5);
    scene.fog = new THREE.FogExp2(0x9cd6f7, 0.0065);

    if (!isSoftwareGl) {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    }

    const camera = new THREE.PerspectiveCamera(
      64,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
      0.1,
      200,
    );

    // Warm/cool lighting rig spanning all 11 zones
    const hemiLight = new THREE.HemisphereLight(0xbbe6ff, 0x4b3b2c, isSoftwareGl ? 1.32 : 0.98);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.85);
    sunLight.position.set(18, 30, 16);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 90;
    sunLight.shadow.camera.left = -42;
    sunLight.shadow.camera.right = 42;
    sunLight.shadow.camera.top = 28;
    sunLight.shadow.camera.bottom = -28;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const roomLightSpecs: [number, number, number][] = [
      [0, 20.5, 0xe0f2fe],   // Zone H South Balcony
      [0, 12.5, 0xffe7ba],   // Zone A Awakening
      [0, 0, 0xffdfa8],      // Zone B Central Atrium
      [-13.0, 0, 0xd9f99d],  // Zone C West Conservatory
      [-24.0, 0, 0xddd6fe],  // Zone F Demon Sanctum
      [-35.5, 0, 0x93c5fd],  // Zone I Outer-West Star Observatory
      [13.0, 0, 0xbae6fd],   // Zone D East Propulsion
      [24.0, 0, 0x99f6e4],   // Zone G Deep-Sea Hangar
      [35.5, 0, 0x5eead4],   // Zone J Outer-East Turbine Dock
    ];
    if (!isSoftwareGl) {
      for (const [lx, lz, hex] of roomLightSpecs) {
        const pl = new THREE.PointLight(hex, 2.5, 20, 1.45);
        pl.position.set(lx, 3.6, lz);
        scene.add(pl);
      }
    }

    // Textures & Materials
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const matPalette = createMaterialPalette(isSoftwareGl);
    const woodTex = createPlankWoodTextures(maxAniso);
    const wallTex = createCabinWallTextures(maxAniso);
    const chalkboardTex = createChalkboardTexture(maxAniso);
    const samuraiPlaqueTex = createSamuraiPlaqueTexture(maxAniso);
    const steleTex = createProphecySteleTexture(maxAniso);
    const rumorBoardTex = createRumorBoardTexture(maxAniso);
    const blueprintTex = createBlueprintTexture(maxAniso);
    const contactShadowTex = createContactShadowTexture();
    const grassTex = createGrasslandTexture(maxAniso);
    const portholeSkyTex = createPortholeSkyTexture(maxAniso);
    const sketchTex = createSketchTexture(maxAniso);
    const reginaFaceTex = createReginaFaceTexture(maxAniso, 'gentle');
    const reginaSmileFaceTex = createReginaFaceTexture(maxAniso, 'smile');

    const centralFloorMap = woodTex.map.clone();
    centralFloorMap.needsUpdate = true;
    centralFloorMap.repeat.set(5, 11);
    const centralFloorBump = woodTex.bumpMap.clone();
    centralFloorBump.needsUpdate = true;
    centralFloorBump.repeat.set(5, 11);

    const centralFloorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: centralFloorMap,
      bumpMap: centralFloorBump,
      bumpScale: 0.03,
      roughness: 0.62,
      metalness: 0.06,
    });

    const wingFloorMap = woodTex.map.clone();
    wingFloorMap.needsUpdate = true;
    wingFloorMap.repeat.set(11, 6);
    const wingFloorBump = woodTex.bumpMap.clone();
    wingFloorBump.needsUpdate = true;
    wingFloorBump.repeat.set(11, 6);

    const wingFloorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: wingFloorMap,
      bumpMap: wingFloorBump,
      bumpScale: 0.03,
      roughness: 0.62,
      metalness: 0.06,
    });

    const wallEndCapMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: wallTex.capMap,
      roughness: 0.72,
      metalness: 0.08,
    });

    const wallFaceMatCache = new Map<string, THREE.MeshStandardMaterial>();
    const getWallFaceMat = (length: number, isParapet: boolean): THREE.MeshStandardMaterial => {
      const repX = Math.max(1, Math.round(length / 3.2));
      const key = `${isParapet ? 'p' : 'w'}:${repX}`;
      const existing = wallFaceMatCache.get(key);
      if (existing) return existing;

      if (isParapet) {
        const pMap = wallTex.parapetMap.clone();
        pMap.needsUpdate = true;
        pMap.repeat.set(repX, 1);
        const m = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: pMap,
          roughness: 0.72,
          metalness: 0.08,
        });
        wallFaceMatCache.set(key, m);
        return m;
      }

      const wMap = wallTex.map.clone();
      wMap.needsUpdate = true;
      wMap.repeat.set(repX, 1);
      const wBump = wallTex.bumpMap.clone();
      wBump.needsUpdate = true;
      wBump.repeat.set(repX, 1);
      const m = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: wMap,
        bumpMap: wBump,
        bumpScale: 0.025,
        roughness: 0.72,
        metalness: 0.08,
      });
      wallFaceMatCache.set(key, m);
      return m;
    };

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x2c3a52,
      roughness: 0.68,
      metalness: 0.25,
    });

    // Cabin Floors abutting cleanly at x = ±7.7 (zero overlapping z-fighting)
    const centralFloor = new THREE.Mesh(new THREE.BoxGeometry(15.4, 0.2, 33.4), centralFloorMat);
    centralFloor.position.set(0, -0.1, 8.0);
    centralFloor.receiveShadow = true;
    scene.add(centralFloor);

    const westWingFloor = new THREE.Mesh(new THREE.BoxGeometry(34.0, 0.2, 19.4), wingFloorMat);
    westWingFloor.position.set(-24.7, -0.1, 0);
    westWingFloor.receiveShadow = true;
    scene.add(westWingFloor);

    const eastWingFloor = new THREE.Mesh(new THREE.BoxGeometry(34.0, 0.2, 19.4), wingFloorMat);
    eastWingFloor.position.set(24.7, -0.1, 0);
    eastWingFloor.receiveShadow = true;
    scene.add(eastWingFloor);

    // Ceilings abutting cleanly at z = 9.8 (open-sky over Zone H South Balcony & Zone E North Terrace)
    const ceilingMain = new THREE.Mesh(new THREE.BoxGeometry(83.6, 0.24, 19.6), ceilingMat);
    ceilingMain.position.set(0, WALL_HEIGHT + 0.12, 0);
    scene.add(ceilingMain);

    const ceilingSouth = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.24, 7.0), ceilingMat);
    ceilingSouth.position.set(0, WALL_HEIGHT + 0.12, 13.3);
    scene.add(ceilingSouth);

    const skylightMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x7dd3fc,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });
    for (const [sx, sz, sl] of [
      [0, 12.5, 5.4],
      [-35.5, 0, 14.0],
      [-24.0, 0, 14.0],
      [-13.0, 0, 14.0],
      [0, 0, 13.0],
      [13.0, 0, 14.0],
      [24.0, 0, 14.0],
      [35.5, 0, 14.0],
    ]) {
      const skylight = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, sl), skylightMat);
      skylight.position.set(sx, WALL_HEIGHT - 0.02, sz);
      scene.add(skylight);
    }

    for (const rz of [-6, -2.5, 2.5, 6, 11, 14.5]) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.22, 0.26), matPalette.darkBrass);
      rib.position.set(0, WALL_HEIGHT - 0.1, rz);
      scene.add(rib);
    }

    // Walls + Sky Portholes (Box faces: [+X, -X, +Y, -Y, +Z, -Z])
    const portholeGeo = new THREE.TorusGeometry(0.82, 0.08, 10, 24);
    const portholeSkyGeo = new THREE.CircleGeometry(0.76, 20);
    const portholeSkyMat = new THREE.MeshBasicMaterial({ map: portholeSkyTex });

    for (const w of CABIN_WALLS) {
      const isHorizontal = w.w > w.d;
      const isParapet = w.h <= 1.6;
      const longSideMat = getWallFaceMat(isHorizontal ? w.w : w.d, isParapet);
      const topRailMat = isParapet ? matPalette.brass : ceilingMat;
      const wallMaterials = isHorizontal
        ? [wallEndCapMat, wallEndCapMat, topRailMat, ceilingMat, longSideMat, longSideMat]
        : [longSideMat, longSideMat, topRailMat, ceilingMat, wallEndCapMat, wallEndCapMat];

      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(w.w, w.h, w.d), wallMaterials);
      wallMesh.position.set(w.x, w.h / 2, w.z);
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      scene.add(wallMesh);

      if (w.hasPorthole) {
        for (let i = 0; i < 2; i++) {
          const offset = (i - 0.5) * 4.4;
          const pFrame = new THREE.Mesh(portholeGeo, matPalette.brass);
          const pGlass = new THREE.Mesh(portholeSkyGeo, portholeSkyMat);
          if (isHorizontal) {
            const zFace = w.z > 0 ? w.z - w.d / 2 - 0.05 : w.z + w.d / 2 + 0.05;
            pFrame.position.set(w.x + offset, 2.35, zFace);
            pGlass.position.set(w.x + offset, 2.35, zFace + (w.z > 0 ? 0.015 : -0.015));
            if (w.z > 0) pGlass.rotation.y = Math.PI;
          } else {
            const xFace = w.x > 0 ? w.x - w.w / 2 - 0.05 : w.x + w.w / 2 + 0.05;
            pFrame.rotation.y = Math.PI / 2;
            pFrame.position.set(xFace, 2.35, w.z + offset);
            pGlass.rotation.y = w.x > 0 ? -Math.PI / 2 : Math.PI / 2;
            pGlass.position.set(xFace + (w.x > 0 ? 0.015 : -0.015), 2.35, w.z + offset);
          }
          scene.add(pFrame);
          scene.add(pGlass);
        }
      }
    }

    // Zone E: Expanded Sunlit Exterior Grassland Terrace (North beyond z = -8.5)
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: grassTex,
      roughness: 0.9,
      metalness: 0.0,
    });
    const terraceMesh = new THREE.Mesh(new THREE.BoxGeometry(15.4, 0.3, 16.0), grassMat);
    terraceMesh.position.set(0, -0.15, -16.7);
    terraceMesh.receiveShadow = true;
    scene.add(terraceMesh);

    const terraceAppleTree = buildAppleTreeTerrarium(matPalette);
    terraceAppleTree.position.set(-5.8, 0, -19.5);
    scene.add(terraceAppleTree);

    // Distant Fluffy Multi-Puff Clouds + North & South Chikubi Airplane Clouds
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xe0f2fe,
      emissiveIntensity: 0.22,
      roughness: 0.92,
      metalness: 0.0,
    });
    const puffGeo = new THREE.SphereGeometry(1, 14, 12);
    const addCloudPuffs = (puffs: [number, number, number, number][]) => {
      for (const [cx, cy, cz, cr] of puffs) {
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        puff.position.set(cx, cy, cz);
        puff.scale.set(cr, cr * 0.88, cr * 0.85);
        cloudGroup.add(puff);
      }
    };
    // North Chikubi Airplane Cloud (seen through Escape Hatch & epilogue)
    addCloudPuffs([
      [0, 14.0, -36, 2.2],
      [-2.1, 13.5, -36, 1.55],
      [-3.5, 13.2, -36, 1.1],
      [2.1, 13.5, -36, 1.55],
      [3.5, 13.2, -36, 1.1],
      [0, 16.0, -35.8, 1.0],
      [0, 16.9, -35.7, 0.52],
    ]);
    // South Chikubi Airplane Cloud (seen clearly above balcony during wake-up sequence)
    addCloudPuffs([
      [0.35, 7.1, 36.5, 1.8],
      [-1.55, 6.65, 36.6, 1.25],
      [-2.75, 6.35, 36.7, 0.88],
      [2.25, 6.65, 36.6, 1.25],
      [3.45, 6.35, 36.7, 0.88],
      [0.35, 8.7, 36.3, 0.86],
      [0.35, 9.45, 36.2, 0.44],
    ]);
    // Ambient multi-puff cumulus clouds (North horizon only; South wakeup sky shows strictly 1 cloud)
    const cumulusBases: [number, number, number, number][] = [
      [-22, 12, -39, 1.5],
      [23, 13, -41, 1.6],
    ];
    for (const [bx, by, bz, s] of cumulusBases) {
      addCloudPuffs([
        [bx, by, bz, 1.8 * s],
        [bx - 1.7 * s, by - 0.35 * s, bz + 0.2, 1.35 * s],
        [bx + 1.7 * s, by - 0.3 * s, bz + 0.1, 1.35 * s],
        [bx - 0.6 * s, by + 0.7 * s, bz - 0.2, 1.2 * s],
        [bx + 0.7 * s, by + 0.55 * s, bz - 0.1, 1.1 * s],
      ]);
    }
    scene.add(cloudGroup);

    const interactableObjects: THREE.Object3D[] = [];
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.45,
    });
    const shadowGeo = new THREE.CircleGeometry(1.15, 20);
    const placeProp = (obj: THREE.Object3D, x: number, z: number, rotY = 0, shadowScale = 1.0) => {
      obj.position.set(x, 0, z);
      obj.rotation.y = rotY;
      scene.add(obj);
      interactableObjects.push(obj);
      if (shadowScale > 0) {
        const s = new THREE.Mesh(shadowGeo, shadowMat);
        s.rotation.x = -Math.PI / 2;
        s.position.set(x, 0.015, z);
        s.scale.setScalar(shadowScale);
        scene.add(s);
      }
    };

    // --- Zone A & Zone H (Chapter 1) ---
    placeProp(buildSalarymanDesk(matPalette), -4.8, 12.6, 0.4, 1.1);
    placeProp(buildSmallCabinet(matPalette, 'overtime_drawer'), -5.2, 10.2, 0.85, 0.85);
    placeProp(buildRooftopFence(matPalette), 3.8, 21.6, Math.PI - 0.35, 1.1);
    placeProp(buildSkySketchEasel(matPalette, sketchTex), -3.8, 21.6, Math.PI + 0.35, 0.9);

    const boundaryDoor = buildSlidingGate(matPalette, 'boundary_door');
    boundaryDoor.group.position.set(0, 0, 8.5);
    scene.add(boundaryDoor.group);
    interactableObjects.push(boundaryDoor.group);

    // --- Zone B (Chapter 2, 10, 11, 12) ---
    const altar = buildCentralAltar(matPalette);
    altar.group.position.set(0, 0, 0);
    scene.add(altar.group);
    interactableObjects.push(altar.group);
    {
      const s = new THREE.Mesh(shadowGeo, shadowMat);
      s.rotation.x = -Math.PI / 2;
      s.position.set(0, 0.015, 0);
      s.scale.setScalar(1.35);
      scene.add(s);
    }

    const spirits = buildSpiritFigures(matPalette, reginaFaceTex);
    spirits.reginaGroup.position.set(-1.7, 0, -1.2);
    spirits.reginaGroup.rotation.y = 0.5;
    scene.add(spirits.reginaGroup);
    spirits.risaaGroup.position.set(0, 0.5, 0);
    scene.add(spirits.risaaGroup);

    // Dedicated Awakening Sequence Apparition of Regina on open-sky Zone H balcony
    const wakeupSpirit = buildSpiritFigures(matPalette, reginaFaceTex).reginaGroup;
    wakeupSpirit.position.set(-0.36, 0, 19.75);
    wakeupSpirit.rotation.y = 0.45;
    wakeupSpirit.visible = false;
    scene.add(wakeupSpirit);

    // Dedicated Ending Sequence Apparition of Regina at the North Escape Hatch threshold
    const endingRig = buildSpiritFigures(matPalette, reginaFaceTex, reginaSmileFaceTex);
    const endingSpirit = endingRig.reginaGroup;
    endingSpirit.position.set(0.45, 0, -9.6);
    endingSpirit.rotation.y = Math.PI - 0.08;
    endingSpirit.visible = false;
    scene.add(endingSpirit);

    placeProp(buildProphecyStele(matPalette, steleTex), -3.6, -6.2, 0.45, 0.9);
    placeProp(buildHistoryBookshelf(matPalette), 3.6, -6.2, -0.45, 1.1);
    placeProp(buildLoreDesk(matPalette, 'war_chronicle_desk', matPalette.goldGlow), -3.6, 6.2, 2.6, 1.0);
    placeProp(buildMythGlobe(matPalette), 3.6, 6.2, -2.6, 0.9);
    placeProp(buildStonePillar(matPalette, 'evolution_pillar', matPalette.emeraldGlow), 0, -4.8, 0, 0.85);
    placeProp(buildStonePillar(matPalette, 'final_monument', matPalette.goldGlow), 2.6, -7.2, -0.3, 0.8);

    const westGate = buildSlidingGate(matPalette, 'west_gate');
    westGate.group.position.set(-7.5, 0, 0);
    westGate.group.rotation.y = Math.PI / 2;
    scene.add(westGate.group);
    interactableObjects.push(westGate.group);

    const eastGate = buildSlidingGate(matPalette, 'east_gate');
    eastGate.group.position.set(7.5, 0, 0);
    eastGate.group.rotation.y = -Math.PI / 2;
    scene.add(eastGate.group);
    interactableObjects.push(eastGate.group);

    const escapeHatch = buildEscapeHatch(matPalette);
    escapeHatch.group.position.set(0, 0, -8.5);
    scene.add(escapeHatch.group);
    interactableObjects.push(escapeHatch.group);

    // --- Zone C (West Inner Conservatory: Chapters 3 & 4) ---
    placeProp(buildAppleTreeTerrarium(matPalette), -12.6, 4.8, 0, 1.2);
    placeProp(buildFriendTable(matPalette), -16.2, 4.0, 0, 1.0);
    placeProp(buildAppleBasketPlate(matPalette), -16.2, 7.4, 0, 0.8);
    placeProp(buildFlowerPot(matPalette), -9.2, 7.8, 0, 0.75);

    const greenhouseLock = buildGreenhouseLockbox(matPalette);
    placeProp(greenhouseLock.group, -9.2, 3.4, 0, 0.85);

    placeProp(buildChalkboardDesk(matPalette, chalkboardTex), -15.6, -3.4, Math.PI / 2, 1.15);
    placeProp(buildApprenticeBed(matPalette), -14.0, -7.2, 0.2, 1.25);
    placeProp(buildLoreDesk(matPalette, 'age_ledger', matPalette.cyanGlow), -9.6, -4.6, -0.4, 1.0);

    const demonGate = buildSlidingGate(matPalette, 'demon_gate');
    demonGate.group.position.set(-18.5, 0, 0);
    demonGate.group.rotation.y = Math.PI / 2;
    scene.add(demonGate.group);
    interactableObjects.push(demonGate.group);

    // --- Zone F & Zone I (Far-West Demon Sanctum + Starlit Observatory: Chapter 3) ---
    placeProp(buildPlaqueBoard(matPalette, 'village_rumor_board', rumorBoardTex), -20.4, 6.4, Math.PI, 1.0);
    placeProp(buildTwilightMirror(matPalette), -27.6, 6.8, Math.PI - 0.35, 0.9);
    placeProp(buildDemonLordThrone(matPalette), -24.0, 7.2, Math.PI, 1.1);
    placeProp(buildStonePillar(matPalette, 'demon_seal_pedestal', matPalette.crimsonApple), -24.0, 3.4, Math.PI, 0.85);
    const ch5OraclePillar = buildStonePillar(matPalette, 'ch5_oracle_stele', matPalette.cyanGlow);
    placeProp(ch5OraclePillar, -24.0, -5.8, 0, 0.85);

    placeProp(buildStonePillar(matPalette, 'twitter_census_pillar', matPalette.cyanGlow), -33.5, -5.8, 0.35, 0.85);
    placeProp(buildLoreDesk(matPalette, 'star_observatory_desk', matPalette.goldGlow), -37.8, -4.6, Math.PI / 2, 1.0);

    const vault = buildRelicVault(matPalette);
    placeProp(vault.group, -36.5, 4.8, Math.PI, 1.0);

    // --- Zone D (East Inner Propulsion Bay: Chapter 4) ---
    placeProp(buildChinchinSamurai(matPalette, samuraiPlaqueTex), 11.6, -6.4, -0.35, 1.0);
    placeProp(buildDeterminationWindow(matPalette, portholeSkyTex), 16.4, -4.4, -Math.PI / 2, 0.95);
    placeProp(buildScrollPedestal(matPalette, 'tsukkomi_scroll', matPalette.goldGlow), 11.6, 6.4, Math.PI, 0.85);

    const valveConsole = buildPropulsionConsole(matPalette);
    placeProp(valveConsole.group, 15.4, 4.2, -Math.PI / 2, 1.2);

    const hangarGate = buildSlidingGate(matPalette, 'hangar_gate');
    hangarGate.group.position.set(18.5, 0, 0);
    hangarGate.group.rotation.y = -Math.PI / 2;
    scene.add(hangarGate.group);
    interactableObjects.push(hangarGate.group);

    // --- Zone G & Zone J (Far-East Hangar + Abyssal Turbine Dock: Chapter 4) ---
    placeProp(buildLoreDesk(matPalette, 'dark_monitor_shrine', matPalette.crimsonApple), 20.6, -6.4, -0.35, 1.0);
    placeProp(buildScrollPedestal(matPalette, 'warm_breeze_duct', matPalette.cyanGlow), 27.4, -6.4, -0.4, 0.85);
    placeProp(buildCompassCalibrator(matPalette), 24.0, -4.2, 0, 0.95);

    placeProp(buildPlaqueBoard(matPalette, 'submarina_blueprint', blueprintTex), 33.5, 4.6, Math.PI + 0.35, 1.0);
    placeProp(buildReactorCore(matPalette), 38.0, -4.6, -Math.PI / 2, 1.0);

    const submarinaDock = buildSubmarinaDock(matPalette);
    placeProp(submarinaDock.group, 36.8, 5.2, Math.PI, 1.1);

    // Pooled InstancedMesh floating golden dust motes strictly inside interior airship halls
    const PARTICLE_COUNT = 120;
    const moteGeo = new THREE.OctahedronGeometry(0.03, 0);
    const moteMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const motes = new THREE.InstancedMesh(moteGeo, moteMat, PARTICLE_COUNT);
    motes.frustumCulled = false;
    const moteSeeds = new Float32Array(PARTICLE_COUNT * 4);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const inWing = i % 5 !== 0;
      moteSeeds[i * 4 + 0] = inWing ? (Math.random() - 0.5) * 76 : (Math.random() - 0.5) * 12;
      moteSeeds[i * 4 + 1] = 0.6 + Math.random() * 2.8;
      moteSeeds[i * 4 + 2] = inWing ? (Math.random() - 0.5) * 16 : 8.8 + Math.random() * 6.8;
      moteSeeds[i * 4 + 3] = Math.random() * Math.PI * 2;
    }
    scene.add(motes);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Input Tracking (supports simultaneous mobile joystick + multi-touch look drag)
    const keysDown = new Set<string>();
    const raycaster = new THREE.Raycaster();
    let lastHoveredId: string | null = null;
    let activeDragPointerId: number | null = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragMoved = 0;

    const findInteractId = (obj: THREE.Object3D | null): string | null => {
      let cur: THREE.Object3D | null = obj;
      while (cur) {
        if (typeof cur.userData?.interactId === 'string') {
          return cur.userData.interactId;
        }
        cur = cur.parent;
      }
      return null;
    };

    const pickAtNdc = (nx: number, ny: number): string | null => {
      _pointerNdc.set(nx, ny);
      raycaster.setFromCamera(_pointerNdc, camera);
      raycaster.far = 6.2;
      const hits = raycaster.intersectObjects(interactableObjects, true);
      if (hits.length > 0) {
        return findInteractId(hits[0].object);
      }
      const pose = playerPoseRef.current;
      _rayOrigin.set(pose.x, PLAYER_EYE_HEIGHT, pose.z);
      camera.getWorldDirection(_rayDir);
      let bestId: string | null = null;
      let bestDot = 0.85;
      for (const a of INTERACTABLE_ANCHORS) {
        const dx = a.x - pose.x;
        const dy = a.y - PLAYER_EYE_HEIGHT;
        const dz = a.z - pose.z;
        const dist = Math.hypot(dx, dy, dz);
        if (dist <= 3.7) {
          const dot = (dx * _rayDir.x + dy * _rayDir.y + dz * _rayDir.z) / Math.max(0.001, dist);
          if (dot > bestDot) {
            bestDot = dot;
            bestId = a.id;
          }
        }
      }
      return bestId;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.phase !== 'playing') return;
      if (dialogueOpenRef.current || stateRef.current.activeModal !== 'none') return;
      keysDown.add(e.code);

      if (e.code === 'KeyF' || e.code === 'KeyE') {
        const target = pickAtNdc(0, 0);
        if (target) {
          e.preventDefault();
          callbacksRef.current.onInteract(target);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysDown.delete(e.code);
    };

    const clearInputs = () => {
      keysDown.clear();
      activeDragPointerId = null;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (stateRef.current.phase !== 'playing') return;
      if (dialogueOpenRef.current || stateRef.current.activeModal !== 'none') return;
      if (activeDragPointerId !== null) return;
      activeDragPointerId = e.pointerId;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragMoved = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activeDragPointerId !== e.pointerId) return;
      if (stateRef.current.phase !== 'playing') return;
      if (dialogueOpenRef.current || stateRef.current.activeModal !== 'none') return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragMoved += Math.hypot(dx, dy);
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      playerPoseRef.current.yaw -= dx * 0.0046;
      playerPoseRef.current.pitch = THREE.MathUtils.clamp(
        playerPoseRef.current.pitch - dy * 0.0038,
        -0.75,
        0.75,
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      if (activeDragPointerId !== e.pointerId) return;
      activeDragPointerId = null;
      if (stateRef.current.phase !== 'playing') return;
      if (dialogueOpenRef.current || stateRef.current.activeModal !== 'none') return;

      if (dragMoved < 10) {
        const rect = renderer.domElement.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const clickedId = pickAtNdc(nx, ny) ?? pickAtNdc(0, 0);
        if (clickedId) {
          callbacksRef.current.onInteract(clickedId);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearInputs);
    document.addEventListener('visibilitychange', clearInputs);

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(container);

    let frameId = 0;
    let disposed = false;
    let lastTimeMs = performance.now();
    let elapsed = 0;
    let boundarySlide = 0;
    let westSlide = 0;
    let demonSlide = 0;
    let eastSlide = 0;
    let hangarSlide = 0;
    let hatchSlide = 0;
    let victoryBlend = 0;
    let wakeupCamY = 0.52;
    let wakeupCamPitch = 0.72;
    let wasEnding = false;
    let endingCamX = 0;
    let endingCamY = PLAYER_EYE_HEIGHT;
    let endingCamZ = -12.6;
    let endingCamYaw = 0;
    let endingCamPitch = 0.06;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const nowMs = performance.now();
      const rawDt = Math.max(0, (nowMs - lastTimeMs) / 1000);
      lastTimeMs = nowMs;
      const dt = Math.min(rawDt, 0.05);
      elapsed += dt;

      const st = stateRef.current;
      const modalOrDialogue = dialogueOpenRef.current || st.activeModal !== 'none';

      // Artifact animations
      altar.flyjetHolder.visible = !st.altarFused;
      altar.catHolder.visible = st.altarFused;
      altar.flyjetHolder.rotation.y = elapsed * 0.7;
      altar.flyjetHolder.position.y = 1.72 + Math.sin(elapsed * 2.1) * 0.07;
      altar.catHolder.rotation.y = elapsed * 0.55;
      altar.catHolder.position.y = 1.32 + Math.sin(elapsed * 1.8) * 0.05;

      greenhouseLock.crystal.visible = !st.hasAppleMemory;
      greenhouseLock.crystal.rotation.y = elapsed * 1.3;

      vault.keyGroup.visible = !st.hasSkyKey;
      vault.glassDome.visible = !st.vaultUnlocked;
      vault.keyGroup.rotation.y = elapsed * 1.1;

      submarinaDock.subGroup.visible = !st.hasSubmarina;
      submarinaDock.shieldMesh.visible = !st.reactorUnlocked;
      submarinaDock.subGroup.rotation.y = -elapsed * 0.6;

      const ch5OracleCrest = ch5OraclePillar.children[3];
      if (ch5OracleCrest) {
        const oracleUnlocked = st.chapter >= 5;
        ch5OracleCrest.scale.setScalar(oracleUnlocked ? 1.05 + Math.sin(elapsed * 2.4) * 0.08 : 0.55);
        ch5OracleCrest.position.y = oracleUnlocked ? 1.96 + Math.sin(elapsed * 2.0) * 0.06 : 1.82;
        ch5OracleCrest.rotation.y = oracleUnlocked ? elapsed * 1.1 : 0;
      }

      for (let i = 0; i < 4; i++) {
        const targetAngle = (st.valveLevels[i] / 8) * Math.PI * 2;
        valveConsole.wheels[i].rotation.z = THREE.MathUtils.damp(
          valveConsole.wheels[i].rotation.z,
          targetAngle,
          8,
          dt,
        );
      }

      spirits.reginaGroup.visible = st.altarFused && st.phase !== 'ending';
      spirits.risaaGroup.visible = st.altarFused && st.phase !== 'ending';
      spirits.risaaGroup.rotation.y = elapsed * 0.8;
      spirits.risaaGroup.position.y = 0.5 + Math.sin(elapsed * 1.5) * 0.1;

      // Animate all 6 chapter bulkhead gates
      boundarySlide = updateGateVisual(boundaryDoor, boundarySlide, st.boundaryOpen, dt);
      westSlide = updateGateVisual(westGate, westSlide, st.westGateOpen, dt);
      demonSlide = updateGateVisual(demonGate, demonSlide, st.demonGateOpen, dt);
      eastSlide = updateGateVisual(eastGate, eastSlide, st.eastGateOpen, dt);
      hangarSlide = updateGateVisual(hangarGate, hangarSlide, st.hangarGateOpen, dt);
      hatchSlide = updateGateVisual(escapeHatch, hatchSlide, st.hatchOpen, dt);

      cloudGroup.position.x = Math.sin(elapsed * 0.08) * 2.5;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const bx = moteSeeds[i * 4 + 0];
        const by = moteSeeds[i * 4 + 1];
        const bz = moteSeeds[i * 4 + 2];
        const phase = moteSeeds[i * 4 + 3];
        _dummy.position.set(
          bx + Math.sin(elapsed * 0.4 + phase) * 0.25,
          by + Math.cos(elapsed * 0.6 + phase) * 0.18,
          bz + Math.sin(elapsed * 0.35 + phase) * 0.2,
        );
        _dummy.rotation.set(elapsed + phase, elapsed * 0.7, 0);
        _dummy.scale.setScalar(st.altarFused ? 1.45 : 1.0);
        _dummy.updateMatrix();
        motes.setMatrixAt(i, _dummy.matrix);
      }
      motes.instanceMatrix.needsUpdate = true;

      if (st.phase === 'title') {
        wakeupSpirit.visible = false;
        endingSpirit.visible = false;
        endingRig.setSmiling(false);
        wasEnding = false;
        wakeupCamY = 0.82;
        wakeupCamPitch = 0.35;
        const angle = elapsed * 0.2;
        camera.position.set(Math.sin(angle) * 5.0, 1.9 + Math.sin(elapsed * 0.35) * 0.12, Math.cos(angle) * 5.0);
        camera.lookAt(0, 1.55, 0);
      } else if (st.phase === 'wakeup') {
        endingSpirit.visible = false;
        endingRig.setSmiling(false);
        wasEnding = false;
        const showGirl = st.wakeupStep === 1 || st.wakeupStep === 2;
        wakeupSpirit.visible = showGirl;
        wakeupSpirit.position.y = 0;
        const animDt = Math.min(rawDt, 0.25);
        const targetYaw = st.wakeupStep === 2 ? Math.PI - 0.14 : 0.45;
        wakeupSpirit.rotation.y = THREE.MathUtils.damp(wakeupSpirit.rotation.y, targetYaw, 8.0, animDt);

        if (st.wakeupStep < 3) {
          const targetY = st.wakeupStep === 0 ? 0.85 : st.wakeupStep === 1 ? 1.24 : 1.32;
          const targetPitch = st.wakeupStep === 0 ? 0.42 : st.wakeupStep === 1 ? 0.10 : 0.04;
          wakeupCamY = THREE.MathUtils.damp(wakeupCamY, targetY, 6.0, animDt);
          wakeupCamPitch = THREE.MathUtils.damp(wakeupCamPitch, targetPitch, 6.0, animDt);

          camera.position.set(0, wakeupCamY, 18.45);
          camera.rotation.order = 'YXZ';
          camera.rotation.y = Math.PI; // Looking South across open-sky balcony into blue sky
          camera.rotation.x = wakeupCamPitch;
          camera.rotation.z = 0;
        } else {
          // Step 3: Girl vanishes -> awake inside South Awakening Deck facing Boundary Door
          camera.position.set(PLAYER_SPAWN.x, PLAYER_EYE_HEIGHT, PLAYER_SPAWN.z);
          camera.rotation.order = 'YXZ';
          camera.rotation.y = PLAYER_SPAWN.yaw;
          camera.rotation.x = -0.04;
          camera.rotation.z = 0;
        }
      } else if (st.phase === 'ending') {
        wakeupSpirit.visible = false;
        endingSpirit.visible = true;
        endingSpirit.position.y = Math.sin(elapsed * 1.4) * 0.012;
        endingRig.setSmiling(st.endingStep >= 2);
        const animDt = Math.min(rawDt, 0.25);

        if (!wasEnding) {
          wasEnding = true;
          endingCamX = 0;
          endingCamY = PLAYER_EYE_HEIGHT;
          endingCamZ = -12.6;
          endingCamYaw = 0;
          endingCamPitch = 0.06;
        }

        const targetX = st.endingStep === 0 ? 0 : st.endingStep === 1 ? 0.24 : 0.36;
        const targetY = st.endingStep === 0 ? PLAYER_EYE_HEIGHT : st.endingStep === 1 ? 1.48 : 1.36;
        const targetZ = st.endingStep === 0 ? -12.6 : st.endingStep === 1 ? -12.1 : -11.35;
        const targetYaw = st.endingStep === 0 ? 0 : st.endingStep === 1 ? Math.PI - 0.05 : Math.PI - 0.08;
        const targetPitch = st.endingStep === 0 ? 0.06 : st.endingStep === 1 ? -0.05 : -0.06;

        endingCamX = THREE.MathUtils.damp(endingCamX, targetX, 6.5, animDt);
        endingCamY = THREE.MathUtils.damp(endingCamY, targetY, 6.5, animDt);
        endingCamZ = THREE.MathUtils.damp(endingCamZ, targetZ, 6.5, animDt);
        endingCamYaw = THREE.MathUtils.damp(endingCamYaw, targetYaw, 5.8, animDt);
        endingCamPitch = THREE.MathUtils.damp(endingCamPitch, targetPitch, 6.0, animDt);

        camera.position.set(endingCamX, endingCamY, endingCamZ);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = endingCamYaw;
        camera.rotation.x = endingCamPitch;
        camera.rotation.z = 0;
      } else if (st.phase === 'gameover' && st.outcome === 'victory') {
        wakeupSpirit.visible = false;
        endingSpirit.visible = false;
        endingRig.setSmiling(false);
        wasEnding = false;
        victoryBlend = THREE.MathUtils.damp(victoryBlend, 1, 1.8, dt);
        camera.position.set(
          THREE.MathUtils.lerp(camera.position.x, 0, victoryBlend * 0.12),
          THREE.MathUtils.lerp(camera.position.y, 1.85, victoryBlend * 0.12),
          THREE.MathUtils.lerp(camera.position.z, -18.5, victoryBlend * 0.12),
        );
        camera.lookAt(0, 10.5, -36);
      } else if (st.phase === 'playing') {
        wakeupSpirit.visible = false;
        endingSpirit.visible = false;
        endingRig.setSmiling(false);
        wasEnding = false;
        victoryBlend = 0;
        const pose = playerPoseRef.current;

        if (!modalOrDialogue) {
          const turnSpeed = 2.4;
          if (keysDown.has('ArrowLeft') || keysDown.has('KeyQ')) pose.yaw += turnSpeed * dt;
          if (keysDown.has('ArrowRight')) pose.yaw -= turnSpeed * dt;

          let moveFwd = mobileMoveRef.current.fwd;
          let moveSide = mobileMoveRef.current.side;
          if (keysDown.has('KeyW') || keysDown.has('ArrowUp')) moveFwd += 1;
          if (keysDown.has('KeyS') || keysDown.has('ArrowDown')) moveFwd -= 1;
          if (keysDown.has('KeyA')) moveSide -= 1;
          if (keysDown.has('KeyD')) moveSide += 1;

          const mag = Math.hypot(moveFwd, moveSide);
          if (mag > 0.05) {
            const clampedScale = mag > 1 ? 1 / mag : 1;
            const nf = moveFwd * clampedScale;
            const ns = moveSide * clampedScale;
            const speed = 5.4 * dt;

            _forward.set(-Math.sin(pose.yaw), 0, -Math.cos(pose.yaw));
            _right.set(Math.cos(pose.yaw), 0, -Math.sin(pose.yaw));

            const dx = (_forward.x * nf + _right.x * ns) * speed;
            const dz = (_forward.z * nf + _right.z * ns) * speed;

            const colliders = buildWorldColliders({
              boundaryOpen: st.boundaryOpen,
              westGateOpen: st.westGateOpen,
              demonGateOpen: st.demonGateOpen,
              eastGateOpen: st.eastGateOpen,
              hangarGateOpen: st.hangarGateOpen,
              hatchOpen: st.hatchOpen,
            });
            const resolved = resolvePlayerMovement(pose.x, pose.z, dx, dz, PLAYER_RADIUS, colliders);
            const movedDist = Math.hypot(resolved.x - pose.x, resolved.z - pose.z);
            pose.x = resolved.x;
            pose.z = resolved.z;
            pose.walkDist += movedDist;

            if (pose.walkDist - pose.lastStepDist >= 1.05) {
              pose.lastStepDist = pose.walkDist;
              callbacksRef.current.onStepDistance(pose.z < -8.7 ? 'grass' : 'wood');
            }
          }

          if (st.hatchOpen && pose.z < -9.8) {
            callbacksRef.current.onAutoEscapeTrigger();
          }
        }

        const bobY = Math.sin(pose.walkDist * 4.2) * 0.035;
        camera.position.set(pose.x, PLAYER_EYE_HEIGHT + bobY, pose.z);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = pose.yaw;
        camera.rotation.x = pose.pitch;
        camera.rotation.z = 0;
        camera.updateMatrixWorld();

        const hovered = modalOrDialogue ? null : pickAtNdc(0, 0);
        if (hovered !== lastHoveredId) {
          lastHoveredId = hovered;
          callbacksRef.current.onHoverChange(hovered);
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObs.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearInputs);
      document.removeEventListener('visibilitychange', clearInputs);
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      renderer.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, [mobileMoveRef]);

  return <div ref={mountRef} className="fixed inset-0 w-full h-full touch-none" />;
}
