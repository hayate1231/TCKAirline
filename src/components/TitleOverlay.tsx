import { TitleEmblemSvg } from './GameIcons';

interface TitleOverlayProps {
  onStart: () => void;
}

export function TitleOverlay({ onStart }: TitleOverlayProps) {
  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
      {/* Upper negative-space title lockup */}
      <div className="flex flex-col items-center pt-3 md:pt-5">
        <div className="px-4 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-[#0b1322]/90 border border-amber-400/40 shadow-2xl max-w-full">
          <TitleEmblemSvg />
        </div>
      </div>

      {/* Lower primary CTA + responsive control hint */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <button
          type="button"
          data-start="true"
          onClick={(e) => {
            e.currentTarget.blur();
            onStart();
          }}
          className="pointer-events-auto px-7 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-base sm:text-lg tracking-wide shadow-xl border border-amber-200/70 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 whitespace-nowrap"
        >
          脱出を開始する
        </button>

        <p className="text-[11px] sm:text-sm text-slate-100/95 bg-[#0b1322]/85 px-3.5 py-1.5 rounded-md border border-white/10 tracking-wide text-center max-w-[92vw] leading-relaxed flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span className="whitespace-nowrap">WASD / スティック移動</span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">ドラッグ視点</span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">クリック / F 調べる</span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">N 手帖</span>
        </p>
      </div>
    </div>
  );
}
