export type GamePhase = 'title' | 'wakeup' | 'playing' | 'paused' | 'ending' | 'gameover';
export type EscapeOutcome = 'none' | 'victory' | 'defeat';
export type ActiveModal =
  | 'none'
  | 'boundary'
  | 'timeline'
  | 'greenhouse'
  | 'apprentice'
  | 'demon_seal'
  | 'vault'
  | 'valves'
  | 'compass'
  | 'reactor'
  | 'resonance'
  | 'evolution'
  | 'finale_seal'
  | 'notebook';

export interface GameState {
  phase: GamePhase;
  wakeupStep: number; // 0: fall, 1: eyes open/sky, 2: girl speaks, 3: blink & vanish
  endingStep: number; // 0: girl calls "待って", 1: turn & "ありがとう。", 2: girl smiles
  outcome: EscapeOutcome;
  chapter: number; // 1..6
  timeRemaining: number;
  elapsedTime: number;
  stability: number;
  maxStability: number;

  // Progression flags across all 6 chapters
  boundaryOpen: boolean;
  westGateOpen: boolean;
  hasAppleMemory: boolean;
  demonGateOpen: boolean;
  hasDemonSeal: boolean;
  vaultUnlocked: boolean;
  hasSkyKey: boolean;
  eastGateOpen: boolean;
  valvesAligned: boolean;
  hangarGateOpen: boolean;
  compassAligned: boolean;
  reactorUnlocked: boolean;
  hasSubmarina: boolean;
  altarFused: boolean;
  hasTwihaiOath: boolean;
  hatchOpen: boolean;

  // Puzzle inputs across all 12 puzzles
  boundaryDigits: [number, number, number, number];
  timelineOrder: number[]; // indices 0..3 -> [0, 1, 2, 3]
  greenhouseDigits: [number, number, number, number];
  apprenticeDigits: [number, number, number, number];
  demonSealAnswers: [string, string, string];
  vaultDigits: [number, number, number, number];
  valveLevels: [number, number, number, number]; // 0..7 -> [6, 3, 7, 2]
  compassBearings: [string, string, string, string]; // ['南','西','東','北']
  reactorDigits: [number, number, number, number];
  resonanceAnswers: [string, string, string];
  evolutionAnswers: [string, string, string];
  finaleDigits: [number, number, number, number];

  discoveredMemories: string[];
  activeModal: ActiveModal;
  statusMessage: string;
}

export const BOUNDARY_SOLUTION: readonly [number, number, number, number] = [5, 3, 8, 2];
export const TIMELINE_SOLUTION: readonly number[] = [0, 1, 2, 3];
export const GREENHOUSE_SOLUTION: readonly [number, number, number, number] = [5, 3, 4, 2];
export const APPRENTICE_SOLUTION: readonly [number, number, number, number] = [1, 2, 6, 8];
export const DEMON_SEAL_SOLUTION: readonly [string, string, string] = [
  '怒らず笑い、研究を続けた',
  '誰も死なないよう自分が世界を管理する',
  '人間への歪んだ優しさ',
];
export const VAULT_SOLUTION: readonly [number, number, number, number] = [4, 3, 8, 1];
export const VALVE_SOLUTION: readonly [number, number, number, number] = [6, 3, 7, 2];
export const COMPASS_SOLUTION: readonly [string, string, string, string] = ['南', '西', '東', '北'];
export const REACTOR_SOLUTION: readonly [number, number, number, number] = [1, 8, 3, 4];
export const RESONANCE_SOLUTION: readonly [string, string, string] = [
  '猫',
  '初めまして。母親によく似てるな',
  'これでいい。',
];
export const EVOLUTION_SOLUTION: readonly [string, string, string] = [
  'ツイ廃',
  '約100年',
  '主人公と同じ時間を生きること',
];
export const FINALE_SOLUTION: readonly [number, number, number, number] = [6, 1, 3, 1];

export const INITIAL_TIME_SECONDS = 2400; // 40 minutes across 6 chapters & 11 zones
export const TOTAL_MEMORY_COUNT = 24;
export const TOTAL_CHAPTER_COUNT = 6;

export function createInitialGameState(
  startMode: boolean | 'title' | 'wakeup' | 'playing' = false,
): GameState {
  const phase: GamePhase =
    startMode === true || startMode === 'playing'
      ? 'playing'
      : startMode === 'wakeup'
        ? 'wakeup'
        : 'title';

  return {
    phase,
    wakeupStep: 0,
    endingStep: 0,
    outcome: 'none',
    chapter: 1,
    timeRemaining: INITIAL_TIME_SECONDS,
    elapsedTime: 0,
    stability: 100,
    maxStability: 100,

    boundaryOpen: false,
    westGateOpen: false,
    hasAppleMemory: false,
    demonGateOpen: false,
    hasDemonSeal: false,
    vaultUnlocked: false,
    hasSkyKey: false,
    eastGateOpen: false,
    valvesAligned: false,
    hangarGateOpen: false,
    compassAligned: false,
    reactorUnlocked: false,
    hasSubmarina: false,
    altarFused: false,
    hasTwihaiOath: false,
    hatchOpen: false,

    boundaryDigits: [0, 0, 0, 0],
    timelineOrder: [2, 0, 3, 1],
    greenhouseDigits: [0, 0, 0, 0],
    apprenticeDigits: [0, 0, 0, 0],
    demonSealAnswers: ['', '', ''],
    vaultDigits: [0, 0, 0, 0],
    valveLevels: [1, 1, 1, 1],
    compassBearings: ['北', '東', '南', '西'],
    reactorDigits: [0, 0, 0, 0],
    resonanceAnswers: ['', '', ''],
    evolutionAnswers: ['', '', ''],
    finaleDigits: [0, 0, 0, 0],

    discoveredMemories: [],
    activeModal: 'none',
    statusMessage: '',
  };
}

export function advanceWakeupStep(state: GameState): GameState {
  if (state.phase !== 'wakeup') return state;
  if (state.wakeupStep < 3) {
    return { ...state, wakeupStep: state.wakeupStep + 1 };
  }
  return {
    ...state,
    phase: 'playing',
    wakeupStep: 3,
    statusMessage: '青い空と柔らかな風の記憶を抱え、南デッキから探索を始めよう。',
  };
}

export function skipWakeupSequence(state: GameState): GameState {
  if (state.phase !== 'wakeup') return state;
  return {
    ...state,
    phase: 'playing',
    wakeupStep: 3,
    statusMessage: '',
  };
}

export function recordMemoryDiscovery(state: GameState, memoryId: string): GameState {
  if (state.discoveredMemories.includes(memoryId)) {
    return state;
  }
  return {
    ...state,
    discoveredMemories: [...state.discoveredMemories, memoryId],
  };
}

function applyWrongPenalty(state: GameState, penalty: number, msg: string): GameState {
  const nextStability = Math.max(0, state.stability - penalty);
  const defeated = nextStability <= 0;
  return {
    ...state,
    stability: nextStability,
    phase: defeated ? 'gameover' : state.phase,
    outcome: defeated ? 'defeat' : state.outcome,
    activeModal: defeated ? 'none' : state.activeModal,
    statusMessage: defeated ? '機体安定度が限界に達した…' : msg,
  };
}

export function stepFourDigit(
  digits: [number, number, number, number],
  index: 0 | 1 | 2 | 3,
  delta: 1 | -1,
): [number, number, number, number] {
  const next: [number, number, number, number] = [...digits] as [number, number, number, number];
  next[index] = (next[index] + delta + 10) % 10;
  return next;
}

// Ch 1 (Part 1): Boundary Gate
export function submitBoundaryCode(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.boundaryOpen) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.boundaryDigits.every((d, i) => d === BOUNDARY_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        boundaryOpen: true,
        chapter: Math.max(state.chapter, 1),
        activeModal: 'none',
        statusMessage: '境界扉が開き、中央操縦室へ進めるようになった！',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 10, '境界の暗号が違うようだ（安定度 -10%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

// Ch 1 (Part 2) -> Ch 2: West Gate Timeline
export function swapTimelineItems(state: GameState, idxA: number, idxB: number): GameState {
  if (state.westGateOpen) return state;
  if (idxA < 0 || idxA > 3 || idxB < 0 || idxB > 3) return state;
  const next = [...state.timelineOrder];
  const tmp = next[idxA];
  next[idxA] = next[idxB];
  next[idxB] = tmp;
  return { ...state, timelineOrder: next, statusMessage: '' };
}

export function submitTimelineOrder(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.westGateOpen) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.timelineOrder.every((v, i) => v === TIMELINE_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        westGateOpen: true,
        chapter: Math.max(state.chapter, 2),
        activeModal: 'none',
        statusMessage: '西翼・記憶の温室への扉が開かれた！（第2章へ）',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 10, '歴史の順序が正しくないようだ（安定度 -10%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

// Ch 2 (Part 1): Apple Greenhouse Lockbox
export function submitGreenhouseCode(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.hasAppleMemory) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.greenhouseDigits.every((d, i) => d === GREENHOUSE_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        hasAppleMemory: true,
        chapter: Math.max(state.chapter, 2),
        activeModal: 'none',
        statusMessage: 'リンゴの記憶結晶を手に入れた！ 弟子の記憶から奥西翼の門を開こう。',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 10, '友情の数字が違うようだ（安定度 -10%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

// Ch 2 (Part 2) -> Ch 3: Apprentice Trial -> Demon Gate
export function submitApprenticeCode(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.demonGateOpen) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.apprenticeDigits.every((d, i) => d === APPRENTICE_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        demonGateOpen: true,
        chapter: Math.max(state.chapter, 3),
        activeModal: 'none',
        statusMessage: '奥西翼・魔王の聖域と星見観測所が開かれた！（第3章へ）',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 10, '弟子の歳月の暗号が違うようだ（安定度 -10%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

// Ch 3 (Part 1): Demon Lord Seal
export function setDemonSealAnswer(state: GameState, slot: 0 | 1 | 2, value: string): GameState {
  if (state.hasDemonSeal) return state;
  const next: [string, string, string] = [...state.demonSealAnswers] as [string, string, string];
  next[slot] = value;
  return { ...state, demonSealAnswers: next, statusMessage: '' };
}

export function submitDemonSeal(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.hasDemonSeal) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.demonSealAnswers.every((ans, i) => ans === DEMON_SEAL_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        hasDemonSeal: true,
        chapter: Math.max(state.chapter, 3),
        activeModal: 'none',
        statusMessage: '魔王の涙石を手に入れた！ 最西端・星見観測所の保管庫を解錠しよう。',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 10, '魔王の記憶の答えが違うようだ（安定度 -10%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

// Ch 3 (Part 2): Relic Vault -> Sky Key -> East Gate -> Ch 4
export function submitVaultCode(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.vaultUnlocked) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.vaultDigits.every((d, i) => d === VAULT_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        vaultUnlocked: true,
        hasSkyKey: true,
        chapter: Math.max(state.chapter, 3),
        activeModal: 'none',
        statusMessage: '天空の鍵を獲得した！ 中央操縦室の東扉を開けよう。',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 10, '保管庫の番号が違うようだ（安定度 -10%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

export function unlockEastGate(state: GameState): {
  nextState: GameState;
  openedNow: boolean;
} {
  if (state.eastGateOpen || !state.hasSkyKey) {
    return { nextState: state, openedNow: false };
  }
  return {
    nextState: {
      ...state,
      eastGateOpen: true,
      chapter: Math.max(state.chapter, 4),
      statusMessage: '天空の鍵で東翼・動力制御室が開いた！（第4章へ）',
    },
    openedNow: true,
  };
}

// Ch 4 (Part 1): 4-Valve Propulsion Console -> Hangar Gate
export function stepValveLevel(
  state: GameState,
  index: 0 | 1 | 2 | 3,
  delta: 1 | -1,
): { nextState: GameState; alignedNow: boolean } {
  if (state.valvesAligned) {
    return { nextState: state, alignedNow: false };
  }
  const next: [number, number, number, number] = [...state.valveLevels] as [
    number,
    number,
    number,
    number,
  ];
  next[index] = (next[index] + delta + 8) % 8;
  const ok = next.every((v, i) => v === VALVE_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        valveLevels: next,
        valvesAligned: true,
        hangarGateOpen: true,
        chapter: Math.max(state.chapter, 4),
        activeModal: 'none',
        statusMessage: '4連バルブが共鳴し、奥東翼・深海格納庫が開いた！',
      },
      alignedNow: true,
    };
  }
  return {
    nextState: { ...state, valveLevels: next, statusMessage: '' },
    alignedNow: false,
  };
}

// Ch 4 (Part 2): Four-Direction Memory Compass
const CARDINALS = ['北', '東', '南', '西'] as const;

export function cycleCompassBearing(state: GameState, slot: 0 | 1 | 2 | 3): GameState {
  if (state.compassAligned) return state;
  const next: [string, string, string, string] = [...state.compassBearings] as [
    string,
    string,
    string,
    string,
  ];
  const curIdx = CARDINALS.indexOf(next[slot] as (typeof CARDINALS)[number]);
  next[slot] = CARDINALS[(curIdx + 1) % CARDINALS.length];
  return { ...state, compassBearings: next, statusMessage: '' };
}

export function submitCompassCalibration(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.compassAligned) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.compassBearings.every((b, i) => b === COMPASS_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        compassAligned: true,
        chapter: Math.max(state.chapter, 4),
        activeModal: 'none',
        statusMessage: '羅針盤が定まり、最東タービン区の深海反応炉が解除された！',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 10, '記憶と方位の組み合わせが違うようだ（安定度 -10%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

// Ch 4 (Part 3) -> Ch 5: Deep Sea Reactor -> Chinpo Submarina
export function submitReactorCode(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.reactorUnlocked || !state.compassAligned) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.reactorDigits.every((d, i) => d === REACTOR_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        reactorUnlocked: true,
        hasSubmarina: true,
        chapter: Math.max(state.chapter, 5),
        activeModal: 'none',
        statusMessage: 'チンポ・サブマリーナを獲得した！ 中央祭壇へ戻ろう！（第5章へ）',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 10, '反転暗号が反応炉と噛み合わない（安定度 -10%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

// Ch 5 (Part 1): Altar Resonance Ritual
export function setResonanceAnswer(state: GameState, slot: 0 | 1 | 2, value: string): GameState {
  if (state.altarFused) return state;
  const next: [string, string, string] = [...state.resonanceAnswers] as [string, string, string];
  next[slot] = value;
  return { ...state, resonanceAnswers: next, statusMessage: '' };
}

export function submitResonanceRitual(state: GameState): {
  nextState: GameState;
  fusedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.altarFused || !state.hasSkyKey || !state.hasSubmarina) {
    return { nextState: state, fusedNow: false, wrongAttempt: false };
  }
  const ok = state.resonanceAnswers.every((ans, i) => ans === RESONANCE_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        altarFused: true,
        chapter: Math.max(state.chapter, 5),
        activeModal: 'none',
        statusMessage: '猫型コアが覚醒し、リ・サーの魂が現れた！ 北の進化碑へ向かおう。',
      },
      fusedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 12, '共鳴の真実が違うようだ（安定度 -12%）'),
    fusedNow: false,
    wrongAttempt: true,
  };
}

// Ch 5 (Part 2) -> Ch 6: Twihai Evolution Trial
export function setEvolutionAnswer(state: GameState, slot: 0 | 1 | 2, value: string): GameState {
  if (state.hasTwihaiOath) return state;
  const next: [string, string, string] = [...state.evolutionAnswers] as [string, string, string];
  next[slot] = value;
  return { ...state, evolutionAnswers: next, statusMessage: '' };
}

export function submitEvolutionTrial(state: GameState): {
  nextState: GameState;
  evolvedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.hasTwihaiOath || !state.altarFused) {
    return { nextState: state, evolvedNow: false, wrongAttempt: false };
  }
  const ok = state.evolutionAnswers.every((ans, i) => ans === EVOLUTION_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        hasTwihaiOath: true,
        chapter: 6,
        activeModal: 'none',
        statusMessage: 'ツイ廃への進化を遂げた！ 最終封印を解き草原へ踏み出そう！（第6章）',
      },
      evolvedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 12, '進化の誓約が違うようだ（安定度 -12%）'),
    evolvedNow: false,
    wrongAttempt: true,
  };
}

// Ch 6: Finale Hatch Seal -> Grassland Victory
export function submitFinaleCode(state: GameState): {
  nextState: GameState;
  unlockedNow: boolean;
  wrongAttempt: boolean;
} {
  if (state.hatchOpen || !state.hasTwihaiOath) {
    return { nextState: state, unlockedNow: false, wrongAttempt: false };
  }
  const ok = state.finaleDigits.every((d, i) => d === FINALE_SOLUTION[i]);
  if (ok) {
    return {
      nextState: {
        ...state,
        hatchOpen: true,
        chapter: 6,
        activeModal: 'none',
        statusMessage: '青空への脱出ハッチが開いた！ 北の広大な草原へ踏み出そう！',
      },
      unlockedNow: true,
      wrongAttempt: false,
    };
  }
  return {
    nextState: applyWrongPenalty(state, 12, '最後の封印番号が違うようだ（安定度 -12%）'),
    unlockedNow: false,
    wrongAttempt: true,
  };
}

export function attemptEscapeHatch(state: GameState): {
  nextState: GameState;
  escapedNow: boolean;
} {
  if (!state.hatchOpen || state.phase !== 'playing') {
    return { nextState: state, escapedNow: false };
  }
  return {
    nextState: {
      ...state,
      phase: 'ending',
      endingStep: 0,
      activeModal: 'none',
      statusMessage: '',
    },
    escapedNow: true,
  };
}

export function advanceEndingStep(state: GameState): GameState {
  if (state.phase !== 'ending') return state;
  if (state.endingStep < 2) {
    return { ...state, endingStep: state.endingStep + 1 };
  }
  return {
    ...state,
    phase: 'gameover',
    endingStep: 2,
    outcome: 'victory',
    activeModal: 'none',
    statusMessage: '青空の草原へと脱出した！',
  };
}

export function skipEndingSequence(state: GameState): GameState {
  if (state.phase !== 'ending') return state;
  return {
    ...state,
    phase: 'gameover',
    endingStep: 2,
    outcome: 'victory',
    activeModal: 'none',
    statusMessage: '青空の草原へと脱出した！',
  };
}

export function stepGameTimer(state: GameState, dt: number): GameState {
  if (state.phase !== 'playing') return state;
  const clampedDt = Math.max(0, Math.min(dt, 1.0));
  const nextElapsed = state.elapsedTime + clampedDt;
  const nextRemaining = Math.max(0, state.timeRemaining - clampedDt);
  if (nextRemaining <= 0) {
    return {
      ...state,
      elapsedTime: nextElapsed,
      timeRemaining: 0,
      phase: 'gameover',
      outcome: 'defeat',
      activeModal: 'none',
      statusMessage: '一万年の崩壊が世界を飲み込んだ…',
    };
  }
  return {
    ...state,
    elapsedTime: nextElapsed,
    timeRemaining: nextRemaining,
  };
}

export function getCurrentObjective(state: GameState): string {
  if (!state.boundaryOpen) {
    return '【第1章】覚醒デッキと南バルコニーの記憶を辿り、境界扉を開く';
  }
  if (!state.westGateOpen) {
    return '【第1章】予言碑と書庫を読み、西翼ゲートを歴史順に並べる';
  }
  if (!state.hasAppleMemory) {
    return '【第2章】西翼温室の友情の記憶を辿り、追憶の小箱を開く';
  }
  if (!state.demonGateOpen) {
    return '【第2章】黒板と通学日誌を読み、奥西翼・魔王の聖域門を開く';
  }
  if (!state.hasDemonSeal) {
    return '【第3章】魔王への変貌の記憶を辿り、誓約台座を解く';
  }
  if (!state.hasSkyKey) {
    return '【第3章】最西・星見観測所の保管庫を解き、「天空の鍵」を入手する';
  }
  if (!state.eastGateOpen) {
    return '【第3章】中央操縦室の東側にある「天空の紋章扉」を天空の鍵で開く';
  }
  if (!state.hangarGateOpen) {
    return '【第4章】チンチン侍の方程式を解き、4連バルブを合わせる';
  }
  if (!state.compassAligned) {
    return '【第4章】奥東翼の記憶を辿り、四方位の記憶羅針盤を合わせる';
  }
  if (!state.hasSubmarina) {
    return '【第4章】最東タービン区の反応炉でチンポ・サブマリーナを解放する';
  }
  if (!state.altarFused) {
    return '【第5章】中央祭壇へ戻り、共鳴の試練で聖なる猫を覚醒させる';
  }
  if (!state.hasTwihaiOath) {
    return '【第5章】「進化の試練碑」でツイ廃への誓約を解く';
  }
  if (!state.hatchOpen) {
    return '【第6章】百年の記憶碑を読み、脱出ハッチの最終封印を解く';
  }
  return '【第6章】北側の脱出ハッチから青空と草原へ踏み出す';
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export interface AabbCollider {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  enabled?: boolean;
}

export function resolvePlayerMovement(
  currentX: number,
  currentZ: number,
  deltaX: number,
  deltaZ: number,
  radius: number,
  colliders: readonly AabbCollider[],
): { x: number; z: number } {
  let x = currentX + deltaX;
  let z = currentZ + deltaZ;

  for (let pass = 0; pass < 2; pass++) {
    for (const box of colliders) {
      if (box.enabled === false) continue;

      const closestX = Math.max(box.minX, Math.min(x, box.maxX));
      const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));

      const dx = x - closestX;
      const dz = z - closestZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < radius * radius) {
        if (distSq > 1e-8) {
          const dist = Math.sqrt(distSq);
          const overlap = radius - dist;
          x += (dx / dist) * overlap;
          z += (dz / dist) * overlap;
        } else {
          const penLeft = Math.abs(x - box.minX);
          const penRight = Math.abs(box.maxX - x);
          const penTop = Math.abs(z - box.minZ);
          const penBottom = Math.abs(box.maxZ - z);
          const minPen = Math.min(penLeft, penRight, penTop, penBottom);
          if (minPen === penLeft) x = box.minX - radius;
          else if (minPen === penRight) x = box.maxX + radius;
          else if (minPen === penTop) z = box.minZ - radius;
          else z = box.maxZ + radius;
        }
      }
    }
  }

  return { x, z };
}
