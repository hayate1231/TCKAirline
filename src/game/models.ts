import * as THREE from 'three';

export interface MaterialPalette {
  brass: THREE.MeshStandardMaterial;
  darkBrass: THREE.MeshStandardMaterial;
  ivoryCeramic: THREE.MeshStandardMaterial;
  slateStone: THREE.MeshStandardMaterial;
  obsidian: THREE.MeshStandardMaterial;
  cyanGlow: THREE.MeshStandardMaterial;
  goldGlow: THREE.MeshStandardMaterial;
  emeraldGlow: THREE.MeshStandardMaterial;
  aquamarine: THREE.MeshStandardMaterial;
  crimsonApple: THREE.MeshStandardMaterial;
  woodTrunk: THREE.MeshStandardMaterial;
  foliageGreen: THREE.MeshStandardMaterial;
  glassPanel: THREE.MeshPhysicalMaterial;
  samuraiArmor: THREE.MeshStandardMaterial;
}

export function createMaterialPalette(isSoftwareGl: boolean): MaterialPalette {
  return {
    brass: new THREE.MeshStandardMaterial({
      color: 0xd4a64a,
      metalness: 0.85,
      roughness: 0.24,
    }),
    darkBrass: new THREE.MeshStandardMaterial({
      color: 0x6f5327,
      metalness: 0.78,
      roughness: 0.38,
    }),
    ivoryCeramic: new THREE.MeshStandardMaterial({
      color: 0xf4efe4,
      metalness: 0.08,
      roughness: 0.36,
    }),
    slateStone: new THREE.MeshStandardMaterial({
      color: 0x3b4456,
      metalness: 0.12,
      roughness: 0.78,
    }),
    obsidian: new THREE.MeshStandardMaterial({
      color: 0x1a202c,
      metalness: 0.25,
      roughness: 0.62,
    }),
    cyanGlow: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.1,
    }),
    goldGlow: new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.2,
      roughness: 0.25,
      metalness: 0.3,
    }),
    emeraldGlow: new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 1.2,
      roughness: 0.25,
      metalness: 0.15,
    }),
    aquamarine: new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      metalness: 0.55,
      roughness: 0.22,
    }),
    crimsonApple: new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.08,
      roughness: 0.18,
    }),
    woodTrunk: new THREE.MeshStandardMaterial({
      color: 0x5b3b24,
      metalness: 0.05,
      roughness: 0.88,
    }),
    foliageGreen: new THREE.MeshStandardMaterial({
      color: 0x2f855a,
      metalness: 0.02,
      roughness: 0.82,
    }),
    glassPanel: new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      metalness: 0.05,
      roughness: 0.08,
      transparent: true,
      opacity: isSoftwareGl ? 0.34 : 0.42,
      depthWrite: false,
      clearcoat: 1.0,
    }),
    samuraiArmor: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.68,
      roughness: 0.32,
    }),
  };
}

export function tagInteractable(group: THREE.Object3D, interactId: string): void {
  group.traverse((child) => {
    child.userData.interactId = interactId;
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

/**
 * Composite 7-part "Flyjet Chi-Kubi" sculpted ancient aircraft relic.
 */
export function buildFlyjetChikubi(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Lathed ceramic aerodynamic fuselage dome
  const lathePoints = [
    new THREE.Vector2(0.01, -0.35),
    new THREE.Vector2(0.24, -0.25),
    new THREE.Vector2(0.32, 0.0),
    new THREE.Vector2(0.26, 0.22),
    new THREE.Vector2(0.11, 0.36),
    new THREE.Vector2(0.06, 0.45),
    new THREE.Vector2(0.0, 0.48),
  ];
  const hullGeo = new THREE.LatheGeometry(lathePoints, 24);
  hullGeo.rotateX(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, mat.ivoryCeramic);
  group.add(hull);

  // Brass mid-ring collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.035, 10, 24), mat.brass);
  group.add(collar);

  // Glowing cyan tip crest
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), mat.cyanGlow);
  tip.position.set(0, 0, 0.47);
  group.add(tip);

  // Swept delta wings (ExtrudeGeometry)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0.22, 0.12);
  wingShape.lineTo(0.88, -0.18);
  wingShape.lineTo(0.84, -0.32);
  wingShape.lineTo(0.2, -0.24);
  wingShape.closePath();

  const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  wingGeo.rotateX(Math.PI / 2);

  const rightWing = new THREE.Mesh(wingGeo, mat.brass);
  rightWing.position.set(0, 0.02, 0);
  group.add(rightWing);

  const leftWing = rightWing.clone();
  leftWing.scale.x = -1;
  group.add(leftWing);

  // Twin side thrusters
  for (const side of [-1, 1]) {
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.32, 14), mat.darkBrass);
    pod.rotation.x = Math.PI / 2;
    pod.position.set(side * 0.46, -0.04, -0.12);
    group.add(pod);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 12), mat.cyanGlow);
    flame.rotation.x = -Math.PI / 2;
    flame.position.set(side * 0.46, -0.04, -0.33);
    group.add(flame);
  }

  // Vertical dorsal tail fin
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0.14);
  finShape.lineTo(-0.28, 0.46);
  finShape.lineTo(-0.36, 0.44);
  finShape.lineTo(-0.24, 0.1);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 1,
  });
  finGeo.rotateY(Math.PI / 2);
  const fin = new THREE.Mesh(finGeo, mat.brass);
  fin.position.set(-0.015, 0.05, -0.05);
  group.add(fin);

  return group;
}

/**
 * Composite 7-part "Chinpo Submarina" ancient brass & aquamarine submarine relic.
 */
export function buildSubmarinaModel(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  const pts = [
    new THREE.Vector2(0.0, -0.48),
    new THREE.Vector2(0.11, -0.35),
    new THREE.Vector2(0.21, -0.08),
    new THREE.Vector2(0.22, 0.2),
    new THREE.Vector2(0.16, 0.38),
    new THREE.Vector2(0.08, 0.48),
    new THREE.Vector2(0.0, 0.52),
  ];
  const hullGeo = new THREE.LatheGeometry(pts, 22);
  hullGeo.rotateX(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, mat.aquamarine);
  group.add(hull);

  // Brass ribs
  for (const zOff of [-0.18, 0.16]) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.215, 0.024, 10, 20), mat.brass);
    rib.position.z = zOff;
    group.add(rib);
  }

  // Conning tower & periscope
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.2, 16), mat.brass);
  tower.position.set(0, 0.24, 0.04);
  group.add(tower);

  const periscope = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 10), mat.darkBrass);
  periscope.position.set(0, 0.4, 0.04);
  group.add(periscope);

  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 10), mat.goldGlow);
  lens.position.set(0, 0.49, 0.07);
  group.add(lens);

  // Tail fins + 4-blade propeller
  const finH = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.14), mat.brass);
  finH.position.set(0, 0, -0.38);
  group.add(finH);

  const finV = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.36, 0.14), mat.brass);
  finV.position.set(0, 0, -0.38);
  group.add(finV);

  const propHub = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), mat.goldGlow);
  propHub.position.set(0, 0, -0.5);
  group.add(propHub);

  return group;
}

/**
 * Composite 8-part Fused Golden-Cyan "Cat" Core silhouette.
 */
export function buildCatCoreModel(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Seated cat torso (LatheGeometry)
  const bodyPts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.28, 0.03),
    new THREE.Vector2(0.32, 0.25),
    new THREE.Vector2(0.24, 0.52),
    new THREE.Vector2(0.16, 0.65),
    new THREE.Vector2(0.0, 0.68),
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(bodyPts, 20), mat.goldGlow);
  group.add(body);

  // Cat head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 16), mat.goldGlow);
  head.position.set(0, 0.78, 0.04);
  group.add(head);

  // Pointed cat ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 8), mat.brass);
    ear.position.set(side * 0.14, 0.99, 0.03);
    ear.rotation.z = -side * 0.24;
    group.add(ear);

    // Luminous cyan eyes
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), mat.cyanGlow);
    eye.position.set(side * 0.085, 0.81, 0.22);
    group.add(eye);
  }

  // Curved TubeGeometry tail
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.14, -0.24),
    new THREE.Vector3(0.24, 0.28, -0.4),
    new THREE.Vector3(0.34, 0.62, -0.32),
    new THREE.Vector3(0.2, 0.82, -0.18),
  ]);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 18, 0.042, 8, false), mat.brass);
  group.add(tail);

  // Halo ring
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.025, 10, 32), mat.cyanGlow);
  halo.position.set(0, 0.55, 0);
  halo.rotation.x = Math.PI / 3;
  group.add(halo);

  return group;
}

/**
 * Central Altar Pedestal housing Flyjet Chi-Kubi and post-fusion Cat Core.
 */
export function buildCentralAltar(mat: MaterialPalette): {
  group: THREE.Group;
  flyjetHolder: THREE.Group;
  catHolder: THREE.Group;
  ringMesh: THREE.Mesh;
} {
  const group = new THREE.Group();

  // 3-tier octagonal stepped stone & brass base (bottom-center y = 0)
  const step1 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.25, 0.2, 8), mat.slateStone);
  step1.position.y = 0.1;
  group.add(step1);

  const step2 = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.94, 0.25, 8), mat.obsidian);
  step2.position.y = 0.325;
  group.add(step2);

  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.62, 0.72, 8), mat.slateStone);
  pillar.position.y = 0.81;
  group.add(pillar);

  const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.055, 10, 24), mat.brass);
  topRing.rotation.x = Math.PI / 2;
  topRing.position.y = 1.18;
  group.add(topRing);

  const energyDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 24), mat.cyanGlow);
  energyDisc.position.y = 1.18;
  group.add(energyDisc);

  const flyjetHolder = new THREE.Group();
  flyjetHolder.position.y = 1.72;
  const flyjet = buildFlyjetChikubi(mat);
  flyjetHolder.add(flyjet);
  group.add(flyjetHolder);

  const catHolder = new THREE.Group();
  catHolder.position.y = 1.32;
  catHolder.visible = false;
  const catCore = buildCatCoreModel(mat);
  catHolder.add(catCore);
  group.add(catHolder);

  tagInteractable(group, 'altar');
  return { group, flyjetHolder, catHolder, ringMesh: energyDisc };
}

/**
 * Composite 9-part Eternal Apple Tree Terrarium (West Wing).
 */
export function buildAppleTreeTerrarium(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Brass octagonal planter base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.0, 0.48, 8), mat.darkBrass);
  base.position.y = 0.24;
  group.add(base);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.05, 10, 8), mat.brass);
  rim.rotation.x = Math.PI / 2;
  rim.rotation.z = Math.PI / 8;
  rim.position.y = 0.48;
  group.add(rim);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.08, 16), mat.woodTrunk);
  soil.position.y = 0.47;
  group.add(soil);

  // Gnarled trunk + 2 main branches
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 1.05, 10), mat.woodTrunk);
  trunk.position.y = 0.98;
  group.add(trunk);

  const branchL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.65, 8), mat.woodTrunk);
  branchL.position.set(-0.24, 1.52, 0.08);
  branchL.rotation.z = 0.55;
  group.add(branchL);

  const branchR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.65, 8), mat.woodTrunk);
  branchR.position.set(0.24, 1.56, -0.08);
  branchR.rotation.z = -0.52;
  group.add(branchR);

  // Multi-cluster foliage canopy
  const canopyOffsets: [number, number, number, number][] = [
    [0, 1.98, 0, 0.56],
    [-0.4, 1.8, 0.18, 0.42],
    [0.42, 1.84, -0.12, 0.44],
    [0.05, 1.82, 0.36, 0.38],
    [-0.1, 1.84, -0.35, 0.4],
  ];
  for (const [cx, cy, cz, r] of canopyOffsets) {
    const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), mat.foliageGreen);
    leaf.position.set(cx, cy, cz);
    group.add(leaf);
  }

  // 5 glossy crimson apples
  const appleOffsets: [number, number, number][] = [
    [-0.45, 1.62, 0.35],
    [0.46, 1.68, 0.26],
    [0.12, 1.72, 0.54],
    [-0.22, 1.78, -0.44],
    [0.24, 2.08, 0.18],
  ];
  for (const [ax, ay, az] of appleOffsets) {
    const apple = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), mat.crimsonApple);
    apple.position.set(ax, ay, az);
    group.add(apple);
  }

  tagInteractable(group, 'apple_tree');
  return group;
}

/**
 * Composite 6-part Chalkboard & Apprentice Desk (West Wing).
 */
export function buildChalkboardDesk(
  mat: MaterialPalette,
  chalkboardTexture: THREE.CanvasTexture,
): THREE.Group {
  const group = new THREE.Group();

  // Desk legs + tabletop
  for (const lx of [-0.7, 0.7]) {
    for (const lz of [-0.32, 0.32]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.78, 8), mat.darkBrass);
      leg.position.set(lx, 0.39, lz);
      group.add(leg);
    }
  }
  const tabletop = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.9), mat.woodTrunk);
  toptable(tabletop, 0.8);
  group.add(tabletop);

  // Open research journal on desk
  const journal = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.3), mat.ivoryCeramic);
  journal.position.set(-0.22, 0.86, 0.14);
  journal.rotation.y = 0.22;
  group.add(journal);

  // Standing Chalkboard frame seated cleanly onto tabletop via brass brackets
  for (const bx of [-0.55, 0.55]) {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.12), mat.brass);
    bracket.position.set(bx, 0.88, -0.34);
    group.add(bracket);
  }
  const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(1.86, 1.18, 0.08), mat.darkBrass);
  boardFrame.position.set(0, 1.43, -0.34);
  group.add(boardFrame);

  const boardFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 1.06),
    new THREE.MeshStandardMaterial({
      map: chalkboardTexture,
      roughness: 0.7,
      metalness: 0.05,
    }),
  );
  boardFace.position.set(0, 0, 0.042);
  boardFrame.add(boardFace);

  tagInteractable(group, 'chalkboard');
  return group;
}

function toptable(mesh: THREE.Mesh, y: number): void {
  mesh.position.set(0, y, 0);
}

/**
 * Composite 7-part Relic Vault housing the floating Sky Key (West Wing).
 */
export function buildRelicVault(mat: MaterialPalette): {
  group: THREE.Group;
  keyGroup: THREE.Group;
  glassDome: THREE.Mesh;
} {
  const group = new THREE.Group();

  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.76, 0.95, 8), mat.slateStone);
  plinth.position.y = 0.475;
  group.add(plinth);

  const brassRim = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.045, 10, 24), mat.brass);
  brassRim.rotation.x = Math.PI / 2;
  brassRim.position.y = 0.96;
  group.add(brassRim);

  // 4 corner brass pillars for the glass case
  for (const sx of [-0.42, 0.42]) {
    for (const sz of [-0.42, 0.42]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), mat.brass);
      post.position.set(sx, 1.41, sz);
      group.add(post);
    }
  }

  // Cap roof
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.28, 8), mat.darkBrass);
  cap.position.y = 2.0;
  group.add(cap);

  // Glass enclosure
  const glassDome = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.88, 0.84), mat.glassPanel);
  glassDome.position.y = 1.4;
  glassDome.renderOrder = 2;
  group.add(glassDome);

  // Composite Sky Key floating inside
  const keyGroup = new THREE.Group();
  keyGroup.position.y = 1.4;

  const keyRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 10, 20), mat.cyanGlow);
  keyRing.position.y = 0.2;
  keyGroup.add(keyRing);

  const keyShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.36, 10), mat.brass);
  keyShaft.position.y = -0.04;
  keyGroup.add(keyShaft);

  const keyTooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 0.03), mat.cyanGlow);
  keyTooth1.position.set(0.06, -0.14, 0);
  keyGroup.add(keyTooth1);

  const keyTooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.03), mat.cyanGlow);
  keyTooth2.position.set(0.045, -0.2, 0);
  keyGroup.add(keyTooth2);

  group.add(keyGroup);
  tagInteractable(group, 'relic_vault');
  return { group, keyGroup, glassDome };
}

/**
 * Composite 4-part Prophecy Stele (Atrium NW).
 */
export function buildProphecyStele(
  mat: MaterialPalette,
  steleTexture: THREE.CanvasTexture,
): THREE.Group {
  const group = new THREE.Group();

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.24, 0.68), mat.slateStone);
  base.position.y = 0.12;
  group.add(base);

  const monolith = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.85, 0.32), mat.obsidian);
  monolith.position.y = 1.14;
  group.add(monolith);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.5, 0.22, 4), mat.brass);
  cap.rotation.y = Math.PI / 4;
  cap.position.y = 2.16;
  group.add(cap);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.76, 1.48),
    new THREE.MeshStandardMaterial({
      map: steleTexture,
      roughness: 0.45,
      metalness: 0.15,
    }),
  );
  face.position.set(0, 1.18, 0.168);
  group.add(face);

  tagInteractable(group, 'prophecy_stele');
  return group;
}

/**
 * Composite 8-part "Chinchin Samurai" Armor Display & Plaque (East Wing).
 */
export function buildChinchinSamurai(
  mat: MaterialPalette,
  plaqueTexture: THREE.CanvasTexture,
): THREE.Group {
  const group = new THREE.Group();

  // Lacquered pedestal
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.32, 1.15), mat.obsidian);
  base.position.y = 0.16;
  group.add(base);

  // Armor stand pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.4, 10), mat.woodTrunk);
  pole.position.y = 1.02;
  group.add(pole);

  // Cuirass (do)
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.56, 8), mat.samuraiArmor);
  torso.position.y = 1.24;
  group.add(torso);

  // Shoulder pauldrons (sode)
  for (const side of [-1, 1]) {
    const sode = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.34, 0.28), mat.samuraiArmor);
    sode.position.set(side * 0.32, 1.32, 0);
    sode.rotation.z = -side * 0.2;
    group.add(sode);
  }

  // Helmet (kabuto) + upward golden crescent crest (kuwagata)
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.65), mat.samuraiArmor);
  helm.position.y = 1.72;
  group.add(helm);

  const crest = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.025, 8, 18, Math.PI * 1.1), mat.brass);
  crest.position.set(0, 1.92, 0.16);
  crest.rotation.z = Math.PI * 0.95;
  group.add(crest);

  // Ceremonial katana mounted on brass racks across front
  for (const kx of [-0.2, 0.2]) {
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.14), mat.brass);
    rack.position.set(kx, 1.04, 0.25);
    group.add(rack);
  }
  const katana = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 8), mat.brass);
  katana.rotation.z = Math.PI / 2 - 0.18;
  katana.position.set(0, 1.04, 0.31);
  group.add(katana);

  // Grounded lectern post & readable plaque on front of pedestal
  const lecternPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.34, 8), mat.darkBrass);
  lecternPost.position.set(0, 0.45, 0.46);
  group.add(lecternPost);

  const plaqueBack = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.6, 0.04), mat.darkBrass);
  plaqueBack.position.set(0, 0.64, 0.56);
  plaqueBack.rotation.x = -0.35;
  group.add(plaqueBack);

  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.56),
    new THREE.MeshStandardMaterial({
      map: plaqueTexture,
      roughness: 0.4,
      metalness: 0.2,
    }),
  );
  plaque.position.set(0, 0, 0.022);
  plaqueBack.add(plaque);

  tagInteractable(group, 'chinchin_samurai');
  return group;
}

/**
 * Composite 9-part Propulsion Valve Console with 4 rotating wheel valves (East Wing).
 */
export function buildPropulsionConsole(mat: MaterialPalette): {
  group: THREE.Group;
  wheels: [THREE.Group, THREE.Group, THREE.Group, THREE.Group];
} {
  const group = new THREE.Group();

  const consoleBody = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.05, 0.72), mat.slateStone);
  consoleBody.position.y = 0.525;
  group.add(consoleBody);

  const trim = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.08, 0.78), mat.brass);
  trim.position.y = 1.06;
  group.add(trim);

  const colors = [mat.cyanGlow, mat.goldGlow, mat.emeraldGlow, mat.ivoryCeramic];
  const wheels: THREE.Group[] = [];

  for (let i = 0; i < 4; i++) {
    const xPos = (i - 1.5) * 0.48;
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.1, 12), mat.darkBrass);
    pipe.position.set(xPos, 1.55, -0.22);
    group.add(pipe);

    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(xPos, 1.24, 0.38);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.024, 8, 18), colors[i]);
    wheelGroup.add(rim);

    const spoke1 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.27, 6), mat.brass);
    wheelGroup.add(spoke1);

    const spoke2 = spoke1.clone();
    spoke2.rotation.z = Math.PI / 2;
    wheelGroup.add(spoke2);

    group.add(wheelGroup);
    wheels.push(wheelGroup);
  }

  tagInteractable(group, 'valve_console');
  return { group, wheels: wheels as [THREE.Group, THREE.Group, THREE.Group, THREE.Group] };
}

/**
 * Composite 6-part Chinpo Submarina Containment Dock (East Wing).
 */
export function buildSubmarinaDock(mat: MaterialPalette): {
  group: THREE.Group;
  subGroup: THREE.Group;
  shieldMesh: THREE.Mesh;
} {
  const group = new THREE.Group();

  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.92, 0.9, 8), mat.slateStone);
  pedestal.position.y = 0.45;
  group.add(pedestal);

  const cradle = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.045, 10, 24), mat.brass);
  cradle.rotation.x = Math.PI / 2;
  cradle.position.y = 0.92;
  group.add(cradle);

  const subGroup = buildSubmarinaModel(mat);
  subGroup.position.y = 1.38;
  group.add(subGroup);

  const shieldMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 1.15, 18),
    mat.glassPanel,
  );
  shieldMesh.position.y = 1.48;
  shieldMesh.renderOrder = 2;
  group.add(shieldMesh);

  tagInteractable(group, 'submarina_dock');
  return { group, subGroup, shieldMesh };
}

/**
 * Composite 18-part Cute Anime Golden-Haired Regina & Ri-saa Soul spirits.
 */
export function buildSpiritFigures(
  mat: MaterialPalette,
  reginaFaceTex?: THREE.CanvasTexture,
  reginaSmileTex?: THREE.CanvasTexture,
): {
  reginaGroup: THREE.Group;
  risaaGroup: THREE.Group;
  setSmiling: (smiling: boolean) => void;
} {
  // Regina (cute golden-haired anime girl with deep blue eyes & royal-blue/white dress)
  const reginaGroup = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xffdfd0,
    emissive: 0xffcdb8,
    emissiveIntensity: 0.04,
    roughness: 0.7,
    metalness: 0.0,
  });

  const blondeMat = new THREE.MeshStandardMaterial({
    color: 0xf7d05c,
    emissive: 0xd99b26,
    emissiveIntensity: 0.1,
    roughness: 0.42,
    metalness: 0.06,
  });

  const dressBlueMat = new THREE.MeshStandardMaterial({
    color: 0x1e40af,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.14,
    roughness: 0.54,
    metalness: 0.04,
  });

  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.18,
    roughness: 0.35,
  });

  const bootMat = new THREE.MeshStandardMaterial({
    color: 0x3b261d,
    roughness: 0.5,
    metalness: 0.1,
  });

  // Cute boots, white knee-high socks & slender legs standing cleanly at y = 0
  for (const side of [-1, 1]) {
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.05, 0.15, 12), bootMat);
    boot.position.set(side * 0.072, 0.075, 0.01);
    reginaGroup.add(boot);

    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.039, 0.04, 0.15, 12), mat.ivoryCeramic);
    sock.position.set(side * 0.072, 0.22, 0);
    reginaGroup.add(sock);

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.034, 0.12, 12), skinMat);
    leg.position.set(side * 0.072, 0.34, 0);
    reginaGroup.add(leg);
  }

  // Flared A-line dress skirt (LatheGeometry)
  const skirtPts = [
    new THREE.Vector2(0.32, 0.35),
    new THREE.Vector2(0.28, 0.52),
    new THREE.Vector2(0.21, 0.73),
    new THREE.Vector2(0.13, 0.92),
    new THREE.Vector2(0.11, 0.96),
  ];
  const skirt = new THREE.Mesh(new THREE.LatheGeometry(skirtPts, 28), dressBlueMat);
  reginaGroup.add(skirt);

  // Crisp white hem trim & sky-blue waist cord with a clear front bow ribbon (ribbon #3)
  const hemTrim = new THREE.Mesh(new THREE.TorusGeometry(0.315, 0.015, 8, 28), mat.ivoryCeramic);
  hemTrim.rotation.x = Math.PI / 2;
  hemTrim.position.y = 0.355;
  reginaGroup.add(hemTrim);

  const waistBelt = new THREE.Mesh(new THREE.TorusGeometry(0.128, 0.015, 8, 24), ribbonMat);
  waistBelt.rotation.x = Math.PI / 2;
  waistBelt.position.y = 0.94;
  reginaGroup.add(waistBelt);

  const waistBowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.023, 10, 8), ribbonMat);
  waistBowCenter.position.set(0, 0.94, 0.14);
  reginaGroup.add(waistBowCenter);

  for (const side of [-1, 1]) {
    const bowWing = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.078, 8), ribbonMat);
    bowWing.position.set(side * 0.04, 0.94, 0.136);
    bowWing.rotation.z = side * (Math.PI / 2);
    reginaGroup.add(bowWing);

    const beltTail = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.14, 6), ribbonMat);
    beltTail.position.set(side * 0.028, 0.865, 0.136);
    beltTail.rotation.z = side * 0.24;
    beltTail.rotation.x = Math.PI - 0.14;
    reginaGroup.add(beltTail);
  }

  // Fitted upper bodice + delicate white sailor collar & sky-blue chest bow
  const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.112, 0.29, 18), dressBlueMat);
  bodice.position.y = 1.085;
  reginaGroup.add(bodice);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.122, 0.155, 0.065, 18), mat.ivoryCeramic);
  collar.position.y = 1.205;
  reginaGroup.add(collar);

  const chestBowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), ribbonMat);
  chestBowCenter.position.set(0, 1.165, 0.132);
  reginaGroup.add(chestBowCenter);
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.072, 6), ribbonMat);
    wing.position.set(side * 0.038, 1.165, 0.128);
    wing.rotation.z = side * (Math.PI / 2);
    reginaGroup.add(wing);
  }

  // Royal-blue short puff sleeves + natural slender arms & hands
  for (const side of [-1, 1]) {
    const puffSleeve = new THREE.Mesh(new THREE.SphereGeometry(0.056, 14, 12), dressBlueMat);
    puffSleeve.position.set(side * 0.135, 1.19, 0.005);
    puffSleeve.scale.set(0.95, 1.12, 0.95);
    reginaGroup.add(puffSleeve);

    const sleeveCuff = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.01, 8, 16), mat.ivoryCeramic);
    sleeveCuff.rotation.x = Math.PI / 2;
    sleeveCuff.rotation.y = -side * 0.22;
    sleeveCuff.position.set(side * 0.155, 1.14, 0.01);
    reginaGroup.add(sleeveCuff);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.26, 12), skinMat);
    arm.position.set(side * 0.18, 1.02, 0.035);
    arm.rotation.z = side * 0.2;
    arm.rotation.x = -0.22;
    reginaGroup.add(arm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), skinMat);
    hand.position.set(side * 0.205, 0.90, 0.068);
    reginaGroup.add(hand);
  }

  // Slender neck + anime-proportioned head (face UV aligned directly toward +Z)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.046, 0.09, 12), skinMat);
  neck.position.y = 1.265;
  reginaGroup.add(neck);

  const headMat = reginaFaceTex
    ? new THREE.MeshStandardMaterial({
        map: reginaFaceTex,
        emissive: 0xffd8c4,
        emissiveIntensity: 0.04,
        roughness: 0.72,
        metalness: 0.0,
      })
    : skinMat;
  const smileHeadMat = reginaSmileTex
    ? new THREE.MeshStandardMaterial({
        map: reginaSmileTex,
        emissive: 0xffd8c4,
        emissiveIntensity: 0.05,
        roughness: 0.72,
        metalness: 0.0,
      })
    : headMat;
  const rHead = new THREE.Mesh(new THREE.SphereGeometry(0.185, 32, 24), headMat);
  rHead.position.set(0, 1.44, 0);
  rHead.rotation.y = -Math.PI / 2; // Aligns texture u=0.5 directly forward (+Z)
  rHead.scale.set(1.02, 0.97, 0.94);
  reginaGroup.add(rHead);

  // Smooth golden hair crown dome
  const hairCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.194, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.56),
    blondeMat,
  );
  hairCrown.position.set(0, 1.455, -0.015);
  hairCrown.scale.set(1.03, 0.99, 0.98);
  reginaGroup.add(hairCrown);

  // Flowing symmetrical golden back hair curtain centered around -Z (phi = PI)
  const backHairPts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.245, 0.02),
    new THREE.Vector2(0.215, 0.24),
    new THREE.Vector2(0.194, 0.48),
    new THREE.Vector2(0.184, 0.64),
  ];
  const hairBack = new THREE.Mesh(
    new THREE.LatheGeometry(backHairPts, 24, Math.PI * 0.55, Math.PI * 0.9),
    blondeMat,
  );
  hairBack.position.set(0, 0.87, -0.018);
  reginaGroup.add(hairBack);

  // Sleek tapered anime bangs wrapped radially around her spherical brow down to eyebrow level
  const bangStrands: [number, number, number, number][] = [
    // [ryAngle, yCenter, radiusW, length]
    [0.0, 1.542, 0.045, 0.142],
    [-0.34, 1.538, 0.042, 0.152],
    [0.34, 1.538, 0.042, 0.152],
    [-0.68, 1.53, 0.04, 0.166],
    [0.68, 1.53, 0.04, 0.166],
    [-1.02, 1.52, 0.037, 0.18],
    [1.02, 1.52, 0.037, 0.18],
  ];
  for (const [ry, by, rw, len] of bangStrands) {
    const rCenter = 0.158;
    const bang = new THREE.Mesh(new THREE.ConeGeometry(rw, len, 8), blondeMat);
    bang.position.set(Math.sin(ry) * rCenter, by, Math.cos(ry) * rCenter);
    bang.scale.set(1.0, 1.0, 0.3);
    bang.rotation.order = 'YXZ';
    bang.rotation.y = ry;
    bang.rotation.x = Math.PI - 0.52; // Tips sweep cleanly down to eyebrow level
    reginaGroup.add(bang);
  }

  // Tapered cheek-framing side locks hugging gently toward chin/chest
  for (const side of [-1, 1]) {
    const sideLock = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.38, 10), blondeMat);
    sideLock.position.set(side * 0.152, 1.32, 0.068);
    sideLock.scale.set(0.9, 1.0, 0.55);
    sideLock.rotation.x = Math.PI - 0.1;
    sideLock.rotation.z = -side * 0.12;
    reginaGroup.add(sideLock);
  }

  // Cute sky-blue twin-wing hair ribbon on left temple & graceful curved ahoge
  const hairRibbonCenter = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), ribbonMat);
  hairRibbonCenter.position.set(-0.158, 1.54, 0.055);
  reginaGroup.add(hairRibbonCenter);
  for (const s of [-1, 1]) {
    const rWing = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.062, 6), ribbonMat);
    rWing.position.set(-0.162 + s * 0.01, 1.54 + s * 0.024, 0.052 - s * 0.02);
    rWing.rotation.z = s * 0.9;
    rWing.rotation.y = -0.5;
    reginaGroup.add(rWing);
  }

  const ahogeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.635, -0.01),
    new THREE.Vector3(-0.015, 1.69, 0.01),
    new THREE.Vector3(0.04, 1.725, 0.025),
    new THREE.Vector3(0.085, 1.69, 0.02),
  ]);
  const ahoge = new THREE.Mesh(new THREE.TubeGeometry(ahogeCurve, 12, 0.01, 6, false), blondeMat);
  reginaGroup.add(ahoge);

  reginaGroup.visible = false;

  // Ri-saa Soul (luminous cyan hero spirit)
  const risaaGroup = new THREE.Group();
  const coreOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 1), mat.cyanGlow);
  coreOrb.position.y = 2.4;
  risaaGroup.add(coreOrb);

  const auraRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.025, 10, 28), mat.goldGlow);
  auraRing1.position.y = 2.4;
  risaaGroup.add(auraRing1);

  const auraRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.02, 10, 28), mat.cyanGlow);
  auraRing2.position.y = 2.4;
  auraRing2.rotation.x = Math.PI / 2.5;
  risaaGroup.add(auraRing2);

  risaaGroup.visible = false;

  const setSmiling = (smiling: boolean) => {
    const nextMat = smiling ? smileHeadMat : headMat;
    if (rHead.material !== nextMat) {
      rHead.material = nextMat;
    }
  };

  return { reginaGroup, risaaGroup, setSmiling };
}

/**
 * Monumental Escape Hatch with solid wall jambs and dual sliding armored doors.
 */
export function buildEscapeHatch(mat: MaterialPalette): {
  group: THREE.Group;
  leftDoor: THREE.Mesh;
  rightDoor: THREE.Mesh;
  statusBeacon: THREE.Mesh;
} {
  const group = new THREE.Group();

  // Solid left/right wall jambs & header lintel
  const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 3.6, 0.72), mat.darkBrass);
  leftJamb.position.set(-1.92, 1.8, 0);
  group.add(leftJamb);

  const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 3.6, 0.72), mat.darkBrass);
  rightJamb.position.set(1.92, 1.8, 0);
  group.add(rightJamb);

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.3, 1.0, 0.76), mat.darkBrass);
  lintel.position.set(0, 4.1, 0);
  group.add(lintel);

  for (const bz of [1, -1]) {
    const beaconHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.12, 16), mat.brass);
    beaconHousing.rotation.x = Math.PI / 2;
    beaconHousing.position.set(0, 3.88, bz * 0.36);
    group.add(beaconHousing);
  }

  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0x991b1b,
    emissiveIntensity: 0.65,
    roughness: 0.3,
    metalness: 0.1,
  });
  const statusBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 12), beaconMat);
  statusBeacon.scale.set(1, 1, 3.6);
  statusBeacon.position.set(0, 3.88, 0);
  group.add(statusBeacon);

  // Sliding armored doors (meet cleanly with zero center gap)
  const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(1.86, 3.6, 0.28), mat.slateStone);
  leftDoor.position.set(-0.92, 1.8, 0);
  group.add(leftDoor);

  const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(1.86, 3.6, 0.28), mat.slateStone);
  rightDoor.position.set(0.92, 1.8, 0);
  group.add(rightDoor);

  const seamStrip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.58, 0.32), mat.brass);
  seamStrip.position.set(0.9, 0, 0);
  leftDoor.add(seamStrip);

  // Symmetrical brass emblem rings on both faces (+Z and -Z)
  for (const dz of [0.16, -0.16]) {
    const doorTrimL = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 20), mat.brass);
    doorTrimL.position.set(0.38, 0.1, dz);
    leftDoor.add(doorTrimL);

    const doorTrimR = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 20), mat.brass);
    doorTrimR.position.set(-0.38, 0.1, dz);
    rightDoor.add(doorTrimR);
  }

  tagInteractable(group, 'escape_hatch');
  return { group, leftDoor, rightDoor, statusBeacon };
}

/**
 * Reusable animated sliding bulkhead gate for Chapter Gates (boundary, west, east).
 */
export function buildSlidingGate(mat: MaterialPalette, interactId: string): {
  group: THREE.Group;
  leftDoor: THREE.Mesh;
  rightDoor: THREE.Mesh;
  statusBeacon: THREE.Mesh;
} {
  const res = buildEscapeHatch(mat);
  tagInteractable(res.group, interactId);
  return res;
}

/**
 * Composite 7-part Salaryman Overtime Desk (Chapter 1).
 */
export function buildSalarymanDesk(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.76, 0.8), mat.slateStone);
  desk.position.y = 0.38;
  group.add(desk);

  const top = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.06, 0.86), mat.woodTrunk);
  top.position.y = 0.79;
  group.add(top);

  // Retro office monitor + keyboard
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.16, 10), mat.obsidian);
  stand.position.set(0, 0.9, -0.18);
  group.add(stand);

  const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.08), mat.obsidian);
  monitor.position.set(0, 1.14, -0.18);
  group.add(monitor);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.34), mat.cyanGlow);
  screen.position.set(0, 1.14, -0.135);
  group.add(screen);

  // Stack of unpaid overtime folders + coffee mug
  const files = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.24), mat.ivoryCeramic);
  files.position.set(-0.46, 0.91, 0.08);
  files.rotation.y = 0.18;
  group.add(files);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.16), mat.obsidian);
  keyboard.position.set(0, 0.835, 0.12);
  group.add(keyboard);

  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 12), mat.crimsonApple);
  mug.position.set(0.48, 0.88, 0.14);
  group.add(mug);

  tagInteractable(group, 'salaryman_desk');
  return group;
}

/**
 * Composite 8-part Rooftop Parapet Fence Monument (Chapter 1).
 */
export function buildRooftopFence(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  const concrete = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.42, 0.56), mat.slateStone);
  concrete.position.y = 0.21;
  group.add(concrete);

  for (const px of [-0.62, 0, 0.62]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 8), mat.obsidian);
    post.position.set(px, 0.88, 0);
    group.add(post);
  }

  for (const ry of [0.68, 1.1, 1.35]) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 1.48, 8), mat.obsidian);
    rail.rotation.z = Math.PI / 2;
    rail.position.y = ry;
    group.add(rail);
  }

  const badgeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.34, 0.05), mat.darkBrass);
  badgeFrame.position.set(0, 0.9, 0.045);
  group.add(badgeFrame);

  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.24, 0.06), mat.brass);
  badge.position.set(0, 0.9, 0.06);
  group.add(badge);

  tagInteractable(group, 'rooftop_fence');
  return group;
}

/**
 * Composite 5-part Sky & Chikubi Cloud Sketch Easel (Chapter 1).
 */
export function buildSkySketchEasel(
  mat: MaterialPalette,
  sketchTex: THREE.CanvasTexture,
): THREE.Group {
  const group = new THREE.Group();

  for (const lx of [-0.36, 0.36]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.55, 8), mat.woodTrunk);
    leg.position.set(lx, 0.78, 0.06);
    leg.rotation.x = -0.14;
    group.add(leg);
  }
  const backLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), mat.woodTrunk);
  backLeg.position.set(0, 0.74, -0.32);
  backLeg.rotation.x = 0.32;
  group.add(backLeg);

  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.18, 0.06), mat.brass);
  frame.position.set(0, 1.24, 0.14);
  frame.rotation.x = -0.14;
  group.add(frame);

  const painting = new THREE.Mesh(
    new THREE.PlaneGeometry(0.82, 1.08),
    new THREE.MeshStandardMaterial({ map: sketchTex, roughness: 0.55 }),
  );
  painting.position.set(0, 0, 0.032);
  frame.add(painting);

  tagInteractable(group, 'sky_sketch');
  return group;
}

/**
 * Composite 8-part History & Twitter-jin Library Bookshelf (Chapter 2).
 */
export function buildHistoryBookshelf(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.2, 0.54), mat.woodTrunk);
  frame.position.y = 1.1;
  group.add(frame);

  const crown = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.12, 0.62), mat.brass);
  crown.position.y = 2.22;
  group.add(crown);

  const bookMats = [mat.aquamarine, mat.crimsonApple, mat.samuraiArmor, mat.brass];
  for (let row = 0; row < 3; row++) {
    const yPos = 0.52 + row * 0.55;
    for (let b = 0; b < 5; b++) {
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.34, 0.36), bookMats[(row + b) % 4]);
      book.position.set(-0.48 + b * 0.24, yPos, 0.12);
      group.add(book);
    }
  }

  tagInteractable(group, 'history_bookshelf');
  return group;
}

/**
 * Composite 6-part Friend's Table with Shared Apples (Chapter 3).
 */
export function buildFriendTable(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.26, 0.74, 12), mat.woodTrunk);
  ped.position.y = 0.37;
  group.add(ped);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.07, 20), mat.woodTrunk);
  top.position.y = 0.77;
  group.add(top);

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.03, 16), mat.ivoryCeramic);
  plate.position.set(0, 0.82, 0);
  group.add(plate);

  for (const [ax, az] of [[-0.08, 0.04], [0.09, 0.02], [0, -0.09]]) {
    const apple = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), mat.crimsonApple);
    apple.position.set(ax, 0.89, az);
    group.add(apple);
  }

  const letter = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.18), mat.ivoryCeramic);
  letter.position.set(0.32, 0.82, 0.22);
  letter.rotation.y = -0.3;
  group.add(letter);

  tagInteractable(group, 'friend_table');
  return group;
}

/**
 * Composite 5-part Greenhouse Memory Lockbox (Chapter 3).
 */
export function buildGreenhouseLockbox(mat: MaterialPalette): {
  group: THREE.Group;
  crystal: THREE.Mesh;
} {
  const group = new THREE.Group();

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.9, 8), mat.darkBrass);
  stand.position.y = 0.45;
  group.add(stand);

  const box = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.42, 0.56), mat.glassPanel);
  box.position.y = 1.12;
  box.renderOrder = 2;
  group.add(box);

  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), mat.crimsonApple);
  crystal.position.y = 1.12;
  group.add(crystal);

  const lockRim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 8, 16), mat.brass);
  lockRim.rotation.x = Math.PI / 2;
  lockRim.position.y = 0.91;
  group.add(lockRim);

  tagInteractable(group, 'greenhouse_lock');
  return { group, crystal };
}

/**
 * Composite 6-part Apprentice's Bedside & Journal (Chapter 4).
 */
export function buildApprenticeBed(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.34, 1.05), mat.woodTrunk);
  frame.position.y = 0.17;
  group.add(frame);

  const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.18, 0.94), mat.ivoryCeramic);
  mattress.position.y = 0.42;
  group.add(mattress);

  const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.2, 0.96), mat.aquamarine);
  blanket.position.set(0.3, 0.43, 0);
  group.add(blanket);

  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.62), mat.ivoryCeramic);
  pillow.position.set(-0.62, 0.54, 0);
  group.add(pillow);

  const diary = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.24), mat.brass);
  diary.position.set(0.1, 0.55, 0.14);
  diary.rotation.y = 0.25;
  group.add(diary);

  tagInteractable(group, 'apprentice_bed');
  return group;
}

/**
 * Composite 7-part Demon Lord's Throne & Mirror (Chapter 5).
 */
export function buildDemonLordThrone(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();

  const dais = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 1.0, 0.22, 8), mat.obsidian);
  dais.position.y = 0.11;
  group.add(dais);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.36, 0.72), mat.obsidian);
  seat.position.y = 0.4;
  group.add(seat);

  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.38, 0.16), mat.obsidian);
  backrest.position.set(0, 1.22, -0.28);
  group.add(backrest);

  for (const ax of [-0.4, 0.4]) {
    const armRest = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.68), mat.darkBrass);
    armRest.position.set(ax, 0.68, -0.02);
    group.add(armRest);
  }

  for (const sx of [-0.46, 0.46]) {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.52, 8), mat.brass);
    horn.position.set(sx, 2.04, -0.28);
    horn.rotation.z = sx > 0 ? -0.28 : 0.28;
    group.add(horn);
  }

  const mirror = new THREE.Mesh(new THREE.CircleGeometry(0.34, 18), mat.cyanGlow);
  mirror.position.set(0, 1.32, -0.18);
  group.add(mirror);

  tagInteractable(group, 'demon_throne');
  return group;
}

/**
 * Composite 5-part Sky Determination Shrine Window (Chapter 7).
 */
export function buildDeterminationWindow(
  mat: MaterialPalette,
  skyTex: THREE.CanvasTexture,
): THREE.Group {
  const group = new THREE.Group();

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.6), mat.slateStone);
  plinth.position.y = 0.4;
  group.add(plinth);

  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.18, 0.28), mat.darkBrass);
  saddle.position.y = 0.86;
  group.add(saddle);

  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.08, 10, 24), mat.brass);
  frame.position.set(0, 1.65, 0);
  group.add(frame);

  const pane = new THREE.Mesh(
    new THREE.CircleGeometry(0.71, 20),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.DoubleSide }),
  );
  pane.position.set(0, 1.65, 0.0);
  group.add(pane);

  tagInteractable(group, 'determination_window');
  return group;
}

/**
 * Small Filing Cabinet (overtime_drawer).
 */
export function buildSmallCabinet(mat: MaterialPalette, interactId: string): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.84, 1.05, 0.64), mat.slateStone);
  body.position.y = 0.525;
  group.add(body);

  for (const dy of [0.28, 0.56, 0.84]) {
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.22, 0.04), mat.obsidian);
    drawer.position.set(0, dy, 0.325);
    group.add(drawer);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.04), mat.brass);
    handle.position.set(0, dy, 0.355);
    group.add(handle);
  }

  tagInteractable(group, interactId);
  return group;
}

/**
 * Lore Desk with Folio & Glowing Lamp (war_chronicle_desk, age_ledger, star_observatory_desk, dark_monitor_shrine).
 */
export function buildLoreDesk(
  mat: MaterialPalette,
  interactId: string,
  lampMat: THREE.MeshStandardMaterial,
): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.78, 0.75), mat.woodTrunk);
  body.position.y = 0.39;
  group.add(body);

  const trim = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.06, 0.8), mat.brass);
  trim.position.y = 0.81;
  group.add(trim);

  const folio = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.34), mat.ivoryCeramic);
  folio.position.set(-0.2, 0.86, 0.08);
  folio.rotation.y = 0.16;
  group.add(folio);

  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.32, 10), mat.darkBrass);
  lampStem.position.set(0.38, 0.99, -0.12);
  group.add(lampStem);

  const lampOrb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), lampMat);
  lampOrb.position.set(0.38, 1.18, -0.12);
  group.add(lampOrb);

  tagInteractable(group, interactId);
  return group;
}

/**
 * Astrolabe / Myth Globe Pedestal (myth_globe).
 */
export function buildMythGlobe(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.56, 0.85, 8), mat.slateStone);
  base.position.y = 0.425;
  group.add(base);

  const cradleStem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.16, 10), mat.darkBrass);
  cradleStem.position.y = 0.9;
  group.add(cradleStem);

  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.035, 10, 24), mat.brass);
  ringOuter.position.y = 1.38;
  group.add(ringOuter);

  const ringInner = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.025, 10, 24), mat.goldGlow);
  ringInner.position.y = 1.38;
  ringInner.rotation.y = Math.PI / 3;
  group.add(ringInner);

  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), mat.cyanGlow);
  globe.position.y = 1.38;
  group.add(globe);

  tagInteractable(group, 'myth_globe');
  return group;
}

/**
 * Inscribed Stone Pillar / Altar Monument (evolution_pillar, final_monument, twitter_census_pillar, demon_seal_pedestal).
 */
export function buildStonePillar(
  mat: MaterialPalette,
  interactId: string,
  crestMat: THREE.MeshStandardMaterial,
): THREE.Group {
  const group = new THREE.Group();
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.64, 0.28, 8), mat.obsidian);
  plinth.position.y = 0.14;
  group.add(plinth);

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 1.32, 8), mat.slateStone);
  column.position.y = 0.94;
  group.add(column);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 20), mat.brass);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 1.62;
  group.add(collar);

  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), crestMat);
  crystal.position.y = 1.92;
  group.add(crystal);

  tagInteractable(group, interactId);
  return group;
}

/**
 * Apple Basket & Plate Pedestal (basket_plate).
 */
export function buildAppleBasketPlate(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.48, 0.78, 12), mat.woodTrunk);
  stand.position.y = 0.39;
  group.add(stand);

  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.24, 0.2, 14), mat.brass);
  basket.position.y = 0.88;
  group.add(basket);

  for (const [ax, az] of [
    [-0.14, 0.08],
    [0.14, 0.08],
    [-0.12, -0.1],
    [0.12, -0.1],
    [0, 0.16],
    [0, -0.02],
  ]) {
    const apple = new THREE.Mesh(new THREE.SphereGeometry(0.068, 10, 8), mat.crimsonApple);
    apple.position.set(ax, 1.0, az);
    group.add(apple);
  }

  tagInteractable(group, 'basket_plate');
  return group;
}

/**
 * Withered Pot Monument (withered_flower_pot).
 */
export function buildFlowerPot(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();
  const ped = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.62, 0.75), mat.slateStone);
  ped.position.y = 0.31;
  group.add(ped);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 0.32, 12), mat.darkBrass);
  pot.position.y = 0.78;
  group.add(pot);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.42, 8), mat.woodTrunk);
  stem.position.y = 1.08;
  stem.rotation.z = 0.2;
  group.add(stem);

  const blossom = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), mat.goldGlow);
  blossom.position.set(-0.06, 1.28, 0);
  group.add(blossom);

  tagInteractable(group, 'withered_flower_pot');
  return group;
}

/**
 * Standing Plaque / Blueprint Board (village_rumor_board, submarina_blueprint).
 */
export function buildPlaqueBoard(
  mat: MaterialPalette,
  interactId: string,
  tex: THREE.CanvasTexture,
): THREE.Group {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.24, 0.56), mat.obsidian);
  base.position.y = 0.12;
  group.add(base);

  for (const px of [-0.52, 0.52]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.65, 8), mat.darkBrass);
    post.position.set(px, 0.94, 0);
    group.add(post);
  }

  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.98, 0.08), mat.brass);
  frame.position.set(0, 1.38, 0);
  group.add(frame);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(1.36, 0.86),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 }),
  );
  face.position.set(0, 1.38, 0.048);
  group.add(face);

  tagInteractable(group, interactId);
  return group;
}

/**
 * Ornate Twilight Mirror (twilight_mirror).
 */
export function buildTwilightMirror(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();
  const stand = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.42, 0.55), mat.obsidian);
  stand.position.y = 0.21;
  group.add(stand);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.36, 10), mat.darkBrass);
  stem.position.y = 0.58;
  group.add(stem);

  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 10, 24), mat.brass);
  frame.position.set(0, 1.36, 0);
  group.add(frame);

  const glassMat = mat.cyanGlow.clone();
  glassMat.side = THREE.DoubleSide;
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.58, 24), glassMat);
  glass.position.set(0, 1.36, 0.0);
  group.add(glass);

  tagInteractable(group, 'twilight_mirror');
  return group;
}

/**
 * Scroll / Breeze Duct Pedestal (tsukkomi_scroll, warm_breeze_duct).
 */
export function buildScrollPedestal(
  mat: MaterialPalette,
  interactId: string,
  accentMat: THREE.MeshStandardMaterial,
): THREE.Group {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.92, 8), mat.darkBrass);
  base.position.y = 0.46;
  group.add(base);

  const scrollBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.68, 12), mat.ivoryCeramic);
  scrollBody.rotation.z = Math.PI / 2;
  scrollBody.position.y = 1.05;
  group.add(scrollBody);

  for (const sx of [-0.36, 0.36]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 12), accentMat);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(sx, 1.05, 0);
    group.add(cap);
  }

  tagInteractable(group, interactId);
  return group;
}

/**
 * Four-Cardinal Memory Compass Calibrator (compass_calibrator).
 */
export function buildCompassCalibrator(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.7, 0.95, 8), mat.slateStone);
  base.position.y = 0.475;
  group.add(base);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.54, 0.12, 16), mat.darkBrass);
  neck.position.y = 0.98;
  group.add(neck);

  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 24), mat.obsidian);
  dial.position.y = 1.03;
  group.add(dial);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.045, 10, 24), mat.brass);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 1.05;
  group.add(ring);

  const needle = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.72, 4), mat.goldGlow);
  needle.rotation.x = Math.PI / 2;
  needle.position.y = 1.08;
  group.add(needle);

  tagInteractable(group, 'compass_calibrator');
  return group;
}

/**
 * Deep-Sea Ether Reactor Core (ether_reactor_core).
 */
export function buildReactorCore(mat: MaterialPalette): THREE.Group {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.8, 0.7, 8), mat.obsidian);
  base.position.y = 0.35;
  group.add(base);

  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.15, 16), mat.aquamarine);
  core.position.y = 1.25;
  group.add(core);

  for (const ry of [0.95, 1.25, 1.55]) {
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 10, 20), mat.cyanGlow);
    coil.rotation.x = Math.PI / 2;
    coil.position.y = ry;
    group.add(coil);
  }

  tagInteractable(group, 'ether_reactor_core');
  return group;
}



