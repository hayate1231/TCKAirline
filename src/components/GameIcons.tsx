export function TitleEmblemSvg() {
  return (
    <svg
      viewBox="0 0 640 160"
      className="w-full max-w-[560px] h-auto"
      role="img"
      aria-label="チクビ飛行機からの脱出"
    >
      <defs>
        <linearGradient id="goldBrass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#d4a64a" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>
      {/* Winged Relic Crest */}
      <g transform="translate(320, 34)">
        <path
          d="M-120 4 L-38 -10 L-22 6 L-96 16 Z M120 4 L38 -10 L22 6 L96 16 Z"
          fill="url(#goldBrass)"
          stroke="#0f172a"
          strokeWidth="2"
        />
        <circle cx="0" cy="0" r="14" fill="#f4efe4" stroke="#d4a64a" strokeWidth="3" />
        <circle cx="0" cy="0" r="5" fill="#38bdf8" />
        <line x1="-180" y1="2" x2="-130" y2="2" stroke="#d4a64a" strokeWidth="1.5" opacity="0.7" />
        <line x1="130" y1="2" x2="180" y2="2" stroke="#d4a64a" strokeWidth="1.5" opacity="0.7" />
      </g>
      <text
        x="320"
        y="108"
        textAnchor="middle"
        fill="#f8fafc"
        stroke="#0b1322"
        strokeWidth="6"
        paintOrder="stroke fill"
        fontSize="44"
        fontWeight="700"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        チクビ飛行機からの脱出
      </text>
      <text
        x="320"
        y="142"
        textAnchor="middle"
        fill="#bae6fd"
        stroke="#0b1322"
        strokeWidth="3"
        paintOrder="stroke fill"
        fontSize="15"
        letterSpacing="4"
      >
        ESCAPE FROM FLYJET CHI-KUBI
      </text>
    </svg>
  );
}

export function SkyKeyIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <circle
        cx="8"
        cy="10"
        r="5"
        fill={active ? '#38bdf8' : 'none'}
        stroke={active ? '#e0f2fe' : '#64748b'}
        strokeWidth="2"
      />
      <path
        d="M12.5 12.5 L21 21 M17 17 L20 14 M19.5 19.5 L22 17"
        stroke={active ? '#fde047' : '#64748b'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SubmarinaIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M10 7 V4 H13"
        fill="none"
        stroke={active ? '#fbbf24' : '#64748b'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="9"
        width="14"
        height="8"
        rx="4"
        fill={active ? '#0d9488' : 'none'}
        stroke={active ? '#5eead4' : '#64748b'}
        strokeWidth="2"
      />
      <circle cx="9" cy="13" r="1.5" fill={active ? '#fde047' : '#64748b'} />
      <path
        d="M18 13 L21 10 V16 Z"
        fill={active ? '#fbbf24' : '#64748b'}
      />
    </svg>
  );
}

export function AppleMemoryIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M12 6 C12 4 14 3 15 3"
        fill="none"
        stroke={active ? '#4ade80' : '#64748b'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 7 C8 7 5.5 10 5.5 13.5 C5.5 17.5 8.5 21 11 21 C11.8 21 12 20.5 12 20.5 C12 20.5 12.2 21 13 21 C15.5 21 18.5 17.5 18.5 13.5 C18.5 10 16 7 12 7 Z"
        fill={active ? '#ef4444' : 'none'}
        stroke={active ? '#fca5a5' : '#64748b'}
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function MuteIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        d="M4 9 H8 L13 5 V19 L8 15 H4 Z"
        fill="currentColor"
      />
      {muted ? (
        <path
          d="M16 9 L21 15 M21 9 L16 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M16.5 8.5 C18 10 18 14 16.5 15.5 M19 6 C21.5 9 21.5 15 19 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

export function RestartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        d="M4 12 A8 8 0 1 1 6.4 17.6 M4 7 V12 H9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NotebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 8 H15 M9 12 H15 M9 16 H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
