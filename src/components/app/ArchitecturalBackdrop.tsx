/**
 * Decorative, very discreet architectural backdrop rendered behind the app.
 * Combines faint building silhouettes (real-estate identity) with thin
 * geometric lines inspired by architectural plans. Kept extremely low opacity
 * so it never interferes with readability.
 */
export function ArchitecturalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1440 980"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- Blueprint grid: fine architectural lines --- */}
        <defs>
          <pattern id="lac-grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M120 0H0V120"
              stroke="var(--bronze)"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          </pattern>
          <pattern id="lac-grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M24 0H0V24"
              stroke="var(--muted-foreground)"
              strokeOpacity="0.035"
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="lac-skyline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--bronze)" stopOpacity="0.09" />
          </linearGradient>
        </defs>

        {/* Fine micro-grid across the whole canvas */}
        <rect x="0" y="0" width="1440" height="980" fill="url(#lac-grid-fine)" />
        {/* Bolder structural grid */}
        <rect x="0" y="0" width="1440" height="980" fill="url(#lac-grid)" />

        {/* A few long, thin structural diagonals (plan-like) */}
        <g stroke="var(--gold)" strokeOpacity="0.05" strokeWidth="1">
          <line x1="0" y1="980" x2="520" y2="120" />
          <line x1="1440" y1="980" x2="920" y2="120" />
          <line x1="720" y1="980" x2="720" y2="0" />
        </g>

        {/* --- Building silhouettes: a discreet skyline at the bottom --- */}
        <g fill="url(#lac-skyline)">
          {/* left cluster */}
          <rect x="40" y="640" width="70" height="340" rx="2" />
          <rect x="120" y="560" width="54" height="420" rx="2" />
          <rect x="184" y="700" width="46" height="280" rx="2" />
          <rect x="240" y="520" width="80" height="460" rx="2" />
          <rect x="332" y="610" width="48" height="370" rx="2" />
          {/* center cluster */}
          <rect x="430" y="470" width="96" height="510" rx="3" />
          <rect x="540" y="560" width="60" height="420" rx="2" />
          <rect x="612" y="380" width="120" height="600" rx="3" />
          <rect x="744" y="540" width="58" height="440" rx="2" />
          <rect x="814" y="450" width="100" height="530" rx="3" />
          {/* right cluster */}
          <rect x="940" y="600" width="52" height="380" rx="2" />
          <rect x="1004" y="500" width="86" height="480" rx="2" />
          <rect x="1102" y="640" width="46" height="340" rx="2" />
          <rect x="1158" y="430" width="104" height="550" rx="3" />
          <rect x="1274" y="560" width="60" height="420" rx="2" />
          <rect x="1344" y="650" width="56" height="330" rx="2" />
        </g>

        {/* Faint window dots on a couple of towers */}
        <g fill="var(--gold)" fillOpacity="0.06">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 4 }).map((__, c) => (
              <rect
                key={`w1-${r}-${c}`}
                x={560 + c * 14}
                y={420 + r * 64}
                width="6"
                height="10"
                rx="1"
              />
            )),
          )}
          {Array.from({ length: 7 }).map((_, r) =>
            Array.from({ length: 5 }).map((__, c) => (
              <rect
                key={`w2-${r}-${c}`}
                x={830 + c * 16}
                y={480 + r * 60}
                width="6"
                height="10"
                rx="1"
              />
            )),
          )}
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 3 }).map((__, c) => (
              <rect
                key={`w3-${r}-${c}`}
                x={1180 + c * 22}
                y={460 + r * 70}
                width="7"
                height="11"
                rx="1"
              />
            )),
          )}
        </g>

        {/* Soft horizon line */}
        <line
          x1="0"
          y1="980"
          x2="1440"
          y2="980"
          stroke="var(--bronze)"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
