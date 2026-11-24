import { useEffect, useState } from 'react';
import { SPEAKER_STYLES, WAKEUP_SEQUENCE_STEPS } from '../game/storyData';

interface WakeupOverlayProps {
  wakeupStep: number;
  onAdvance: () => void;
  onSkip: () => void;
}

export function WakeupOverlay({ wakeupStep, onAdvance, onSkip }: WakeupOverlayProps) {
  const [blinkClosed, setBlinkClosed] = useState(false);

  // Brief natural eye-blink beat when transitioning to step 3 ("目を閉じる。再び目を開ける。")
  useEffect(() => {
    if (wakeupStep === 3) {
      setBlinkClosed(true);
      const timer = window.setTimeout(() => {
        setBlinkClosed(false);
      }, 420);
      return () => window.clearTimeout(timer);
    }
    setBlinkClosed(false);
  }, [wakeupStep]);

  const content = WAKEUP_SEQUENCE_STEPS[wakeupStep] ?? WAKEUP_SEQUENCE_STEPS[0];
  const style = SPEAKER_STYLES[content.speaker];

  // Eyelid shutter height by step
  const eyelidHeightClass =
    wakeupStep === 0
      ? 'h-[50vh]'
      : blinkClosed
        ? 'h-[50vh]'
        : wakeupStep === 1
          ? 'h-[16vh]'
          : 'h-0';

  const skyTintClass =
    wakeupStep === 1 || wakeupStep === 2
      ? 'bg-gradient-to-b from-sky-400/20 via-transparent to-sky-900/25'
      : 'bg-transparent';

  return (
    <div
      className={`fixed inset-0 z-25 flex flex-col justify-between pointer-events-auto transition-colors duration-700 ${skyTintClass}`}
      onClick={onAdvance}
      role="dialog"
      aria-modal="true"
      aria-label="目覚めの演出"
    >
      {/* Upper Eyelid Curtain */}
      <div
        className={`fixed inset-x-0 top-0 bg-[#04070f] transition-all duration-700 ease-out pointer-events-none ${eyelidHeightClass}`}
      />
      {/* Lower Eyelid Curtain */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-[#04070f] transition-all duration-700 ease-out pointer-events-none ${eyelidHeightClass}`}
      />

      {/* Top Bar: Step Progress + Skip Button */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <div className="bg-[#0b1322]/90 border border-sky-400/30 px-3 py-1 rounded-md text-[11px] font-mono-num text-sky-200">
          PROLOGUE {wakeupStep + 1} / {WAKEUP_SEQUENCE_STEPS.length}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          className="px-3.5 py-2 rounded-lg bg-[#0b1322]/90 hover:bg-slate-800 border border-white/15 text-slate-200 text-xs font-bold cursor-pointer whitespace-nowrap"
        >
          スキップ
        </button>
      </div>

      {/* Center Rooftop / Fall Flash Hint on Step 0 */}
      {wakeupStep === 0 && (
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <div className="text-3xl sm:text-4xl font-display font-bold tracking-[0.25em] text-sky-200/80 mb-3">
            …??
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            視界が白く染まり、冷たい風から柔らかな春の風へと変わっていく――
          </p>
        </div>
      )}

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
              {wakeupStep === 3 ? '目覚め' : 'タップ / Space で次へ'}
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
              {wakeupStep < WAKEUP_SEQUENCE_STEPS.length - 1 ? '次へ' : '目を覚ます'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
