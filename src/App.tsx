import { useCallback, useEffect, useRef, useState } from 'react';
import {
  advanceEndingStep,
  advanceWakeupStep,
  attemptEscapeHatch,
  createInitialGameState,
  cycleCompassBearing,
  recordMemoryDiscovery,
  setDemonSealAnswer,
  setEvolutionAnswer,
  setResonanceAnswer,
  skipEndingSequence,
  skipWakeupSequence,
  stepFourDigit,
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
  unlockEastGate,
  type GameState,
} from './game/escapeLogic';
import {
  DIALOGUES,
  INTERACTABLE_META,
  MEMORY_CATALOG,
  type DialogueLine,
} from './game/storyData';
import { EscapeAudioEngine } from './game/audio';
import { ThreeEscapeScene, type MobileMoveVector } from './game/ThreeEscapeScene';
import { TitleOverlay } from './components/TitleOverlay';
import { WakeupOverlay } from './components/WakeupOverlay';
import { EndingOverlay } from './components/EndingOverlay';
import { GameHud } from './components/GameHud';
import { MobileControls } from './components/MobileControls';
import { PuzzleModals } from './components/PuzzleModals';
import { StatusModal } from './components/StatusModal';

function getInitialLaunchMode(): 'title' | 'wakeup' | 'playing' | 'ending' {
  if (typeof window === 'undefined') return 'title';
  const params = new URLSearchParams(window.location.search);
  if (params.get('ending') === '1') return 'ending';
  if (params.get('wakeup') === '1') return 'wakeup';
  if (params.get('autostart') === '1') return 'playing';
  return 'title';
}

function buildInitialAppState(): GameState {
  const mode = getInitialLaunchMode();
  if (mode === 'ending') {
    const base = createInitialGameState('playing');
    return {
      ...base,
      phase: 'ending',
      endingStep: 0,
      chapter: 6,
      altarFused: true,
      hasTwihaiOath: true,
      hatchOpen: true,
      elapsedTime: 762,
      timeRemaining: 1638,
    };
  }
  return createInitialGameState(mode);
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(buildInitialAppState);
  const [muted, setMuted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dialogueQueue, setDialogueQueue] = useState<DialogueLine[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [resetToken, setResetToken] = useState(0);

  const mobileMoveRef = useRef<MobileMoveVector>({ fwd: 0, side: 0 });
  const audioRef = useRef<EscapeAudioEngine | null>(null);
  if (!audioRef.current) {
    audioRef.current = new EscapeAudioEngine();
  }

  useEffect(() => {
    document.body.dataset.state = gameState.phase;
    const isPlaying = gameState.phase === 'playing';
    audioRef.current?.setAmbientActive(isPlaying);
    if (!isPlaying) {
      document.exitPointerLock?.();
      mobileMoveRef.current = { fwd: 0, side: 0 };
    }
  }, [gameState.phase]);

  useEffect(() => {
    const unlock = () => {
      audioRef.current?.unlockFromGesture();
      if (document.body.dataset.state === 'playing') {
        audioRef.current?.setAmbientActive(true);
      }
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      audioRef.current?.dispose();
    };
  }, []);

  const openDialogue = useCallback((lines: DialogueLine[]) => {
    setDialogueQueue(lines);
    setDialogueIndex(0);
  }, []);

  const startGame = useCallback((showWakeup = true) => {
    audioRef.current?.playClick();
    setResetToken((n) => n + 1);
    setHoveredId(null);
    mobileMoveRef.current = { fwd: 0, side: 0 };
    setDialogueQueue([]);
    setDialogueIndex(0);
    setGameState(createInitialGameState(showWakeup ? 'wakeup' : 'playing'));
  }, []);

  const handleAdvanceWakeup = useCallback(() => {
    audioRef.current?.playDialogueBlip('regina');
    setGameState((prev) => advanceWakeupStep(prev));
  }, []);

  const handleSkipWakeup = useCallback(() => {
    audioRef.current?.playClick();
    setGameState((prev) => skipWakeupSequence(prev));
  }, []);

  const handleAdvanceEnding = useCallback(() => {
    setGameState((prev) => {
      if (prev.phase !== 'ending') return prev;
      if (prev.endingStep === 0) {
        audioRef.current?.playDialogueBlip('protagonist');
      } else if (prev.endingStep === 1) {
        audioRef.current?.playDialogueBlip('regina');
      } else {
        audioRef.current?.playVictory();
      }
      return advanceEndingStep(prev);
    });
  }, []);

  const handleSkipEnding = useCallback(() => {
    setGameState((prev) => {
      if (prev.phase !== 'ending') return prev;
      audioRef.current?.playVictory();
      return skipEndingSequence(prev);
    });
  }, []);

  const restartGame = useCallback(() => {
    startGame(false);
  }, [startGame]);

  const returnToTitle = useCallback(() => {
    audioRef.current?.playClick();
    setDialogueQueue([]);
    setDialogueIndex(0);
    setHoveredId(null);
    mobileMoveRef.current = { fwd: 0, side: 0 };
    setResetToken((n) => n + 1);
    setGameState(createInitialGameState('title'));
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      audioRef.current?.setMuted(next);
      return next;
    });
  }, []);

  const pauseGame = useCallback(() => {
    audioRef.current?.playPauseToggle(true);
    setGameState((prev) =>
      prev.phase === 'playing' ? { ...prev, phase: 'paused', activeModal: 'none' } : prev,
    );
  }, []);

  const resumeGame = useCallback(() => {
    audioRef.current?.playPauseToggle(false);
    setGameState((prev) =>
      prev.phase === 'paused' ? { ...prev, phase: 'playing' } : prev,
    );
  }, []);

  const toggleNotebook = useCallback(() => {
    setGameState((prev) => {
      if (prev.phase !== 'playing') return prev;
      const opening = prev.activeModal !== 'notebook';
      audioRef.current?.playNotebookToggle(opening);
      return {
        ...prev,
        activeModal: opening ? 'notebook' : 'none',
        statusMessage: '',
      };
    });
  }, []);

  const advanceDialogue = useCallback(() => {
    const speaker = dialogueQueue[dialogueIndex + 1]?.speaker ?? dialogueQueue[dialogueIndex]?.speaker;
    audioRef.current?.playDialogueBlip(speaker);
    setDialogueIndex((idx) => {
      if (idx + 1 < dialogueQueue.length) {
        return idx + 1;
      }
      setDialogueQueue([]);
      return 0;
    });
  }, [dialogueIndex, dialogueQueue]);

  const skipDialogue = useCallback(() => {
    audioRef.current?.playClick();
    setDialogueQueue([]);
    setDialogueIndex(0);
  }, []);

  const handleInteract = useCallback(
    (id: string) => {
      const st = gameState;
      if (st.phase !== 'playing') return;

      const recordIfCatalog = () => {
        if (MEMORY_CATALOG[id]) {
          setGameState((prev) => recordMemoryDiscovery(prev, id));
        }
      };

      switch (id) {
        // Pure lore / clue objects across all 6 chapters
        case 'salaryman_desk':
        case 'overtime_drawer':
        case 'rooftop_fence':
        case 'sky_sketch':
        case 'prophecy_stele':
        case 'history_bookshelf':
        case 'war_chronicle_desk':
        case 'myth_globe':
        case 'apple_tree':
        case 'friend_table':
        case 'basket_plate':
        case 'withered_flower_pot':
        case 'chalkboard':
        case 'apprentice_bed':
        case 'age_ledger':
        case 'village_rumor_board':
        case 'twilight_mirror':
        case 'demon_throne':
        case 'twitter_census_pillar':
        case 'star_observatory_desk':
        case 'chinchin_samurai':
        case 'determination_window':
        case 'tsukkomi_scroll':
        case 'dark_monitor_shrine':
        case 'warm_breeze_duct':
        case 'submarina_blueprint':
        case 'final_monument': {
          audioRef.current?.playDiscovery();
          recordIfCatalog();
          openDialogue(DIALOGUES[id]);
          break;
        }

        // Ch 1 Gate 1: Boundary Door
        case 'boundary_door': {
          if (st.boundaryOpen) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.boundary_unlocked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'boundary', statusMessage: '' }));
          }
          break;
        }

        // Ch 1 Gate 2: West Gate
        case 'west_gate': {
          if (st.westGateOpen) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.west_gate_unlocked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'timeline', statusMessage: '' }));
          }
          break;
        }

        // Ch 2 Lockbox
        case 'greenhouse_lock': {
          if (st.hasAppleMemory) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.greenhouse_unlocked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'greenhouse', statusMessage: '' }));
          }
          break;
        }

        // Ch 2 Gate: Demon Sanctum Gate
        case 'demon_gate': {
          if (st.demonGateOpen) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.demon_gate_unlocked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'apprentice', statusMessage: '' }));
          }
          break;
        }

        // Ch 3 Demon Seal
        case 'demon_seal_pedestal': {
          if (st.hasDemonSeal) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.demon_seal_unlocked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'demon_seal', statusMessage: '' }));
          }
          break;
        }

        // Zone F North Spot: Readable once Chapter 5 is reached
        case 'ch5_oracle_stele': {
          if (st.chapter >= 5) {
            audioRef.current?.playDiscovery();
            openDialogue(DIALOGUES.ch5_oracle_unlocked);
          } else {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.ch5_oracle_locked);
          }
          break;
        }

        // Ch 3 Sky Key Vault
        case 'relic_vault': {
          if (st.vaultUnlocked) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.vault_unlocked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'vault', statusMessage: '' }));
          }
          break;
        }

        // Ch 3 -> Ch 4 East Gate
        case 'east_gate': {
          if (st.eastGateOpen) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.east_gate_unlocked);
          } else if (st.hasSkyKey) {
            const res = unlockEastGate(st);
            if (res.openedNow) {
              audioRef.current?.playUnlock();
              audioRef.current?.playDoorSlide();
              setGameState(res.nextState);
              openDialogue(DIALOGUES.east_gate_unlocked);
            }
          } else {
            audioRef.current?.playError();
            setGameState((prev) => ({
              ...prev,
              statusMessage: '東翼の紋章扉は「天空の鍵」がなければ開かない。',
            }));
          }
          break;
        }

        // Ch 4 Valve Console & Hangar Gate
        case 'valve_console': {
          if (st.valvesAligned) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.hangar_gate_unlocked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'valves', statusMessage: '' }));
          }
          break;
        }
        case 'hangar_gate': {
          audioRef.current?.playClick();
          openDialogue(st.hangarGateOpen ? DIALOGUES.hangar_gate_unlocked : DIALOGUES.hangar_gate_locked);
          break;
        }

        // Ch 4 Compass
        case 'compass_calibrator': {
          if (st.compassAligned) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.compass_unlocked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'compass', statusMessage: '' }));
          }
          break;
        }

        // Ch 4 -> Ch 5 Reactor & Submarina Dock
        case 'ether_reactor_core': {
          recordIfCatalog();
          if (st.reactorUnlocked) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.reactor_unlocked);
          } else if (!st.compassAligned) {
            audioRef.current?.playError();
            openDialogue(DIALOGUES.ether_reactor_locked_hint);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'reactor', statusMessage: '' }));
          }
          break;
        }
        case 'submarina_dock': {
          audioRef.current?.playDiscovery();
          openDialogue(st.hasSubmarina ? DIALOGUES.reactor_unlocked : DIALOGUES.submarina_locked);
          break;
        }

        // Ch 5 Altar Resonance
        case 'altar': {
          recordIfCatalog();
          if (st.altarFused) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.altar_fusion);
          } else if (!st.hasSkyKey || !st.hasSubmarina) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.altar_incomplete);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'resonance', statusMessage: '' }));
          }
          break;
        }

        // Ch 5 -> Ch 6 Evolution Pillar
        case 'evolution_pillar': {
          recordIfCatalog();
          if (st.hasTwihaiOath) {
            audioRef.current?.playClick();
            openDialogue(DIALOGUES.evolution_unlocked);
          } else if (!st.altarFused) {
            audioRef.current?.playError();
            openDialogue(DIALOGUES.evolution_pillar_locked);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'evolution', statusMessage: '' }));
          }
          break;
        }

        // Ch 6 Escape Hatch
        case 'escape_hatch': {
          recordIfCatalog();
          if (st.hatchOpen) {
            const esc = attemptEscapeHatch(st);
            if (esc.escapedNow) {
              audioRef.current?.playDialogueBlip('regina');
              setGameState(esc.nextState);
            }
          } else if (!st.hasTwihaiOath) {
            audioRef.current?.playError();
            openDialogue(DIALOGUES.hatch_locked_early);
          } else {
            audioRef.current?.playClick();
            setGameState((prev) => ({ ...prev, activeModal: 'finale_seal', statusMessage: '' }));
          }
          break;
        }
      }
    },
    [gameState, openDialogue],
  );

  const handleAutoEscape = useCallback(() => {
    setGameState((prev) => {
      const esc = attemptEscapeHatch(prev);
      if (esc.escapedNow) {
        audioRef.current?.playDialogueBlip('regina');
        return esc.nextState;
      }
      return prev;
    });
  }, []);

  const handleTickTimer = useCallback((dt: number) => {
    setGameState((prev) => {
      const next = stepGameTimer(prev, dt);
      if (prev.phase === 'playing' && next.phase === 'gameover' && next.outcome === 'defeat') {
        audioRef.current?.playDefeat();
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (gameState.phase !== 'playing') return;
    let lastMs = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min((now - lastMs) / 1000, 1.0);
      lastMs = now;
      handleTickTimer(dt);
    }, 250);
    return () => window.clearInterval(id);
  }, [gameState.phase, handleTickTimer]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState.phase === 'title') {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          startGame(true);
        }
        return;
      }

      if (gameState.phase === 'wakeup') {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleAdvanceWakeup();
        } else if (e.code === 'Escape') {
          e.preventDefault();
          handleSkipWakeup();
        }
        return;
      }

      if (gameState.phase === 'ending') {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleAdvanceEnding();
        } else if (e.code === 'Escape') {
          e.preventDefault();
          handleSkipEnding();
        }
        return;
      }

      if (gameState.phase === 'paused') {
        if (e.code === 'Escape' || e.code === 'KeyP') {
          e.preventDefault();
          resumeGame();
        }
        return;
      }

      if (gameState.phase === 'playing') {
        if (dialogueQueue.length > 0) {
          if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            advanceDialogue();
          } else if (e.code === 'Escape') {
            e.preventDefault();
            skipDialogue();
          }
          return;
        }

        if (gameState.activeModal !== 'none') {
          if (
            e.code === 'Escape' ||
            (gameState.activeModal === 'notebook' && (e.code === 'KeyN' || e.code === 'Tab'))
          ) {
            e.preventDefault();
            setGameState((prev) => ({ ...prev, activeModal: 'none', statusMessage: '' }));
          }
          return;
        }

        if (e.code === 'KeyN' || e.code === 'Tab') {
          e.preventDefault();
          toggleNotebook();
        } else if (e.code === 'Escape' || e.code === 'KeyP') {
          e.preventDefault();
          pauseGame();
        } else if (e.code === 'KeyM') {
          e.preventDefault();
          toggleMute();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          restartGame();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    advanceDialogue,
    dialogueQueue.length,
    gameState.activeModal,
    gameState.phase,
    handleAdvanceEnding,
    handleAdvanceWakeup,
    handleSkipEnding,
    handleSkipWakeup,
    pauseGame,
    restartGame,
    resumeGame,
    skipDialogue,
    startGame,
    toggleMute,
    toggleNotebook,
  ]);

  const handleOutcomeSound = useCallback(
    (unlocked: boolean, wrong: boolean, outcome: GameState['outcome']) => {
      if (unlocked) {
        audioRef.current?.playUnlock();
      } else if (wrong) {
        if (outcome === 'defeat') {
          audioRef.current?.playDefeat();
        } else {
          audioRef.current?.playError();
        }
      }
    },
    [],
  );

  const handleStepDigit = useCallback(
    (
      target: 'boundary' | 'greenhouse' | 'apprentice' | 'vault' | 'reactor' | 'finale',
      idx: 0 | 1 | 2 | 3,
      delta: 1 | -1,
    ) => {
      audioRef.current?.playDialTick(delta);
      setGameState((prev) => {
        switch (target) {
          case 'boundary':
            return { ...prev, boundaryDigits: stepFourDigit(prev.boundaryDigits, idx, delta) };
          case 'greenhouse':
            return { ...prev, greenhouseDigits: stepFourDigit(prev.greenhouseDigits, idx, delta) };
          case 'apprentice':
            return { ...prev, apprenticeDigits: stepFourDigit(prev.apprenticeDigits, idx, delta) };
          case 'vault':
            return { ...prev, vaultDigits: stepFourDigit(prev.vaultDigits, idx, delta) };
          case 'reactor':
            return { ...prev, reactorDigits: stepFourDigit(prev.reactorDigits, idx, delta) };
          case 'finale':
            return { ...prev, finaleDigits: stepFourDigit(prev.finaleDigits, idx, delta) };
        }
      });
    },
    [],
  );

  const handleSubmitBoundary = useCallback(() => {
    setGameState((prev) => {
      const res = submitBoundaryCode(prev);
      handleOutcomeSound(res.unlockedNow, res.wrongAttempt, res.nextState.outcome);
      if (res.unlockedNow) {
        audioRef.current?.playDoorSlide();
        openDialogue(DIALOGUES.boundary_unlocked);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSwapTimeline = useCallback((idxA: number, idxB: number) => {
    audioRef.current?.playDialTick(idxB < idxA ? 1 : -1);
    setGameState((prev) => swapTimelineItems(prev, idxA, idxB));
  }, []);

  const handleSubmitTimeline = useCallback(() => {
    setGameState((prev) => {
      const res = submitTimelineOrder(prev);
      handleOutcomeSound(res.unlockedNow, res.wrongAttempt, res.nextState.outcome);
      if (res.unlockedNow) {
        audioRef.current?.playDoorSlide();
        openDialogue(DIALOGUES.west_gate_unlocked);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSubmitGreenhouse = useCallback(() => {
    setGameState((prev) => {
      const res = submitGreenhouseCode(prev);
      handleOutcomeSound(res.unlockedNow, res.wrongAttempt, res.nextState.outcome);
      if (res.unlockedNow) {
        audioRef.current?.playLockboxOpen();
        openDialogue(DIALOGUES.greenhouse_unlocked);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSubmitApprentice = useCallback(() => {
    setGameState((prev) => {
      const res = submitApprenticeCode(prev);
      handleOutcomeSound(res.unlockedNow, res.wrongAttempt, res.nextState.outcome);
      if (res.unlockedNow) {
        audioRef.current?.playDoorSlide();
        openDialogue(DIALOGUES.demon_gate_unlocked);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSelectDemonSeal = useCallback((slot: 0 | 1 | 2, value: string) => {
    audioRef.current?.playDialTick(1);
    setGameState((prev) => setDemonSealAnswer(prev, slot, value));
  }, []);

  const handleSubmitDemonSeal = useCallback(() => {
    setGameState((prev) => {
      const res = submitDemonSeal(prev);
      handleOutcomeSound(res.unlockedNow, res.wrongAttempt, res.nextState.outcome);
      if (res.unlockedNow) {
        audioRef.current?.playLockboxOpen();
        openDialogue(DIALOGUES.demon_seal_unlocked);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSubmitVault = useCallback(() => {
    setGameState((prev) => {
      const res = submitVaultCode(prev);
      handleOutcomeSound(res.unlockedNow, res.wrongAttempt, res.nextState.outcome);
      if (res.unlockedNow) {
        audioRef.current?.playLockboxOpen();
        openDialogue(DIALOGUES.vault_unlocked);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleStepValve = useCallback(
    (idx: 0 | 1 | 2 | 3, delta: 1 | -1) => {
      setGameState((prev) => {
        const res = stepValveLevel(prev, idx, delta);
        if (res.alignedNow) {
          audioRef.current?.playUnlock();
          audioRef.current?.playDoorSlide();
          openDialogue(DIALOGUES.hangar_gate_unlocked);
        } else {
          audioRef.current?.playDialTick(delta);
        }
        return res.nextState;
      });
    },
    [openDialogue],
  );

  const handleCycleCompass = useCallback((slot: 0 | 1 | 2 | 3) => {
    audioRef.current?.playDialTick(1);
    setGameState((prev) => cycleCompassBearing(prev, slot));
  }, []);

  const handleSubmitCompass = useCallback(() => {
    setGameState((prev) => {
      const res = submitCompassCalibration(prev);
      handleOutcomeSound(res.unlockedNow, res.wrongAttempt, res.nextState.outcome);
      if (res.unlockedNow) openDialogue(DIALOGUES.compass_unlocked);
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSubmitReactor = useCallback(() => {
    setGameState((prev) => {
      const res = submitReactorCode(prev);
      handleOutcomeSound(res.unlockedNow, res.wrongAttempt, res.nextState.outcome);
      if (res.unlockedNow) {
        audioRef.current?.playLockboxOpen();
        openDialogue(DIALOGUES.reactor_unlocked);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSelectResonance = useCallback((slot: 0 | 1 | 2, value: string) => {
    audioRef.current?.playDialTick(1);
    setGameState((prev) => setResonanceAnswer(prev, slot, value));
  }, []);

  const handleSubmitResonance = useCallback(() => {
    setGameState((prev) => {
      const res = submitResonanceRitual(prev);
      if (res.fusedNow) {
        audioRef.current?.playFusionFanfare();
        openDialogue(DIALOGUES.altar_fusion);
      } else if (res.wrongAttempt) {
        handleOutcomeSound(false, true, res.nextState.outcome);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSelectEvolution = useCallback((slot: 0 | 1 | 2, value: string) => {
    audioRef.current?.playDialTick(1);
    setGameState((prev) => setEvolutionAnswer(prev, slot, value));
  }, []);

  const handleSubmitEvolution = useCallback(() => {
    setGameState((prev) => {
      const res = submitEvolutionTrial(prev);
      if (res.evolvedNow) {
        audioRef.current?.playLockboxOpen();
        openDialogue(DIALOGUES.evolution_unlocked);
      } else if (res.wrongAttempt) {
        handleOutcomeSound(false, true, res.nextState.outcome);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleSubmitFinale = useCallback(() => {
    setGameState((prev) => {
      const res = submitFinaleCode(prev);
      if (res.unlockedNow) {
        audioRef.current?.playFusionFanfare();
        audioRef.current?.playDoorSlide();
        openDialogue(DIALOGUES.hatch_unlocked);
      } else if (res.wrongAttempt) {
        handleOutcomeSound(false, true, res.nextState.outcome);
      }
      return res.nextState;
    });
  }, [handleOutcomeSound, openDialogue]);

  const handleHoverChange = useCallback((id: string | null) => {
    setHoveredId((prev) => {
      if (id && id !== prev) {
        audioRef.current?.playHoverTarget();
      }
      return id;
    });
  }, []);

  const canTouchPlay =
    gameState.phase === 'playing' &&
    dialogueQueue.length === 0 &&
    gameState.activeModal === 'none';

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0b1322] select-none">
      <ThreeEscapeScene
        gameState={gameState}
        isDialogueOpen={dialogueQueue.length > 0}
        resetToken={resetToken}
        mobileMoveRef={mobileMoveRef}
        onInteract={handleInteract}
        onHoverChange={handleHoverChange}
        onStepDistance={(surface) => audioRef.current?.playFootstep(surface)}
        onAutoEscapeTrigger={handleAutoEscape}
      />

      {gameState.phase === 'title' && <TitleOverlay onStart={() => startGame(true)} />}

      {gameState.phase === 'wakeup' && (
        <WakeupOverlay
          wakeupStep={gameState.wakeupStep}
          onAdvance={handleAdvanceWakeup}
          onSkip={handleSkipWakeup}
        />
      )}

      {gameState.phase === 'ending' && (
        <EndingOverlay
          endingStep={gameState.endingStep}
          onAdvance={handleAdvanceEnding}
          onSkip={handleSkipEnding}
        />
      )}

      {gameState.phase === 'playing' && (
        <GameHud
          gameState={gameState}
          muted={muted}
          hoveredId={hoveredId}
          dialogueQueue={dialogueQueue}
          dialogueIndex={dialogueIndex}
          onAdvanceDialogue={advanceDialogue}
          onSkipDialogue={skipDialogue}
          onOpenNotebook={toggleNotebook}
          onToggleMute={toggleMute}
          onPause={pauseGame}
          onRestart={restartGame}
          onQuickInteract={() => {
            if (hoveredId) handleInteract(hoveredId);
          }}
        />
      )}

      {canTouchPlay && (
        <MobileControls
          mobileMoveRef={mobileMoveRef}
          canInteract={Boolean(hoveredId)}
          interactLabel={hoveredId ? INTERACTABLE_META[hoveredId]?.label ?? null : null}
          onInteract={() => {
            if (hoveredId) handleInteract(hoveredId);
          }}
        />
      )}

      {gameState.phase === 'playing' && (
        <PuzzleModals
          gameState={gameState}
          onStepDigit={handleStepDigit}
          onSubmitBoundary={handleSubmitBoundary}
          onSwapTimeline={handleSwapTimeline}
          onSubmitTimeline={handleSubmitTimeline}
          onSubmitGreenhouse={handleSubmitGreenhouse}
          onSubmitApprentice={handleSubmitApprentice}
          onSelectDemonSeal={handleSelectDemonSeal}
          onSubmitDemonSeal={handleSubmitDemonSeal}
          onSubmitVault={handleSubmitVault}
          onStepValve={handleStepValve}
          onCycleCompass={handleCycleCompass}
          onSubmitCompass={handleSubmitCompass}
          onSubmitReactor={handleSubmitReactor}
          onSelectResonance={handleSelectResonance}
          onSubmitResonance={handleSubmitResonance}
          onSelectEvolution={handleSelectEvolution}
          onSubmitEvolution={handleSubmitEvolution}
          onSubmitFinale={handleSubmitFinale}
          onCloseModal={() =>
            setGameState((prev) => ({ ...prev, activeModal: 'none', statusMessage: '' }))
          }
        />
      )}

      <StatusModal
        gameState={gameState}
        onResume={resumeGame}
        onRestart={restartGame}
        onReturnTitle={returnToTitle}
      />
    </main>
  );
}
