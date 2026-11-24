import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { MobileMoveVector } from '../game/ThreeEscapeScene';

interface MobileControlsProps {
  mobileMoveRef: MutableRefObject<MobileMoveVector>;
  canInteract: boolean;
  interactLabel: string | null;
  onInteract: () => void;
}

const STICK_RADIUS = 44;

export function MobileControls({
  mobileMoveRef,
  canInteract,
  interactLabel,
  onInteract,
}: MobileControlsProps) {
  const [visible, setVisible] = useState(false);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const stickBaseRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);

  useEffect(() => {
    const checkTouchOrNarrow = () => {
      const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
      const narrow = window.innerWidth < 900;
      const hasTouch = (navigator.maxTouchPoints ?? 0) > 0;
      setVisible(coarse || narrow || hasTouch);
    };
    checkTouchOrNarrow();
    window.addEventListener('resize', checkTouchOrNarrow);
    return () => window.removeEventListener('resize', checkTouchOrNarrow);
  }, []);

  if (!visible) return null;

  const updateStickFromClient = (clientX: number, clientY: number) => {
    const base = stickBaseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > STICK_RADIUS) {
      dx = (dx / dist) * STICK_RADIUS;
      dy = (dy / dist) * STICK_RADIUS;
    }
    setKnobOffset({ x: dx, y: dy });
    mobileMoveRef.current = {
      side: dx / STICK_RADIUS,
      fwd: -dy / STICK_RADIUS,
    };
  };

  const resetStick = () => {
    activePointerIdRef.current = null;
    setKnobOffset({ x: 0, y: 0 });
    mobileMoveRef.current = { fwd: 0, side: 0 };
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-15 pointer-events-none flex items-end justify-between px-5 pb-5">
      {/* Left Virtual Analog Joystick */}
      <div className="flex flex-col items-center gap-1 pointer-events-auto">
        <div
          ref={stickBaseRef}
          role="application"
          aria-label="移動スティック"
          onPointerDown={(e) => {
            e.stopPropagation();
            if (activePointerIdRef.current !== null) return;
            activePointerIdRef.current = e.pointerId;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateStickFromClient(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (activePointerIdRef.current !== e.pointerId) return;
            e.stopPropagation();
            updateStickFromClient(e.clientX, e.clientY);
          }}
          onPointerUp={(e) => {
            if (activePointerIdRef.current !== e.pointerId) return;
            e.stopPropagation();
            resetStick();
          }}
          onPointerCancel={(e) => {
            if (activePointerIdRef.current !== e.pointerId) return;
            e.stopPropagation();
            resetStick();
          }}
          className="relative w-28 h-28 rounded-full bg-[#0b1322]/70 border-2 border-amber-400/45 shadow-xl touch-none select-none flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full border border-white/15 pointer-events-none" />
          <div
            className="absolute w-11 h-11 rounded-full bg-amber-400/90 border-2 border-amber-100 shadow-lg pointer-events-none"
            style={{
              transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
            }}
          />
        </div>
        <span className="text-[10px] font-bold text-slate-200/85 bg-[#0b1322]/75 px-2 py-0.5 rounded">
          移動
        </span>
      </div>

      {/* Right Touch Action Button + Look Hint */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        <button
          type="button"
          disabled={!canInteract}
          onClick={(e) => {
            e.stopPropagation();
            e.currentTarget.blur();
            if (canInteract) onInteract();
          }}
          aria-label={interactLabel ? `調べる: ${interactLabel}` : '調べる'}
          className={`min-w-[88px] h-14 px-4 rounded-2xl font-bold text-sm shadow-xl border-2 transition-all touch-none select-none ${
            canInteract
              ? 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 border-amber-200 cursor-pointer'
              : 'bg-[#0b1322]/65 text-slate-400 border-white/15 opacity-70 cursor-default'
          }`}
        >
          調べる
        </button>
        <span className="text-[10px] font-medium text-slate-200/80 bg-[#0b1322]/75 px-2 py-0.5 rounded">
          画面ドラッグで視点
        </span>
      </div>
    </div>
  );
}
