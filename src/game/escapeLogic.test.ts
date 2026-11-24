import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceEndingStep,
  advanceWakeupStep,
  attemptEscapeHatch,
  createInitialGameState,
  cycleCompassBearing,
  FINALE_SOLUTION,
  formatClock,
  getCurrentObjective,
  INITIAL_TIME_SECONDS,
  recordMemoryDiscovery,
  resolvePlayerMovement,
  setDemonSealAnswer,
  setEvolutionAnswer,
  setResonanceAnswer,
  skipEndingSequence,
  skipWakeupSequence,
  stepGameTimer,
  stepValveLevel,
  submitApprenticeCode,
  submitBoundaryCode,
  submitCompassCalibration,
  submitDemonSeal,
  submitEvolutionTrial,
  submitFinaleCode,
  submitGreenhouseCode,
  submitReactorCode,
  submitResonanceRitual,
  submitTimelineOrder,
  submitVaultCode,
  swapTimelineItems,
  TOTAL_CHAPTER_COUNT,
  TOTAL_MEMORY_COUNT,
  unlockEastGate,
} from './escapeLogic';
import {
  buildWorldColliders,
  INTERACTABLE_ANCHORS,
  PLAYER_RADIUS,
  PLAYER_SPAWN,
} from './worldLayout';
import {
  CHAPTER_TITLES,
  DIALOGUES,
  ENDING_SEQUENCE_STEPS,
  INTERACTABLE_META,
  MEMORY_CATALOG,
  WAKEUP_SEQUENCE_STEPS,
} from './storyData';

test('opening wakeup sequence progresses through all 4 beats, pauses timer, and supports skip', () => {
  let state = createInitialGameState('wakeup');
  assert.equal(state.phase, 'wakeup');
  assert.equal(state.wakeupStep, 0);
  assert.equal(WAKEUP_SEQUENCE_STEPS.length, 4);

  const frozen = stepGameTimer(state, 0.25);
  assert.equal(frozen.timeRemaining, state.timeRemaining);

  state = advanceWakeupStep(state);
  assert.equal(state.phase, 'wakeup');
  assert.equal(state.wakeupStep, 1);

  state = advanceWakeupStep(state);
  assert.equal(state.phase, 'wakeup');
  assert.equal(state.wakeupStep, 2);

  state = advanceWakeupStep(state);
  assert.equal(state.phase, 'wakeup');
  assert.equal(state.wakeupStep, 3);

  state = advanceWakeupStep(state);
  assert.equal(state.phase, 'playing');

  const skipped = skipWakeupSequence(createInitialGameState('wakeup'));
  assert.equal(skipped.phase, 'playing');
  assert.equal(skipped.wakeupStep, 3);
});

test('chapters 1 through 6 full puzzle progression without relays and stability penalties', () => {
  let state = createInitialGameState(true);
  assert.equal(INITIAL_TIME_SECONDS, 2400);
  assert.equal(formatClock(state.timeRemaining), '40:00');
  assert.equal(state.chapter, 1);
  assert.match(getCurrentObjective(state), /^【第1章】/);

  // Ch 1 Part 1: Boundary Gate [5,3,8,2]
  const wrongCh1 = submitBoundaryCode(state);
  assert.equal(wrongCh1.wrongAttempt, true);
  assert.equal(wrongCh1.nextState.stability, 90);
  state = { ...wrongCh1.nextState, boundaryDigits: [5, 3, 8, 2] };
  const p1 = submitBoundaryCode(state);
  assert.equal(p1.unlockedNow, true);
  assert.equal(p1.nextState.boundaryOpen, true);
  assert.equal(p1.nextState.chapter, 1);

  // Ch 1 Part 2 -> Ch 2: West Gate Timeline [0,1,2,3]
  state = p1.nextState;
  state = swapTimelineItems(state, 0, 1);
  state = swapTimelineItems(state, 1, 3);
  state = swapTimelineItems(state, 2, 3);
  const p2 = submitTimelineOrder(state);
  assert.equal(p2.unlockedNow, true);
  assert.equal(p2.nextState.westGateOpen, true);
  assert.equal(p2.nextState.chapter, 2);
  assert.match(getCurrentObjective(p2.nextState), /^【第2章】/);

  // Ch 2 Part 1: Apple Greenhouse [5,3,4,2]
  state = { ...p2.nextState, greenhouseDigits: [5, 3, 4, 2] };
  const p3 = submitGreenhouseCode(state);
  assert.equal(p3.unlockedNow, true);
  assert.equal(p3.nextState.hasAppleMemory, true);
  assert.equal(p3.nextState.chapter, 2);

  // Ch 2 Part 2 -> Ch 3: Apprentice Gate [1,2,6,8] -> Demon Gate Open
  state = { ...p3.nextState, apprenticeDigits: [1, 2, 6, 8] };
  const p4 = submitApprenticeCode(state);
  assert.equal(p4.unlockedNow, true);
  assert.equal(p4.nextState.demonGateOpen, true);
  assert.equal(p4.nextState.chapter, 3);
  assert.match(getCurrentObjective(p4.nextState), /^【第3章】/);

  // Ch 3 Part 1: Demon Seal 3-part trial
  state = p4.nextState;
  state = setDemonSealAnswer(state, 0, '怒らず笑い、研究を続けた');
  state = setDemonSealAnswer(state, 1, '誰も死なないよう自分が世界を管理する');
  state = setDemonSealAnswer(state, 2, '人間への歪んだ優しさ');
  const p5 = submitDemonSeal(state);
  assert.equal(p5.unlockedNow, true);
  assert.equal(p5.nextState.hasDemonSeal, true);
  assert.equal(p5.nextState.chapter, 3);

  // Ch 3 Part 2 -> Ch 4: Relic Vault [4,3,8,1] -> Sky Key + East Gate
  state = { ...p5.nextState, vaultDigits: [4, 3, 8, 1] };
  const p6 = submitVaultCode(state);
  assert.equal(p6.unlockedNow, true);
  assert.equal(p6.nextState.hasSkyKey, true);
  assert.equal(p6.nextState.chapter, 3);

  const eastOpened = unlockEastGate(p6.nextState);
  assert.equal(eastOpened.openedNow, true);
  assert.equal(eastOpened.nextState.eastGateOpen, true);
  assert.equal(eastOpened.nextState.chapter, 4);
  assert.match(getCurrentObjective(eastOpened.nextState), /^【第4章】/);

  // Ch 4 Part 1: 4-Valve Console [6,3,7,2] -> Hangar Gate Open
  state = { ...eastOpened.nextState, valveLevels: [6, 3, 7, 1] };
  const p7 = stepValveLevel(state, 3, 1);
  assert.equal(p7.alignedNow, true);
  assert.equal(p7.nextState.valvesAligned, true);
  assert.equal(p7.nextState.hangarGateOpen, true);
  assert.equal(p7.nextState.chapter, 4);

  // Ch 4 Part 2: 4-Bearing Compass ['南','西','東','北']
  state = p7.nextState;
  state = cycleCompassBearing(state, 0);
  state = cycleCompassBearing(state, 0);
  state = cycleCompassBearing(state, 1);
  state = cycleCompassBearing(state, 1);
  state = cycleCompassBearing(state, 2);
  state = cycleCompassBearing(state, 2);
  state = cycleCompassBearing(state, 2);
  state = cycleCompassBearing(state, 3);
  const p8 = submitCompassCalibration(state);
  assert.equal(p8.unlockedNow, true);
  assert.equal(p8.nextState.compassAligned, true);
  assert.equal(p8.nextState.chapter, 4);

  // Ch 4 Part 3 -> Ch 5: Deep Sea Reactor [1,8,3,4] -> Chinpo Submarina
  state = { ...p8.nextState, reactorDigits: [1, 8, 3, 4] };
  const p9 = submitReactorCode(state);
  assert.equal(p9.unlockedNow, true);
  assert.equal(p9.nextState.hasSubmarina, true);
  assert.equal(p9.nextState.chapter, 5);
  assert.match(getCurrentObjective(p9.nextState), /^【第5章】/);

  // Ch 5 Part 1: Central Altar Resonance
  state = p9.nextState;
  state = setResonanceAnswer(state, 0, '猫');
  state = setResonanceAnswer(state, 1, '初めまして。母親によく似てるな');
  state = setResonanceAnswer(state, 2, 'これでいい。');
  const p10 = submitResonanceRitual(state);
  assert.equal(p10.fusedNow, true);
  assert.equal(p10.nextState.altarFused, true);
  assert.equal(p10.nextState.chapter, 5);

  // Ch 5 Part 2 -> Ch 6: Twihai Evolution Trial
  state = p10.nextState;
  state = setEvolutionAnswer(state, 0, 'ツイ廃');
  state = setEvolutionAnswer(state, 1, '約100年');
  state = setEvolutionAnswer(state, 2, '主人公と同じ時間を生きること');
  const p11 = submitEvolutionTrial(state);
  assert.equal(p11.evolvedNow, true);
  assert.equal(p11.nextState.hasTwihaiOath, true);
  assert.equal(p11.nextState.chapter, 6);
  assert.match(getCurrentObjective(p11.nextState), /^【第6章】/);

  // Ch 6: Finale Hatch Seal [6,1,3,1] (old [1,4,1,1] rejected) -> Hatch Open -> Ending -> Victory
  assert.deepEqual([...FINALE_SOLUTION], [6, 1, 3, 1]);
  const wrongFinale = submitFinaleCode({ ...p11.nextState, finaleDigits: [1, 4, 1, 1] });
  assert.equal(wrongFinale.wrongAttempt, true);
  assert.equal(wrongFinale.unlockedNow, false);

  state = { ...wrongFinale.nextState, finaleDigits: [6, 1, 3, 1] };
  const p12 = submitFinaleCode(state);
  assert.equal(p12.unlockedNow, true);
  assert.equal(p12.nextState.hatchOpen, true);
  assert.match(getCurrentObjective(p12.nextState), /青空と草原へ/);

  const enteredEnding = attemptEscapeHatch(p12.nextState);
  assert.equal(enteredEnding.escapedNow, true);
  assert.equal(enteredEnding.nextState.phase, 'ending');
  assert.equal(enteredEnding.nextState.endingStep, 0);
  assert.equal(ENDING_SEQUENCE_STEPS.length, 3);

  // Timer freezes during ending cutscene
  const frozenEnding = stepGameTimer(enteredEnding.nextState, 0.5);
  assert.equal(frozenEnding.timeRemaining, enteredEnding.nextState.timeRemaining);

  let endState = advanceEndingStep(enteredEnding.nextState);
  assert.equal(endState.phase, 'ending');
  assert.equal(endState.endingStep, 1);

  endState = advanceEndingStep(endState);
  assert.equal(endState.phase, 'ending');
  assert.equal(endState.endingStep, 2);

  endState = advanceEndingStep(endState);
  assert.equal(endState.phase, 'gameover');
  assert.equal(endState.outcome, 'victory');

  const skippedVictory = skipEndingSequence(enteredEnding.nextState);
  assert.equal(skippedVictory.phase, 'gameover');
  assert.equal(skippedVictory.outcome, 'victory');
});

test('story is consolidated into 6 chapters with 24 memories and zero 【】 giveaway hints', () => {
  assert.equal(Object.keys(CHAPTER_TITLES).length, TOTAL_CHAPTER_COUNT);
  assert.equal(TOTAL_CHAPTER_COUNT, 6);

  const keys = Object.keys(MEMORY_CATALOG);
  assert.equal(keys.length, TOTAL_MEMORY_COUNT);
  assert.equal(TOTAL_MEMORY_COUNT, 24);

  for (const note of Object.values(MEMORY_CATALOG)) {
    assert.ok(note.chapter >= 1 && note.chapter <= 6, `Memory ${note.id} has invalid chapter ${note.chapter}`);
    assert.ok(!note.summary.includes('【') && !note.summary.includes('】'), `Giveaway bracket found in ${note.id}`);
    assert.ok(!note.summary.includes('労働') && !note.summary.includes('二桁'), `Old wording found in memory ${note.id}`);
  }
  for (const meta of Object.values(INTERACTABLE_META)) {
    assert.ok(meta.chapter >= 1 && meta.chapter <= 6, `Interactable ${meta.id} has invalid chapter ${meta.chapter}`);
    assert.ok(!meta.id.includes('_relay_'), `Relay interactable should be removed: ${meta.id}`);
  }
  for (const [id, lines] of Object.entries(DIALOGUES)) {
    assert.ok(!id.includes('_relay_'), `Relay dialogue should be removed: ${id}`);
    for (const line of lines) {
      assert.ok(!line.text.includes('【') && !line.text.includes('】'), `Giveaway bracket found in dialogue ${id}`);
      assert.ok(!line.text.includes('労働') && !line.text.includes('二桁'), `Old wording found in dialogue ${id}`);
    }
  }

  assert.ok(
    MEMORY_CATALOG.star_observatory_desk.summary.includes('少年の齢を成す十の位の数と一の位の数を足した数'),
  );
  assert.ok(
    DIALOGUES.star_observatory_desk[0].text.includes('少年の齢を成す十の位の数と一の位の数を足した数'),
  );
  assert.ok(INTERACTABLE_META.ch5_oracle_stele);
  assert.ok(DIALOGUES.ch5_oracle_locked.length === 1);
  assert.ok(DIALOGUES.ch5_oracle_unlocked.length === 2);
  for (const line of DIALOGUES.ch5_oracle_unlocked) {
    assert.ok(!line.text.includes('「') && !line.text.includes('」'), `Unexpected bracket in ch5_oracle_unlocked: ${line.text}`);
  }
  assert.ok(MEMORY_CATALOG.final_monument.summary.includes('ドアの数'));
  assert.ok(MEMORY_CATALOG.final_monument.summary.includes('Twitter人の数'));
  assert.ok(MEMORY_CATALOG.final_monument.summary.includes('リボンの数'));
  assert.ok(MEMORY_CATALOG.final_monument.summary.includes('雲の数'));
  assert.ok(DIALOGUES.final_monument[0].text.includes('ドアの数'));
  assert.ok(DIALOGUES.final_monument[0].text.includes('リボンの数'));

  let state = createInitialGameState(true);
  state = recordMemoryDiscovery(state, 'salaryman_desk');
  state = recordMemoryDiscovery(state, 'salaryman_desk');
  state = recordMemoryDiscovery(state, 'apple_tree');
  assert.equal(state.discoveredMemories.length, 2);

  // Timer ticks continuously while playing, even with modals/notebook open
  const playingWithModal = { ...state, activeModal: 'notebook' as const };
  const tickedModal = stepGameTimer(playingWithModal, 0.5);
  assert.equal(tickedModal.timeRemaining, state.timeRemaining - 0.5);
  assert.equal(tickedModal.elapsedTime, state.elapsedTime + 0.5);

  // Timer freezes ONLY when paused (or outside playing phase)
  const pausedState = { ...state, phase: 'paused' as const };
  const frozenPaused = stepGameTimer(pausedState, 0.5);
  assert.equal(frozenPaused.timeRemaining, pausedState.timeRemaining);
});

test('world colliders block closed gates and allow traversal across all 11 expanded zones without relays', () => {
  assert.equal(INTERACTABLE_ANCHORS.length, 43);

  const closedColliders = buildWorldColliders({
    boundaryOpen: false,
    westGateOpen: false,
    demonGateOpen: false,
    eastGateOpen: false,
    hangarGateOpen: false,
    hatchOpen: false,
  });

  // Walk North -> blocked at Boundary Door (z = 8.5)
  let pos = { x: PLAYER_SPAWN.x, z: PLAYER_SPAWN.z };
  for (let i = 0; i < 40; i++) {
    pos = resolvePlayerMovement(pos.x, pos.z, 0, -0.25, PLAYER_RADIUS, closedColliders);
  }
  assert.ok(pos.z >= 8.75, `Blocked at boundary door, got z=${pos.z}`);

  // Walk South from Awakening Deck (z=14.4) through open archway (z=16.5) into Zone H South Balcony (z=22+)
  pos = { x: PLAYER_SPAWN.x, z: PLAYER_SPAWN.z };
  for (let i = 0; i < 40; i++) {
    pos = resolvePlayerMovement(pos.x, pos.z, 0, 0.25, PLAYER_RADIUS, closedColliders);
  }
  assert.ok(pos.z > 21.0, `Entered South Balcony Zone H cleanly, got z=${pos.z}`);

  const openColliders = buildWorldColliders({
    boundaryOpen: true,
    westGateOpen: true,
    demonGateOpen: true,
    eastGateOpen: true,
    hangarGateOpen: true,
    hatchOpen: true,
  });

  // Walk West along z=0 corridor through all doorways all the way to Zone I outer wall (-41.5)
  pos = { x: -2.0, z: 0 };
  for (let i = 0; i < 180; i++) {
    pos = resolvePlayerMovement(pos.x, pos.z, -0.25, 0, PLAYER_RADIUS, openColliders);
  }
  assert.ok(pos.x < -40.0, `Reached Outer-West end wall in Zone I cleanly, got x=${pos.x}`);

  // Walk East along z=0 corridor through all doorways all the way to Zone J outer wall (+41.5)
  pos = { x: 2.0, z: 0 };
  for (let i = 0; i < 180; i++) {
    pos = resolvePlayerMovement(pos.x, pos.z, 0.25, 0, PLAYER_RADIUS, openColliders);
  }
  assert.ok(pos.x > 40.0, `Reached Outer-East end wall in Zone J cleanly, got x=${pos.x}`);

  // Walk North from Atrium (x=0,z=-6) through open Hatch into expanded North Sky Terrace Zone E (z < -18)
  pos = { x: 0, z: -6.0 };
  for (let i = 0; i < 60; i++) {
    pos = resolvePlayerMovement(pos.x, pos.z, 0, -0.25, PLAYER_RADIUS, openColliders);
  }
  assert.ok(pos.z < -18.0, `Entered expanded North Sky Terrace Zone E cleanly, got z=${pos.z}`);
});
