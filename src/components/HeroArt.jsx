// Decorative hero illustration (not real data): bars, a rising arrow, a Bitcoin coin and an Ethereum coin.
export function HeroArt() {
  return (
    <svg viewBox="0 0 420 290" className="animate-floaty mx-auto w-full max-w-md" aria-hidden="true">
      {/* Ground line */}
      <line x1="110" y1="262" x2="350" y2="262" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
      {/* Three growing bars */}
      <rect x="150" y="182" width="44" height="80" rx="6" fill="#5a7bc4" />
      <rect x="210" y="147" width="44" height="115" rx="6" fill="#6f8fd6" />
      <rect x="270" y="107" width="44" height="155" rx="6" fill="#8fb0f0" />
      {/* Rising arrow */}
      <polyline points="30,240 110,195 160,212 235,150 285,112" fill="none" stroke="#c9d8f8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="306,96 294,124 276,100" fill="#c9d8f8" stroke="#c9d8f8" strokeWidth="6" strokeLinejoin="round" />
      {/* Bitcoin coin: a letter B with two small lines, drawn so it works on every device */}
      <circle cx="352" cy="52" r="34" fill="#d99a3e" />
      <circle cx="352" cy="52" r="27" fill="none" stroke="#f1c27a" strokeWidth="2" />
      <text x="352" y="64" textAnchor="middle" fontSize="34" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">B</text>
      <path d="M346 33v7M358 33v7M346 64v7M358 64v7" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {/* Ethereum coin */}
      <circle cx="380" cy="178" r="30" fill="#5a67a8" />
      <polygon points="380,156 394,180 380,188 366,180" fill="#fff" fillOpacity="0.95" />
      <polygon points="380,192 394,184 380,204 366,184" fill="#fff" fillOpacity="0.7" />
    </svg>
  )
}
