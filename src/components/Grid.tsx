// Grid and radial gradient background (non-interactive version)
const GridBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <svg width="100%" height="100%" className="absolute inset-0">
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0 L0 0 0 40"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="smallGrid"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M80 0 L0 0 0 80"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="mouseGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.14)" />
          <stop offset="80%" stopColor="rgba(59,130,246,0.03)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#smallGrid)" />
      <circle
        cx="58%"
        cy="45%"
        r="520"
        fill="url(#mouseGlow)"
        className="transition-all duration-500"
      />
    </svg>
  </div>
);

export default GridBackground