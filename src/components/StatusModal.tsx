import { formatClock, TOTAL_MEMORY_COUNT, type GameState } from '../game/escapeLogic';
import { CHAPTER_TITLES, VICTORY_EPILOGUE_LINES } from '../game/storyData';

interface StatusModalProps {
  gameState: GameState;
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export function StatusModal({
  gameState,
  onResume,
  onRestart,
  onReturnTitle,
}: StatusModalProps) {
  const chapterLabel = CHAPTER_TITLES[gameState.chapter] ?? `第${gameState.chapter}章`;

  if (gameState.phase === 'paused') {
    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="ポーズ中"
          className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-amber-400/35 rounded-xl p-5 sm:p-6 shadow-2xl text-slate-100"
        >
          <div className="text-center">
            <span className="inline-block text-[11px] font-bold tracking-wide text-amber-300 bg-amber-950/60 border border-amber-400/30 px-2.5 py-0.5 rounded">
              {chapterLabel}
            </span>
            <h2 className="text-2xl font-bold font-display text-amber-300 mt-2">
              ポーズ中
            </h2>
          </div>
          <p className="text-xs text-slate-300 text-center mt-1.5 leading-relaxed">
            WASD / スティックで移動 · ドラッグ / ←→で視点変更 · タップ / Fで調べる · Nで記憶手帖
          </p>

          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="bg-[#162038] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-[11px] text-slate-400">残り時間</div>
              <div className="text-lg font-bold font-mono-num text-white">
                {formatClock(gameState.timeRemaining)}
              </div>
            </div>
            <div className="bg-[#162038] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-[11px] text-slate-400">発見した記憶</div>
              <div className="text-lg font-bold font-mono-num text-amber-300">
                {gameState.discoveredMemories.length} / {TOTAL_MEMORY_COUNT}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onResume}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer"
            >
              探索に戻る
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm cursor-pointer"
            >
              最初からやり直す
            </button>
            <button
              type="button"
              onClick={onReturnTitle}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-sm cursor-pointer"
            >
              タイトルへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'gameover') {
    const isVictory = gameState.outcome === 'victory';

    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isVictory ? '脱出成功' : '脱出失敗'}
          className={`w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0b1322] border ${
            isVictory ? 'border-amber-400/50' : 'border-rose-500/50'
          } rounded-xl p-5 sm:p-7 shadow-2xl text-slate-100`}
        >
          <div className="text-center">
            {!isVictory && (
              <div className="text-xs font-bold text-rose-300 mb-1">
                到達地点：{chapterLabel}
              </div>
            )}
            <h2
              className={`text-2xl md:text-3xl font-bold font-display ${
                isVictory ? 'text-amber-300' : 'text-rose-400'
              }`}
            >
              {isVictory ? '脱出成功 ― 青空の草原へ' : '機体崩壊 ― 脱出失敗'}
            </h2>
          </div>

          {isVictory ? (
            <div className="mt-4 space-y-2.5 bg-[#121c30] border border-white/10 rounded-lg p-4 text-xs md:text-sm leading-relaxed text-slate-200">
              {VICTORY_EPILOGUE_LINES.map((line, i) => (
                <p key={i}>{line.text}</p>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-300 text-center leading-relaxed">
              {gameState.statusMessage || '一万年周期の崩壊が世界を飲み込んでしまった。もう一度、四千年の記憶を辿ろう。'}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 my-5">
            <div className="bg-[#162038] border border-white/10 rounded-lg p-2.5 sm:p-3 text-center">
              <div className="text-[11px] text-slate-400">
                {isVictory ? '脱出タイム' : '経過時間'}
              </div>
              <div className="text-base sm:text-lg font-bold font-mono-num text-white">
                {formatClock(gameState.elapsedTime)}
              </div>
            </div>
            <div className="bg-[#162038] border border-white/10 rounded-lg p-2.5 sm:p-3 text-center">
              <div className="text-[11px] text-slate-400">記憶回収</div>
              <div className="text-base sm:text-lg font-bold font-mono-num text-amber-300">
                {gameState.discoveredMemories.length} / {TOTAL_MEMORY_COUNT}
              </div>
            </div>
            <div className="bg-[#162038] border border-white/10 rounded-lg p-2.5 sm:p-3 text-center">
              <div className="text-[11px] text-slate-400">残り安定度</div>
              <div className="text-base sm:text-lg font-bold font-mono-num text-sky-300">
                {Math.round(gameState.stability)}%
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              data-start="true"
              onClick={onRestart}
              className="w-full sm:w-auto px-7 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer whitespace-nowrap"
            >
              {isVictory ? 'もう一度プレイ' : '再挑戦する'}
            </button>
            <button
              type="button"
              onClick={onReturnTitle}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm cursor-pointer whitespace-nowrap"
            >
              タイトルへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
