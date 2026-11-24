import * as THREE from 'three';

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createPlankWoodTextures(maxAnisotropy: number): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const [cCanvas, ctx] = makeCanvas(512, 512);
  const [bCanvas, bCtx] = makeCanvas(512, 512);

  ctx.fillStyle = '#5c3f28';
  ctx.fillRect(0, 0, 512, 512);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);

  const plankCount = 8;
  const plankH = 512 / plankCount;
  for (let i = 0; i < plankCount; i++) {
    const y = i * plankH;
    const toneShift = (i % 3) * 8 - 8;
    ctx.fillStyle = `rgb(${92 + toneShift}, ${63 + Math.round(toneShift * 0.7)}, ${41 + Math.round(toneShift * 0.5)})`;
    ctx.fillRect(0, y + 2, 512, plankH - 4);

    // Subtle wood grain lines
    for (let g = 0; g < 16; g++) {
      const gy = y + 4 + (g / 16) * (plankH - 8);
      ctx.strokeStyle = g % 2 === 0 ? 'rgba(35,20,10,0.22)' : 'rgba(140,100,66,0.16)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.bezierCurveTo(170, gy + Math.sin(g + i) * 3, 340, gy - Math.cos(g) * 3, 512, gy);
      ctx.stroke();

      bCtx.strokeStyle = g % 2 === 0 ? '#686868' : '#969696';
      bCtx.lineWidth = 1;
      bCtx.beginPath();
      bCtx.moveTo(0, gy);
      bCtx.lineTo(512, gy);
      bCtx.stroke();
    }

    // Plank seam
    ctx.fillStyle = '#24160d';
    ctx.fillRect(0, y, 512, 3);
    bCtx.fillStyle = '#202020';
    bCtx.fillRect(0, y, 512, 3);

    // Staggered vertical joint
    const jointX = ((i * 173 + 80) % 440) + 32;
    ctx.fillRect(jointX, y, 3, plankH);
    bCtx.fillRect(jointX, y, 3, plankH);
  }

  const map = new THREE.CanvasTexture(cCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(5, 5);
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(5, 5);
  bumpMap.anisotropy = maxAnisotropy;

  return { map, bumpMap };
}

export function createCabinWallTextures(maxAnisotropy: number): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  capMap: THREE.CanvasTexture;
  parapetMap: THREE.CanvasTexture;
} {
  const [cCanvas, ctx] = makeCanvas(512, 512);
  const [bCanvas, bCtx] = makeCanvas(512, 512);

  // Cream-ivory carved airship paneling with subtle brass ribs
  ctx.fillStyle = '#ded7c8';
  ctx.fillRect(0, 0, 512, 512);
  bCtx.fillStyle = '#888888';
  bCtx.fillRect(0, 0, 512, 512);

  // Wainscoting lower band
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 350, 512, 162);
  ctx.fillStyle = '#b48a4a';
  ctx.fillRect(0, 342, 512, 10);

  bCtx.fillStyle = '#a8a8a8';
  bCtx.fillRect(0, 342, 512, 10);

  // Vertical panel frames
  for (let x = 0; x < 512; x += 128) {
    ctx.strokeStyle = '#b9ae98';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 12, 24, 104, 296);

    bCtx.strokeStyle = '#606060';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(x + 12, 24, 104, 296);

    // Rivets
    ctx.fillStyle = '#9c783c';
    for (let ry = 360; ry < 500; ry += 42) {
      ctx.beginPath();
      ctx.arc(x + 16, ry, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Clean vertical doorway jamb / wall end-cap texture (no horizontal frames or rivets)
  const [capCanvas, capCtx] = makeCanvas(64, 512);
  capCtx.fillStyle = '#d4ccb9';
  capCtx.fillRect(0, 0, 64, 512);
  capCtx.fillStyle = '#334155';
  capCtx.fillRect(0, 350, 64, 162);
  capCtx.fillStyle = '#b48a4a';
  capCtx.fillRect(0, 342, 64, 10);
  capCtx.fillStyle = 'rgba(15, 23, 42, 0.14)';
  capCtx.fillRect(0, 0, 6, 512);
  capCtx.fillRect(58, 0, 6, 512);

  // Clean low balcony / terrace parapet texture proportioned for 1.2m-1.4m rails
  const [pCanvas, pCtx] = makeCanvas(512, 256);
  pCtx.fillStyle = '#dfd8c8';
  pCtx.fillRect(0, 0, 512, 256);
  pCtx.fillStyle = '#b48a4a';
  pCtx.fillRect(0, 0, 512, 16);
  pCtx.fillStyle = '#334155';
  pCtx.fillRect(0, 178, 512, 78);
  pCtx.fillStyle = '#b48a4a';
  pCtx.fillRect(0, 170, 512, 10);
  for (let x = 0; x < 512; x += 128) {
    pCtx.strokeStyle = '#b9ae98';
    pCtx.lineWidth = 4;
    pCtx.strokeRect(x + 14, 30, 100, 124);
  }

  const map = new THREE.CanvasTexture(cCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.repeat.set(2, 1);
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.repeat.set(2, 1);
  bumpMap.anisotropy = maxAnisotropy;

  const capMap = new THREE.CanvasTexture(capCanvas);
  capMap.colorSpace = THREE.SRGBColorSpace;
  capMap.wrapS = THREE.ClampToEdgeWrapping;
  capMap.wrapT = THREE.ClampToEdgeWrapping;
  capMap.anisotropy = maxAnisotropy;

  const parapetMap = new THREE.CanvasTexture(pCanvas);
  parapetMap.colorSpace = THREE.SRGBColorSpace;
  parapetMap.wrapS = THREE.RepeatWrapping;
  parapetMap.wrapT = THREE.ClampToEdgeWrapping;
  parapetMap.repeat.set(4, 1);
  parapetMap.anisotropy = maxAnisotropy;

  return { map, bumpMap, capMap, parapetMap };
}

export function createChalkboardTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 320);

  ctx.fillStyle = '#183329';
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(24, 24, 464, 272);

  ctx.strokeStyle = '#b48a4a';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 310);

  ctx.fillStyle = '#e7f5ee';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('れじーなの研究黒板', 28, 48);

  ctx.fillStyle = '#a7f3d0';
  ctx.font = '18px sans-serif';
  ctx.fillText('「チクビは飛ばねえだろ？」', 28, 92);
  ctx.fillText('十二歳の少年が、毎日通い始めた。', 28, 126);

  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(24, 154, 464, 134);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('聖域門への覚書：', 38, 188);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px sans-serif';
  ctx.fillText('初めて扉を叩いた齢の十の位と一の位、', 38, 222);
  ctx.fillText('そして寝台に倒れるまで重ねた歳月の十と一。', 38, 250);
  ctx.fillText('四つの数字が奥西翼の封印を解く。', 38, 276);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createSamuraiPlaqueTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 320);
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(0, 0, 512, 320);
  ctx.strokeStyle = '#d4a64a';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 308);

  ctx.fillStyle = '#f8d27a';
  ctx.font = 'bold 24px serif';
  ctx.fillText('チンチン侍の動力銘板', 30, 52);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('翼は最小の素数に等しく、', 40, 108);

  ctx.fillStyle = '#fbbf24';
  ctx.fillText('海は翼に一を足した数。', 40, 152);

  ctx.fillStyle = '#93c5fd';
  ctx.fillText('空は海を二倍に満たし、', 40, 196);

  ctx.fillStyle = '#34d399';
  ctx.fillText('猫は空に一を添える。', 40, 240);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '16px sans-serif';
  ctx.fillText('空・海・猫・翼の順に盤を廻せ', 40, 286);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createReginaFaceTexture(
  maxAnisotropy: number,
  expression: 'gentle' | 'smile' = 'gentle',
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  const isSmile = expression === 'smile';

  // Warm porcelain-peach anime skin base with subtle cheek/chin warmth
  const skinGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skinGrad.addColorStop(0, '#ffe3d2');
  skinGrad.addColorStop(0.55, '#ffe8da');
  skinGrad.addColorStop(1, '#f8cbb7');
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Note: On SphereGeometry with rotation.y = -PI/2, u=0.5 (x=256) faces +Z directly.
  const cx = 256;

  // Soft forehead shadow under hair bangs for anime depth
  const browShade = ctx.createLinearGradient(0, 175, 0, 232);
  browShade.addColorStop(0, 'rgba(205, 130, 100, 0.20)');
  browShade.addColorStop(1, 'rgba(205, 130, 100, 0.0)');
  ctx.fillStyle = browShade;
  ctx.fillRect(160, 175, 192, 58);

  // Soft rosy anime cheek blush + tiny cute blush hatch lines
  for (const side of [-1, 1]) {
    const bx = cx + side * 36;
    const by = 278;
    const blush = ctx.createRadialGradient(bx, by, 2, bx, by, isSmile ? 25 : 22);
    blush.addColorStop(0, isSmile ? 'rgba(255, 108, 138, 0.65)' : 'rgba(255, 118, 145, 0.52)');
    blush.addColorStop(1, 'rgba(255, 118, 145, 0.0)');
    ctx.fillStyle = blush;
    ctx.beginPath();
    ctx.ellipse(bx, by, isSmile ? 25 : 22, isSmile ? 15 : 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(244, 96, 128, 0.42)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(bx - 5, by + 3);
    ctx.lineTo(bx - 1, by - 3);
    ctx.moveTo(bx + 3, by + 3);
    ctx.lineTo(bx + 7, by - 3);
    ctx.stroke();
  }

  // Big, sparkling, adorable deep sapphire-blue anime eyes ("深い青色の瞳")
  for (const side of [-1, 1]) {
    const ex = cx + side * 24;
    const ey = 250;

    // Gentle thin eyebrow
    ctx.strokeStyle = '#9e6828';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ex - 11 * side, ey - 26);
    ctx.quadraticCurveTo(ex, ey - 31, ex + 13 * side, ey - 25);
    ctx.stroke();

    // Sclera (bright clean anime white, rounded-tall)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(ex, ey + 2, 16.5, 19.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle upper sclera shadow under eyelashes
    ctx.fillStyle = 'rgba(180, 200, 235, 0.35)';
    ctx.beginPath();
    ctx.ellipse(ex, ey - 8, 15.5, 7, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Large luminous sapphire-blue iris
    const irisGrad = ctx.createLinearGradient(ex, ey - 14, ex, ey + 19);
    irisGrad.addColorStop(0, '#0a1d5c');
    irisGrad.addColorStop(0.42, '#1d4ed8');
    irisGrad.addColorStop(0.82, '#38bdf8');
    irisGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(ex - side * 0.5, ey + 2.5, 13.2, 16.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft upper iris shadow crescent
    ctx.fillStyle = 'rgba(6, 15, 48, 0.52)';
    ctx.beginPath();
    ctx.ellipse(ex - side * 0.5, ey - 4, 12.6, 8.5, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Deep navy pupil
    ctx.fillStyle = '#071130';
    ctx.beginPath();
    ctx.ellipse(ex - side * 0.5, ey + 2, 5.4, 7.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bright lower azure crescent glow
    ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
    ctx.beginPath();
    ctx.ellipse(ex - side * 0.5, ey + 12.5, 8.2, 3.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Graceful dark-brown upper eyelashes (arching high cleanly above sclera)
    ctx.strokeStyle = '#331d15';
    ctx.lineWidth = 4.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ex - 17 * side, ey - 4);
    ctx.quadraticCurveTo(ex, ey - 22, ex + 17.5 * side, ey - 5);
    ctx.stroke();
    // Cute outer eyelash flick
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(ex + 14.5 * side, ey - 7);
    ctx.lineTo(ex + 20 * side, ey - 10);
    ctx.stroke();
    // Thin delicate lower lash line
    ctx.strokeStyle = 'rgba(90, 52, 42, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ex - 9, ey + 19.5);
    ctx.quadraticCurveTo(ex, ey + 21.5, ex + 9, ey + 19.5);
    ctx.stroke();

    // Crisp multi-sparkle anime specular catchlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(ex - 4.8, ey - 5.2, isSmile ? 5.4 : 4.8, isSmile ? 5.6 : 5.2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 5.5, ey + 8.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 6.2, ey - 6.8, 1.5, 0, Math.PI * 2);
    ctx.fill();

    if (isSmile) {
      // Soft upward lower eyelid cheek lift for a warm smile while keeping blue eyes clear
      ctx.fillStyle = '#ffe5d6';
      ctx.beginPath();
      ctx.moveTo(ex - 16, ey + 15);
      ctx.quadraticCurveTo(ex, ey + 8, ex + 16, ey + 15);
      ctx.lineTo(ex + 16, ey + 23);
      ctx.lineTo(ex - 16, ey + 23);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(130, 74, 58, 0.55)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(ex - 12, ey + 14.5);
      ctx.quadraticCurveTo(ex, ey + 8.5, ex + 12, ey + 14.5);
      ctx.stroke();
    }
  }

  // Delicate tiny nose dot
  ctx.fillStyle = 'rgba(195, 118, 92, 0.65)';
  ctx.beginPath();
  ctx.arc(cx, 279, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Sweet gentle open anime smile
  const mouthW = isSmile ? 11.5 : 8.5;
  const mouthDip = isSmile ? 310.0 : 305.5;
  ctx.fillStyle = isSmile ? '#f47b88' : '#f28b92';
  ctx.beginPath();
  ctx.moveTo(cx - mouthW, 294);
  ctx.quadraticCurveTo(cx, mouthDip, cx + mouthW, 294);
  ctx.quadraticCurveTo(cx, 297.5, cx - mouthW, 294);
  ctx.fill();
  ctx.strokeStyle = '#b95c5c';
  ctx.lineWidth = 2.1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - (mouthW + 1), 293.5);
  ctx.quadraticCurveTo(cx, isSmile ? 306.5 : 303.5, cx + (mouthW + 1), 293.5);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createSketchTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(384, 512);
  const sky = ctx.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, '#1d4ed8');
  sky.addColorStop(0.55, '#60a5fa');
  sky.addColorStop(1, '#dbeafe');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 384, 380);

  // Soft sunlit sky glow behind cloud
  const sunGlow = ctx.createRadialGradient(192, 130, 12, 192, 130, 145);
  sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, 384, 280);

  // Single Chikubi Airplane Cloud (matches the finale puzzle's "single cloud" clue)
  const drawPuff = (x: number, y: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  // Chikubi Airplane Cloud (clean layered shadow + fluffy white puffs + swept wings + top dome)
  const cloudShadow: [number, number, number][] = [
    [130, 144, 22],
    [154, 140, 28],
    [230, 140, 28],
    [254, 144, 22],
    [192, 142, 42],
  ];
  for (const [px, py, pr] of cloudShadow) {
    drawPuff(px, py + 5, pr, 'rgba(186, 220, 250, 0.85)');
  }
  const cloudPuffs: [number, number, number][] = [
    [122, 142, 18],
    [148, 136, 26],
    [236, 136, 26],
    [262, 142, 18],
    [172, 126, 30],
    [212, 126, 30],
    [192, 128, 38],
    [192, 92, 19],
    [192, 74, 10],
  ];
  for (const [px, py, pr] of cloudPuffs) {
    drawPuff(px, py, pr, '#ffffff');
  }

  // Rolling green meadow hills
  ctx.fillStyle = '#3f8f34';
  ctx.beginPath();
  ctx.ellipse(110, 386, 175, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4da53e';
  ctx.beginPath();
  ctx.ellipse(275, 388, 175, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(0, 368, 384, 144);

  // Cute golden-haired girl silhouette looking up at the cloud
  // Dress (royal blue with soft skirt flare)
  ctx.fillStyle = '#1e40af';
  ctx.beginPath();
  ctx.moveTo(182, 294);
  ctx.lineTo(202, 294);
  ctx.lineTo(222, 372);
  ctx.lineTo(162, 372);
  ctx.closePath();
  ctx.fill();
  // White collar & sky-blue ribbon
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(180, 294);
  ctx.lineTo(204, 294);
  ctx.lineTo(192, 308);
  ctx.closePath();
  ctx.fill();
  // Back hair & flowing golden strands
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.ellipse(192, 272, 22, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(171, 274);
  ctx.quadraticCurveTo(164, 314, 172, 336);
  ctx.lineTo(212, 336);
  ctx.quadraticCurveTo(220, 314, 213, 274);
  ctx.closePath();
  ctx.fill();
  // Hair highlight
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(186, 265, 11, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(16, 405, 352, 90);
  ctx.strokeStyle = '#d4a64a';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 405, 352, 90);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('「あれ。チクビ飛行機みたいだなぁ」', 192, 438);
  ctx.fillStyle = '#bae6fd';
  ctx.font = '14px sans-serif';
  ctx.fillText('残業・未払い・高み・見上げた瞳', 192, 472);
  ctx.textAlign = 'start';

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createRumorBoardTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 320);
  ctx.fillStyle = '#2d1e2f';
  ctx.fillRect(0, 0, 512, 320);
  ctx.strokeStyle = '#d4a64a';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 308);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 22px serif';
  ctx.fillText('街の人々の言葉と彼女の笑顔', 30, 52);

  ctx.fillStyle = '#fca5a5';
  ctx.font = '18px sans-serif';
  ctx.fillText('「チクビ飛行機おばさん！」', 36, 108);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '17px sans-serif';
  ctx.fillText('――そう呼ばれても彼女は怒らず、', 36, 154);
  ctx.fillText('「いつか分かるまで研究するよ」と', 36, 188);
  ctx.fillText('ただ優しく笑い続けていた。', 36, 222);

  ctx.fillStyle = '#c4b5fd';
  ctx.font = '15px sans-serif';
  ctx.fillText('たった一つの優しさが、やがて世界を包む。', 36, 274);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createBlueprintTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 320);
  ctx.fillStyle = '#0f2942';
  ctx.fillRect(0, 0, 512, 320);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 492, 300);

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.25)';
  ctx.lineWidth = 1;
  for (let gx = 40; gx < 500; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 10);
    ctx.lineTo(gx, 310);
    ctx.stroke();
  }

  ctx.fillStyle = '#bae6fd';
  ctx.font = 'bold 21px sans-serif';
  ctx.fillText('対なる遺物・反転設計図', 30, 50);

  ctx.fillStyle = '#e0f2fe';
  ctx.font = '17px sans-serif';
  ctx.fillText('天を翔ける「天空の鍵」に対し、', 34, 112);
  ctx.fillText('海を潜る遺物は鏡の如く反転する。', 34, 148);
  ctx.fillText('天空の鍵を開きし四つの数を', 34, 200);
  ctx.fillText('末尾より逆さに刻み、炉を開けよ。', 34, 236);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createProphecySteleTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(400, 512);
  ctx.fillStyle = '#2b3242';
  ctx.fillRect(0, 0, 400, 512);
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, 372, 484);

  ctx.fillStyle = '#bae6fd';
  ctx.font = 'bold 24px serif';
  ctx.fillText('勇者リ・サーの予言', 42, 72);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '18px sans-serif';
  const lines = [
    '一万年後、世界は再び滅ぶ。',
    'それを止める鍵は――',
    '「フライジェット・チ・クビ」',
    '「天空の鍵」',
    'そして対となる存在……',
    '',
    '二つの遺物が揃う時、',
    '聖なる『猫』の輪郭が現れ、',
    '4000年の孤独は終わる。',
  ];
  lines.forEach((line, idx) => {
    ctx.fillText(line, 36, 130 + idx * 36);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(128, 128);
  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
  grad.addColorStop(0, 'rgba(8, 12, 20, 0.72)');
  grad.addColorStop(0.55, 'rgba(8, 12, 20, 0.32)');
  grad.addColorStop(1, 'rgba(8, 12, 20, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createGrasslandTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = '#5da846';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 600; i++) {
    const x = (i * 73) % 512;
    const y = (i * 137) % 512;
    ctx.fillStyle = i % 3 === 0 ? '#74bf57' : i % 3 === 1 ? '#4b9238' : '#8fd16a';
    ctx.fillRect(x, y, 4, 10);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createPortholeSkyTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(256, 256);

  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#2563eb');
  grad.addColorStop(0.55, '#60a5fa');
  grad.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Soft sunlit cumulus cloud shapes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  const puffs: [number, number, number][] = [
    [74, 150, 28],
    [102, 142, 34],
    [136, 148, 26],
    [176, 114, 22],
    [200, 118, 18],
  ];
  for (const [cx, cy, r] of puffs) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle glass reflection diagonal streak
  const streak = ctx.createLinearGradient(0, 0, 256, 256);
  streak.addColorStop(0, 'rgba(255,255,255,0.22)');
  streak.addColorStop(0.35, 'rgba(255,255,255,0.0)');
  streak.addColorStop(1, 'rgba(255,255,255,0.08)');
  ctx.fillStyle = streak;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

