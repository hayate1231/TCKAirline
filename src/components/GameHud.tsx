import {
  formatClock,
  getCurrentObjective,
  TOTAL_MEMORY_COUNT,
  type GameState,
} from '../game/escapeLogic';
import { CHAPTER_TITLES, INTERACTABLE_META, SPEAKER_STYLES, type DialogueLine } from '../game/storyData';
import {
  AppleMemoryIcon,
  MuteIcon,
  NotebookIcon,
  PauseIcon,
  RestartIcon,
  SkyKeyIcon,
  SubmarinaIcon,
} from './GameIcons';

interface GameHudProps {
  gameState: GameState;
  muted: boolean;
  hoveredId: string | null;
  dialogueQueue: DialogueLine[];
  dialogueIndex: number;
  onAdvanceDialogue: () => void;
  onSkipDialogue: () => void;
  onOpenNotebook: () => void;
  onToggleMute: () => void;
  onPause: () => void;
  onRestart: () => void;
  onQuickInteract: () => void;
}

export function GameHud({
  gameState,
  muted,
  hoveredId,
  dialogueQueue,
  dialogueIndex,
  onAdvanceDialogue,
  onSkipDialogue,
  onOpenNotebook,
  onToggleMute,
  onPause,
  onRestart,
  onQuickInteract,
}: GameHudProps) {
  const isDialogueOpen = dialogueQueue.length > 0;
  const activeLine = isDialogueOpen ? dialogueQueue[dialogueIndex] : null;
  const hoverMeta = hoveredId ? INTERACTABLE_META[hoveredId] : null;
  const objective = getCurrentObjective(gameState);
  const chapterTitle = CHAPTER_TITLES[gameState.chapter] ?? `第${gameState.chapter}章`;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 sm:p-4 md:p-5">
      {/* Top Perimeter Clusters: Stacks cleanly on mobile (<640px), side-by-side on desktop */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        {/* Objective, Relics & Stability */}
        <div className="bg-[#0b1322]/92 border border-amber-400/25 rounded-lg px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-lg w-full sm:w-auto sm:max-w-md">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] tracking-wide text-amber-300 font-bold truncate">
              {chapterTitle}
            </span>
            <span className="text-[11px] font-mono-num text-sky-300 whitespace-nowrap">
              記憶 {gameState.discoveredMemories.length}/{TOTAL_MEMORY_COUNT}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-snug mt-0.5 sm:mt-1">
            {objective}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 pt-1.5 border-t border-white/10">
            <div className="flex items-center gap-1" title="リンゴの記憶結晶">
              <AppleMemoryIcon active={gameState.hasAppleMemory} />
              <span
                className={`text-[11px] sm:text-xs whitespace-nowrap ${
                  gameState.hasAppleMemory ? 'text-rose-300 font-bold' : 'text-slate-400'
                }`}
              >
                リンゴ
              </span>
            </div>

            <div className="flex items-center gap-1" title="魔王の涙石">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full border ${
                  gameState.hasDemonSeal
                    ? 'bg-violet-400 border-violet-200'
                    : 'bg-transparent border-slate-500'
                }`}
                aria-hidden="true"
              />
              <span
                className={`text-[11px] sm:text-xs whitespace-nowrap ${
                  gameState.hasDemonSeal ? 'text-violet-300 font-bold' : 'text-slate-400'
                }`}
              >
                涙石
              </span>
            </div>

            <div className="flex items-center gap-1" title="天空の鍵">
              <SkyKeyIcon active={gameState.hasSkyKey} />
              <span
                className={`text-[11px] sm:text-xs whitespace-nowrap ${
                  gameState.hasSkyKey ? 'text-sky-300 font-bold' : 'text-slate-400'
                }`}
              >
                天空の鍵
              </span>
            </div>

            <div className="flex items-center gap-1" title="チンポ・サブマリーナ">
              <SubmarinaIcon active={gameState.hasSubmarina} />
              <span
                className={`text-[11px] sm:text-xs whitespace-nowrap ${
                  gameState.hasSubmarina ? 'text-teal-300 font-bold' : 'text-slate-400'
                }`}
              >
                サブマリーナ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] text-slate-300 whitespace-nowrap">安定度</span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  gameState.stability > 50
                    ? 'bg-emerald-400'
                    : gameState.stability > 25
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                }`}
                style={{ width: `${Math.round(gameState.stability)}%` }}
              />
            </div>
            <span className="text-[11px] font-mono-num text-slate-200 w-9 text-right">
              {Math.round(gameState.stability)}%
            </span>
          </div>
        </div>

        {/* Countdown + Compact Utility Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pointer-events-auto">
          <div className="bg-[#0b1322]/92 border border-amber-400/25 rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-lg text-left sm:text-right">
            <div className="text-[10px] tracking-wider text-sky-300/90 font-bold">
              世界崩壊まで
            </div>
            <div className="text-base sm:text-xl font-bold font-mono-num text-slate-50 leading-none mt-0.5">
              {formatClock(gameState.timeRemaining)}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              tabIndex={-1}
              aria-label="記憶手帖を開く [N]"
              title="記憶手帖 [N]"
              onClick={(e) => {
                e.currentTarget.blur();
                onOpenNotebook();
              }}
              className="h-10 px-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-[#0b1322]/92 hover:bg-slate-800 border border-amber-400/35 text-amber-200 cursor-pointer transition-colors"
            >
              <NotebookIcon />
              <span className="text-xs font-bold whitespace-nowrap">手帖</span>
            </button>

            <button
              type="button"
              tabIndex={-1}
              aria-label={muted ? '音声をオンにする [M]' : 'ミュートにする [M]'}
              title="ミュート [M]"
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleMute();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0b1322]/92 hover:bg-slate-800 border border-white/15 text-slate-100 cursor-pointer transition-colors"
            >
              <MuteIcon muted={muted} />
            </button>

            <button
              type="button"
              tabIndex={-1}
              aria-label="ポーズ [P]"
              title="ポーズ [P]"
              onClick={(e) => {
                e.currentTarget.blur();
                onPause();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0b1322]/92 hover:bg-slate-800 border border-white/15 text-slate-100 cursor-pointer transition-colors"
            >
              <PauseIcon />
            </button>

            <button
              type="button"
              tabIndex={-1}
              aria-label="リスタート [R]"
              title="リスタート [R]"
              onClick={(e) => {
                e.currentTarget.blur();
                onRestart();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0b1322]/92 hover:bg-slate-800 border border-white/15 text-slate-100 cursor-pointer transition-colors"
            >
              <RestartIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Exact Center Reticle + Lower Hover Prompt */}
      {!isDialogueOpen && gameState.activeModal === 'none' && (
        <>
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div
              className={`w-3 h-3 rounded-full border-2 transition-transform duration-150 ${
                hoverMeta
                  ? 'border-amber-300 bg-amber-300/40 scale-125'
                  : 'border-white/75 bg-transparent scale-100'
              }`}
            />
          </div>
          {hoverMeta && (
            <div className="fixed left-1/2 bottom-44 sm:bottom-44 md:bottom-20 -translate-x-1/2 pointer-events-none max-w-[92vw]">
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onQuickInteract();
                }}
                className="pointer-events-auto bg-[#0b1322]/95 border border-amber-400/50 text-slate-100 px-3.5 py-2 rounded-lg shadow-xl text-xs sm:text-sm cursor-pointer hover:bg-slate-900 max-w-full truncate"
              >
                <span className="text-amber-300 font-bold mr-1.5 hidden sm:inline">[F / クリック]</span>
                <span>{hoverMeta.label} — {hoverMeta.actionHint}</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Bottom Area: Status Toast OR Story Dialogue Box */}
      <div className="flex flex-col items-center gap-2 z-20">
        {gameState.statusMessage && !isDialogueOpen && gameState.activeModal === 'none' && (
          <div className="mb-40 md:mb-0 bg-[#0b1322]/95 border border-amber-400/40 text-amber-200 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium shadow-lg text-center max-w-[92vw]">
            {gameState.statusMessage}
          </div>
        )}

        {activeLine && (
          <div
            className={`pointer-events-auto w-full max-w-3xl bg-[#0b1322]/96 border ${SPEAKER_STYLES[activeLine.speaker].border} rounded-xl px-4 py-3.5 sm:px-5 sm:py-4 shadow-2xl`}
            role="dialog"
            aria-label={activeLine.speakerName}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold ${SPEAKER_STYLES[activeLine.speaker].badgeBg} ${SPEAKER_STYLES[activeLine.speaker].nameColor} border border-white/10`}
              >
                {activeLine.speakerName}
              </span>
              <span className="text-xs font-mono-num text-slate-400">
                {dialogueIndex + 1} / {dialogueQueue.length}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed min-h-[3rem]">
              {activeLine.text}
            </p>

            <div className="flex items-center justify-end gap-3 mt-3">
              {dialogueQueue.length > 1 && dialogueIndex < dialogueQueue.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onSkipDialogue();
                  }}
                  className="px-3 py-2 text-xs text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
                >
                  スキップ
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onAdvanceDialogue();
                }}
                className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap transition-colors"
              >
                {dialogueIndex + 1 < dialogueQueue.length ? '次へ' : '閉じる'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
