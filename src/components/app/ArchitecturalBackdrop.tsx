/**
 * Decorative, almost invisible skyline watermark rendered behind the app.
 * Only faint building silhouettes (villas, buildings, towers) at very low
 * opacity (3-6%), tinted in the same beige/anthracite family as the page
 * background so they never disturb readability.
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
        <defs>
          <linearGradient id="lac-skyline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Discreet skyline: buildings, villas and towers along the bottom */}
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
      </svg>
    </div>
  );
}
