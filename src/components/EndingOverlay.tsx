import { ENDING_SEQUENCE_STEPS, SPEAKER_STYLES } from '../game/storyData';

interface EndingOverlayProps {
  endingStep: number;
  onAdvance: () => void;
  onSkip: () => void;
}

export function EndingOverlay({ endingStep, onAdvance, onSkip }: EndingOverlayProps) {
  const content = ENDING_SEQUENCE_STEPS[endingStep] ?? ENDING_SEQUENCE_STEPS[0];
  const style = SPEAKER_STYLES[content.speaker];

  return (
    <div
      className="fixed inset-0 z-25 flex flex-col justify-between pointer-events-auto"
      onClick={onAdvance}
      role="dialog"
      aria-modal="true"
      aria-label="脱出エンディング"
    >
      {/* Top Bar: Unboxed step metadata + Skip */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <div className="bg-[#0b1322]/90 border border-sky-400/30 px-3 py-1 rounded-md text-[11px] font-mono-num text-sky-200 tabular-nums">
          EPILOGUE {endingStep + 1} / {ENDING_SEQUENCE_STEPS.length}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          className="px-4 py-2 rounded-lg bg-[#0b1322]/90 hover:bg-slate-800 border border-white/15 text-slate-200 text-xs font-bold cursor-pointer whitespace-nowrap"
        >
          スキップ
        </button>
      </div>

      {/* Bottom Story Caption Box */}
      <div className="relative z-10 flex justify-center p-4 sm:p-6">
        <div
          className={`w-full max-w-2xl bg-[#0b1322]/95 border ${style.border} rounded-xl px-4 py-4 sm:px-6 sm:py-5 shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold ${style.badgeBg} ${style.nameColor} border border-white/10`}
            >
              {content.speakerName}
            </span>
            <span className="text-[11px] text-slate-400 font-mono-num">
              タップ / Space で次へ
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
            {content.caption}
          </p>
          {content.subnote && (
            <p className="text-xs text-sky-200/85 mt-2 leading-relaxed">
              {content.subnote}
            </p>
          )}

          <div className="flex items-center justify-end mt-4">
            <button
              type="button"
              onClick={onAdvance}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap transition-colors"
            >
              {endingStep < ENDING_SEQUENCE_STEPS.length - 1 ? '次へ' : '草原へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
