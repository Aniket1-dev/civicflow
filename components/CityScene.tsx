export function CityScene() {
  const buildings: [number, number, number, number][] = [
    [30, 190, 55, 140], [95, 150, 45, 180], [150, 210, 40, 120],
    [350, 140, 50, 190], [410, 180, 42, 150], [460, 120, 55, 210], [520, 200, 30, 130],
  ];
  const markers = [
    { x: 130, y: 180, color: 'var(--warn)' },
    { x: 400, y: 150, color: 'var(--muted)' },
    { x: 290, y: 290, color: 'var(--warn)' },
    { x: 470, y: 250, color: 'var(--ok)' },
  ];
  return (
    <svg viewBox="0 0 560 420" className="w-full h-auto">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-soft)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--surface)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="560" height="420" rx="18" fill="url(#sky)" />
      <rect x="0" y="330" width="560" height="90" fill="var(--line)" opacity="0.35" />
      <path d="M0 300 C 120 280, 180 320, 300 300 S 480 270, 560 300 L560 340 C 480 320 420 350 300 335 S 120 310 0 335 Z" fill="var(--accent-soft)" opacity="0.6" />
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx="3" fill="var(--surface)" stroke="var(--line)" />
          {Array.from({ length: Math.floor(b[3] / 26) }).map((_, r) =>
            Array.from({ length: Math.max(1, Math.floor(b[2] / 16)) }).map((__, c) => (
              <rect key={`${r}-${c}`} x={b[0] + 8 + c * 16} y={b[1] + 10 + r * 26} width="7" height="9" fill="var(--accent-soft)" />
            ))
          )}
        </g>
      ))}
      <g transform="translate(220,230)">
        <rect x="0" y="0" width="120" height="90" fill="var(--surface)" stroke="var(--line)" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={8 + i * 18} y="10" width="10" height="80" fill="var(--bg)" />
        ))}
        <polygon points="-10,0 130,0 60,-34" fill="var(--accent)" opacity="0.85" />
      </g>
      <rect x="0" y="330" width="560" height="14" fill="var(--ink)" opacity="0.12" />
      <rect x="0" y="336" width="560" height="2" fill="var(--surface)" opacity="0.7" />
      {[70, 180, 300, 400, 500].map((x, i) => (
        <g key={i} transform={`translate(${x},305)`}>
          <rect x="-2" y="10" width="4" height="16" fill="var(--muted)" />
          <circle cx="0" cy="4" r="12" fill="var(--ok)" opacity="0.55" />
        </g>
      ))}
      <g className="drift">
        <rect x="130" y="322" width="30" height="12" rx="4" fill="var(--accent)" />
      </g>
      <g style={{ animation: 'drift 3.6s ease-in-out infinite reverse' }}>
        <rect x="340" y="322" width="26" height="12" rx="4" fill="var(--ink)" opacity="0.6" />
      </g>
      {markers.map((m, i) => (
        <g key={i} transform={`translate(${m.x},${m.y})`}>
          <circle r="14" fill={m.color} opacity="0.18" className="pulse-soft" />
          <circle r="5" fill={m.color} />
        </g>
      ))}
    </svg>
  );
}
