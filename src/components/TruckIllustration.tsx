const TruckIllustration = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal/30 to-cyan/30 blur-3xl animate-pulse-glow" />
      
      {/* Main truck container */}
      <svg 
        viewBox="0 0 400 300" 
        className="w-full h-auto relative z-10 animate-float"
        fill="none"
      >
        {/* Truck body - isometric style */}
        <defs>
          <linearGradient id="truckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(222, 47%, 20%)" />
            <stop offset="100%" stopColor="hsl(222, 47%, 12%)" />
          </linearGradient>
          <linearGradient id="cargoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(175, 80%, 50%)" />
            <stop offset="100%" stopColor="hsl(175, 80%, 35%)" />
          </linearGradient>
          <linearGradient id="cargoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(142, 70%, 45%)" />
            <stop offset="100%" stopColor="hsl(142, 70%, 30%)" />
          </linearGradient>
          <linearGradient id="cargoGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(190, 90%, 55%)" />
            <stop offset="100%" stopColor="hsl(190, 90%, 40%)" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="200" cy="260" rx="150" ry="20" fill="hsl(175, 80%, 50%)" opacity="0.1" />

        {/* Truck trailer - isometric */}
        <g filter="url(#shadow)">
          {/* Trailer base */}
          <path d="M80 180 L200 120 L320 180 L200 240 Z" fill="url(#truckGradient)" stroke="hsl(175, 80%, 50%)" strokeWidth="1" opacity="0.3" />
          
          {/* Trailer sides */}
          <path d="M80 180 L80 100 L200 40 L200 120 Z" fill="hsl(222, 47%, 18%)" stroke="hsl(175, 80%, 50%)" strokeWidth="1" opacity="0.5" />
          <path d="M200 40 L320 100 L320 180 L200 120 Z" fill="hsl(222, 47%, 15%)" stroke="hsl(175, 80%, 50%)" strokeWidth="1" opacity="0.5" />
          
          {/* Trailer top */}
          <path d="M80 100 L200 40 L320 100 L200 160 Z" fill="hsl(222, 47%, 22%)" stroke="hsl(175, 80%, 50%)" strokeWidth="1" opacity="0.3" />
        </g>

        {/* Cargo boxes - optimally arranged */}
        <g className="animate-float-delayed">
          {/* Bottom row */}
          <g transform="translate(100, 140)">
            <path d="M0 30 L30 15 L60 30 L30 45 Z" fill="url(#cargoGradient1)" />
            <path d="M0 30 L0 10 L30 -5 L30 15 Z" fill="hsl(175, 80%, 45%)" />
            <path d="M30 -5 L60 10 L60 30 L30 15 Z" fill="hsl(175, 80%, 40%)" />
          </g>
          
          <g transform="translate(150, 125)">
            <path d="M0 30 L30 15 L60 30 L30 45 Z" fill="url(#cargoGradient2)" />
            <path d="M0 30 L0 10 L30 -5 L30 15 Z" fill="hsl(142, 70%, 40%)" />
            <path d="M30 -5 L60 10 L60 30 L30 15 Z" fill="hsl(142, 70%, 35%)" />
          </g>
          
          <g transform="translate(200, 140)">
            <path d="M0 30 L30 15 L60 30 L30 45 Z" fill="url(#cargoGradient3)" />
            <path d="M0 30 L0 10 L30 -5 L30 15 Z" fill="hsl(190, 90%, 50%)" />
            <path d="M30 -5 L60 10 L60 30 L30 15 Z" fill="hsl(190, 90%, 45%)" />
          </g>

          {/* Top row */}
          <g transform="translate(120, 100)">
            <path d="M0 30 L30 15 L60 30 L30 45 Z" fill="url(#cargoGradient1)" />
            <path d="M0 30 L0 10 L30 -5 L30 15 Z" fill="hsl(175, 80%, 45%)" />
            <path d="M30 -5 L60 10 L60 30 L30 15 Z" fill="hsl(175, 80%, 40%)" />
          </g>
          
          <g transform="translate(170, 85)">
            <path d="M0 30 L30 15 L60 30 L30 45 Z" fill="url(#cargoGradient2)" />
            <path d="M0 30 L0 10 L30 -5 L30 15 Z" fill="hsl(142, 70%, 40%)" />
            <path d="M30 -5 L60 10 L60 30 L30 15 Z" fill="hsl(142, 70%, 35%)" />
          </g>
        </g>

        {/* Truck cab */}
        <g filter="url(#shadow)" transform="translate(240, 150)">
          <path d="M0 50 L40 30 L80 50 L40 70 Z" fill="url(#truckGradient)" />
          <path d="M0 50 L0 20 L40 0 L40 30 Z" fill="hsl(222, 47%, 20%)" stroke="hsl(175, 80%, 50%)" strokeWidth="1" opacity="0.5" />
          <path d="M40 0 L80 20 L80 50 L40 30 Z" fill="hsl(222, 47%, 16%)" stroke="hsl(175, 80%, 50%)" strokeWidth="1" opacity="0.5" />
          
          {/* Window */}
          <path d="M45 5 L70 17 L70 35 L45 23 Z" fill="hsl(175, 80%, 50%)" opacity="0.3" />
        </g>

        {/* Wheels */}
        <ellipse cx="120" cy="235" rx="20" ry="10" fill="hsl(222, 47%, 10%)" />
        <ellipse cx="180" cy="245" rx="20" ry="10" fill="hsl(222, 47%, 10%)" />
        <ellipse cx="280" cy="220" rx="15" ry="8" fill="hsl(222, 47%, 10%)" />

        {/* Utilization indicator */}
        <g transform="translate(30, 80)">
          <rect x="0" y="0" width="40" height="100" rx="4" fill="hsl(222, 47%, 15%)" stroke="hsl(175, 80%, 50%)" strokeWidth="1" opacity="0.5" />
          <rect x="4" y="8" width="32" height="88" rx="2" fill="hsl(222, 47%, 10%)" />
          <rect x="4" y="20" width="32" height="76" rx="2" fill="url(#cargoGradient1)" opacity="0.8" />
          <text x="20" y="-10" textAnchor="middle" fill="hsl(175, 80%, 50%)" fontSize="12" fontWeight="bold">94%</text>
        </g>

        {/* CO2 indicator */}
        <g transform="translate(330, 60)">
          <circle cx="20" cy="20" r="25" fill="hsl(222, 47%, 15%)" stroke="hsl(142, 70%, 45%)" strokeWidth="2" opacity="0.5" />
          <text x="20" y="16" textAnchor="middle" fill="hsl(142, 70%, 45%)" fontSize="10" fontWeight="bold">CO₂</text>
          <text x="20" y="28" textAnchor="middle" fill="hsl(142, 70%, 55%)" fontSize="8">-32%</text>
        </g>
      </svg>
    </div>
  );
};

export default TruckIllustration;
