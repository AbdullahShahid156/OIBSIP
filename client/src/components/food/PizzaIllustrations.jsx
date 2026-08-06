import { memo } from 'react';

const PizzaMargherita = memo(function PizzaMargherita({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Margherita pizza">
      <defs>
        <radialGradient id="marg-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="marg-sauce" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#E8453C" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
        <radialGradient id="marg-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="50%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#E8D5A8" />
        </radialGradient>
        <filter id="marg-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
        <radialGradient id="marg-sheen" cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#marg-crust)" filter="url(#marg-shadow)" />
      <circle cx="60" cy="60" r="56" fill="none" stroke="#B8862D" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="60" cy="60" r="48" fill="url(#marg-sauce)" />
      <circle cx="60" cy="60" r="48" fill="url(#marg-cheese)" opacity="0.85" />
      <circle cx="60" cy="60" r="48" fill="url(#marg-sheen)" />
      {/* Basil leaves */}
      <ellipse cx="40" cy="45" rx="6" ry="3.5" fill="#4CAF50" transform="rotate(-20 40 45)" opacity="0.9" />
      <ellipse cx="40" cy="45" rx="6" ry="3.5" fill="none" stroke="#388E3C" strokeWidth="0.5" transform="rotate(-20 40 45)" />
      <ellipse cx="72" cy="38" rx="5" ry="3" fill="#4CAF50" transform="rotate(15 72 38)" opacity="0.85" />
      <ellipse cx="55" cy="70" rx="5.5" ry="3" fill="#4CAF50" transform="rotate(-35 55 70)" opacity="0.9" />
      {/* Tomato slices */}
      <circle cx="48" cy="55" r="5" fill="#E53935" opacity="0.7" />
      <circle cx="48" cy="55" r="5" fill="none" stroke="#C62828" strokeWidth="0.5" />
      <circle cx="68" cy="52" r="4.5" fill="#E53935" opacity="0.65" />
      <circle cx="58" cy="72" r="4" fill="#E53935" opacity="0.6" />
      {/* Cheese bubbles */}
      <circle cx="45" cy="40" r="2" fill="#FFF8E7" opacity="0.5" />
      <circle cx="70" cy="60" r="2.5" fill="#FFF8E7" opacity="0.4" />
      <circle cx="52" cy="65" r="1.8" fill="#FFF8E7" opacity="0.45" />
      {/* Crust edge detail */}
      <path d="M60 4 A56 56 0 0 1 116 60" fill="none" stroke="#C4903A" strokeWidth="1.5" strokeOpacity="0.15" />
    </svg>
  );
});

const PizzaPepperoni = memo(function PizzaPepperoni({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Pepperoni pizza">
      <defs>
        <radialGradient id="pep-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="pep-sauce" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#E8453C" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
        <radialGradient id="pep-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="50%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#E8D5A8" />
        </radialGradient>
        <radialGradient id="pep-slice" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="60%" stopColor="#B71C1C" />
          <stop offset="100%" stopColor="#8B1A1A" />
        </radialGradient>
        <filter id="pep-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#pep-crust)" filter="url(#pep-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#pep-sauce)" />
      <circle cx="60" cy="60" r="48" fill="url(#pep-cheese)" opacity="0.85" />
      {/* Pepperoni slices */}
      {[
        { cx: 42, cy: 42, r: 7 },
        { cx: 68, cy: 38, r: 6.5 },
        { cx: 55, cy: 58, r: 7.5 },
        { cx: 75, cy: 55, r: 6 },
        { cx: 38, cy: 65, r: 6.5 },
        { cx: 60, cy: 75, r: 7 },
        { cx: 50, cy: 82, r: 5.5 },
        { cx: 72, cy: 70, r: 6 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r={p.r} fill="url(#pep-slice)" />
          <circle cx={p.cx} cy={p.cy} r={p.r} fill="none" stroke="#8B1A1A" strokeWidth="0.5" />
          <circle cx={p.cx - p.r * 0.2} cy={p.cy - p.r * 0.2} r={p.r * 0.3} fill="#D32F2F" opacity="0.4" />
          {/* Grease spots */}
          <circle cx={p.cx + p.r * 0.3} cy={p.cy + p.r * 0.2} r="1" fill="#E57373" opacity="0.3" />
        </g>
      ))}
      {/* Cheese bubbles */}
      <circle cx="48" cy="50" r="1.5" fill="#FFF8E7" opacity="0.5" />
      <circle cx="65" cy="48" r="2" fill="#FFF8E7" opacity="0.4" />
      <circle cx="58" cy="68" r="1.8" fill="#FFF8E7" opacity="0.45" />
    </svg>
  );
});

const PizzaVeggie = memo(function PizzaVeggie({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Vegetable pizza">
      <defs>
        <radialGradient id="veg-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="veg-sauce" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#E8453C" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
        <radialGradient id="veg-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="50%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#E8D5A8" />
        </radialGradient>
        <filter id="veg-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#veg-crust)" filter="url(#veg-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#veg-sauce)" />
      <circle cx="60" cy="60" r="48" fill="url(#veg-cheese)" opacity="0.85" />
      {/* Bell pepper slices */}
      <path d="M38 40 Q42 36 46 40 Q42 44 38 40Z" fill="#4CAF50" opacity="0.85" />
      <path d="M65 35 Q69 31 73 35 Q69 39 65 35Z" fill="#F44336" opacity="0.8" />
      <path d="M50 68 Q54 64 58 68 Q54 72 50 68Z" fill="#FF9800" opacity="0.8" />
      {/* Mushroom slices */}
      <ellipse cx="45" cy="55" rx="5" ry="3" fill="#8D6E63" opacity="0.75" />
      <rect x="44" y="55" width="2" height="4" rx="1" fill="#A1887F" opacity="0.7" />
      <ellipse cx="72" cy="62" rx="4.5" ry="2.8" fill="#8D6E63" opacity="0.7" />
      <rect x="71" y="62" width="2" height="3.5" rx="1" fill="#A1887F" opacity="0.65" />
      {/* Olive slices */}
      <circle cx="55" cy="45" r="4" fill="#37474F" opacity="0.75" />
      <circle cx="55" cy="45" r="2" fill="#5D4037" opacity="0.5" />
      <circle cx="68" cy="75" r="3.5" fill="#37474F" opacity="0.7" />
      <circle cx="68" cy="75" r="1.8" fill="#5D4037" opacity="0.45" />
      {/* Tomato chunks */}
      <circle cx="40" cy="70" r="4" fill="#E53935" opacity="0.65" />
      <circle cx="75" cy="48" r="3.5" fill="#E53935" opacity="0.6" />
      {/* Spinach leaves */}
      <ellipse cx="60" cy="55" rx="4" ry="2" fill="#388E3C" opacity="0.7" transform="rotate(-15 60 55)" />
      <ellipse cx="48" cy="78" rx="3.5" ry="1.8" fill="#388E3C" opacity="0.65" transform="rotate(20 48 78)" />
    </svg>
  );
});

const PizzaMeatLovers = memo(function PizzaMeatLovers({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Meat lovers pizza">
      <defs>
        <radialGradient id="meat-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="meat-sauce" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#E8453C" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
        <radialGradient id="meat-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="50%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#E8D5A8" />
        </radialGradient>
        <filter id="meat-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#meat-crust)" filter="url(#meat-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#meat-sauce)" />
      <circle cx="60" cy="60" r="48" fill="url(#meat-cheese)" opacity="0.85" />
      {/* Pepperoni */}
      {[
        { cx: 42, cy: 40, r: 6 },
        { cx: 70, cy: 42, r: 5.5 },
        { cx: 55, cy: 60, r: 6.5 },
        { cx: 38, cy: 68, r: 5 },
        { cx: 72, cy: 65, r: 5.5 },
      ].map((p, i) => (
        <circle key={`pep-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="#B71C1C" opacity="0.85" />
      ))}
      {/* Ham/bacon strips */}
      <rect x="48" y="44" width="12" height="3" rx="1.5" fill="#E8A0A0" opacity="0.7" transform="rotate(-10 54 45.5)" />
      <rect x="60" y="70" width="10" height="3" rx="1.5" fill="#E8A0A0" opacity="0.65" transform="rotate(15 65 71.5)" />
      <rect x="35" y="55" width="11" height="2.5" rx="1.25" fill="#E8A0A0" opacity="0.7" transform="rotate(5 40.5 56.25)" />
      {/* Sausage chunks */}
      <ellipse cx="50" cy="50" rx="3.5" ry="2.5" fill="#8B4513" opacity="0.7" transform="rotate(-20 50 50)" />
      <ellipse cx="68" cy="55" rx="3" ry="2" fill="#8B4513" opacity="0.65" transform="rotate(30 68 55)" />
      <ellipse cx="45" cy="75" rx="3" ry="2.2" fill="#8B4513" opacity="0.7" transform="rotate(-10 45 75)" />
      {/* Ground beef */}
      <circle cx="58" cy="48" r="2" fill="#A0522D" opacity="0.6" />
      <circle cx="75" cy="52" r="1.8" fill="#A0522D" opacity="0.55" />
      <circle cx="42" cy="62" r="2.2" fill="#A0522D" opacity="0.6" />
    </svg>
  );
});

const PizzaTruffleMushroom = memo(function PizzaTruffleMushroom({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Truffle mushroom pizza">
      <defs>
        <radialGradient id="truf-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="truf-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="50%" stopColor="#F0DEB8" />
          <stop offset="100%" stopColor="#E0C898" />
        </radialGradient>
        <filter id="truf-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#truf-crust)" filter="url(#truf-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#truf-cheese)" />
      {/* Mushroom slices - generous */}
      {[
        { cx: 40, cy: 42, rx: 7, ry: 4, r: -20 },
        { cx: 65, cy: 38, rx: 6, ry: 3.5, r: 15 },
        { cx: 50, cy: 58, rx: 7.5, ry: 4, r: -10 },
        { cx: 75, cy: 52, rx: 6, ry: 3.5, r: 25 },
        { cx: 38, cy: 68, rx: 6.5, ry: 3.8, r: -30 },
        { cx: 60, cy: 72, rx: 7, ry: 4, r: 5 },
        { cx: 72, cy: 68, rx: 5.5, ry: 3, r: 20 },
      ].map((m, i) => (
        <g key={i} transform={`rotate(${m.r} ${m.cx} ${m.cy})`}>
          <ellipse cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} fill="#8D6E63" opacity="0.8" />
          <ellipse cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} fill="none" stroke="#6D4C41" strokeWidth="0.5" />
          <rect x={m.cx - 1} y={m.cy + m.ry - 1} width="2" height={m.ry * 0.8} rx="1" fill="#A1887F" opacity="0.7" />
          <ellipse cx={m.cx - m.rx * 0.2} cy={m.cy - m.ry * 0.2} rx={m.rx * 0.3} ry={m.ry * 0.3} fill="#A1887F" opacity="0.3" />
        </g>
      ))}
      {/* Truffle shavings */}
      {[
        { x: 45, y: 50, w: 4, h: 1.5, r: -30 },
        { x: 62, y: 48, w: 3.5, h: 1.2, r: 20 },
        { x: 55, y: 65, w: 4, h: 1.3, r: -15 },
        { x: 70, y: 60, w: 3, h: 1, r: 35 },
      ].map((t, i) => (
        <rect key={i} x={t.x} y={t.y} width={t.w} height={t.h} rx="0.75" fill="#2C2C2C" opacity="0.6" transform={`rotate(${t.r} ${t.x + t.w / 2} ${t.y + t.h / 2})`} />
      ))}
      {/* Thyme leaves */}
      <ellipse cx="48" cy="45" rx="2" ry="1" fill="#558B2F" opacity="0.6" transform="rotate(-25 48 45)" />
      <ellipse cx="68" cy="58" rx="1.8" ry="0.9" fill="#558B2F" opacity="0.55" transform="rotate(15 68 58)" />
      <ellipse cx="55" cy="75" rx="2" ry="1" fill="#558B2F" opacity="0.6" transform="rotate(-40 55 75)" />
    </svg>
  );
});

const PizzaDiavola = memo(function PizzaDiavola({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Diavola pizza">
      <defs>
        <radialGradient id="diav-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="diav-sauce" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#B71C1C" />
        </radialGradient>
        <radialGradient id="diav-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF3E0" />
          <stop offset="50%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#FFCC80" />
        </radialGradient>
        <filter id="diav-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#diav-crust)" filter="url(#diav-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#diav-sauce)" />
      <circle cx="60" cy="60" r="48" fill="url(#diav-cheese)" opacity="0.8" />
      {/* Spicy salami */}
      {[
        { cx: 42, cy: 42, r: 6.5 },
        { cx: 68, cy: 40, r: 6 },
        { cx: 55, cy: 58, r: 7 },
        { cx: 75, cy: 58, r: 5.5 },
        { cx: 40, cy: 68, r: 6 },
        { cx: 62, cy: 76, r: 6.5 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r={p.r} fill="#C62828" opacity="0.85" />
          <circle cx={p.cx} cy={p.cy} r={p.r} fill="none" stroke="#8B1A1A" strokeWidth="0.5" />
          {/* Chili flakes */}
          <circle cx={p.cx - 1.5} cy={p.cy - 1} r="0.6" fill="#FF5722" opacity="0.7" />
          <circle cx={p.cx + 1} cy={p.cy + 1.5} r="0.5" fill="#FF5722" opacity="0.6" />
          <circle cx={p.cx + 0.5} cy={p.cy - 2} r="0.4" fill="#FF5722" opacity="0.65" />
        </g>
      ))}
      {/* Calabrian chili */}
      <ellipse cx="50" cy="48" rx="3" ry="1.5" fill="#FF5722" opacity="0.6" transform="rotate(-15 50 48)" />
      <ellipse cx="65" cy="68" rx="2.5" ry="1.2" fill="#FF5722" opacity="0.55" transform="rotate(25 65 68)" />
    </svg>
  );
});

const PizzaQuattroFormaggi = memo(function PizzaQuattroFormaggi({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Quattro formaggi pizza">
      <defs>
        <radialGradient id="qf-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="qf-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="40%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#F0E68C" />
        </radialGradient>
        <filter id="qf-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#qf-crust)" filter="url(#qf-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#qf-cheese)" />
      {/* Mozzarella blobs */}
      {[
        { cx: 40, cy: 42, r: 6 },
        { cx: 68, cy: 40, r: 5.5 },
        { cx: 52, cy: 60, r: 6.5 },
        { cx: 72, cy: 58, r: 5 },
        { cx: 45, cy: 72, r: 5.5 },
        { cx: 65, cy: 72, r: 6 },
      ].map((m, i) => (
        <g key={i}>
          <circle cx={m.cx} cy={m.cy} r={m.r} fill="#FFFDE7" opacity="0.7" />
          <circle cx={m.cx} cy={m.cy} r={m.r * 0.5} fill="white" opacity="0.3" />
        </g>
      ))}
      {/* Gorgonzola blue veins */}
      <path d="M48 48 Q52 45 55 48 Q52 51 48 48" fill="#5C6BC0" opacity="0.25" />
      <path d="M62 55 Q66 52 69 55 Q66 58 62 55" fill="#5C6BC0" opacity="0.2" />
      <path d="M50 65 Q54 62 57 65 Q54 68 50 65" fill="#5C6BC0" opacity="0.22" />
      {/* Parmesan shavings */}
      <rect x="44" y="45" width="5" height="1.5" rx="0.75" fill="#F5DEB3" opacity="0.5" transform="rotate(-15 46.5 45.75)" />
      <rect x="60" y="62" width="4" height="1.2" rx="0.6" fill="#F5DEB3" opacity="0.45" transform="rotate(20 62 62.6)" />
      <rect x="55" y="50" width="4.5" height="1.3" rx="0.65" fill="#F5DEB3" opacity="0.5" transform="rotate(-25 57.25 50.65)" />
      {/* Honey drizzle */}
      <path d="M45 52 Q50 55 55 52 Q60 49 65 52" fill="none" stroke="#FFB300" strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
      <path d="M50 68 Q55 71 60 68" fill="none" stroke="#FFB300" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
});

const PizzaBBQChicken = memo(function PizzaBBQChicken({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="BBQ chicken pizza">
      <defs>
        <radialGradient id="bbq-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="bbq-sauce" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
        <radialGradient id="bbq-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="50%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#E8D5A8" />
        </radialGradient>
        <filter id="bbq-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#bbq-crust)" filter="url(#bbq-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#bbq-sauce)" />
      <circle cx="60" cy="60" r="48" fill="url(#bbq-cheese)" opacity="0.8" />
      {/* Chicken chunks */}
      {[
        { cx: 42, cy: 42, r: 5 },
        { cx: 65, cy: 40, r: 4.5 },
        { cx: 55, cy: 58, r: 5.5 },
        { cx: 72, cy: 55, r: 4 },
        { cx: 40, cy: 65, r: 4.5 },
        { cx: 60, cy: 72, r: 5 },
      ].map((c, i) => (
        <g key={i}>
          <ellipse cx={c.cx} cy={c.cy} rx={c.r} ry={c.r * 0.8} fill="#FFCC80" opacity="0.8" />
          <ellipse cx={c.cx} cy={c.cy} rx={c.r * 0.6} ry={c.r * 0.4} fill="#FFE0B2" opacity="0.3" />
        </g>
      ))}
      {/* Red onion rings */}
      <circle cx="48" cy="52" r="4" fill="none" stroke="#7B1FA2" strokeWidth="1.2" opacity="0.35" />
      <circle cx="68" cy="65" r="3.5" fill="none" stroke="#7B1FA2" strokeWidth="1" opacity="0.3" />
      <circle cx="55" cy="45" r="3" fill="none" stroke="#7B1FA2" strokeWidth="0.8" opacity="0.25" />
      {/* Cilantro */}
      <ellipse cx="52" cy="50" rx="2.5" ry="1.2" fill="#4CAF50" opacity="0.6" transform="rotate(-20 52 50)" />
      <ellipse cx="65" cy="58" rx="2" ry="1" fill="#4CAF50" opacity="0.55" transform="rotate(30 65 58)" />
    </svg>
  );
});

const PizzaHawaiian = memo(function PizzaHawaiian({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Hawaiian pizza">
      <defs>
        <radialGradient id="haw-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="haw-sauce" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#E8453C" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
        <radialGradient id="haw-cheese" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="50%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#E8D5A8" />
        </radialGradient>
        <filter id="haw-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#haw-crust)" filter="url(#haw-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#haw-sauce)" />
      <circle cx="60" cy="60" r="48" fill="url(#haw-cheese)" opacity="0.85" />
      {/* Ham slices */}
      {[
        { x: 38, y: 40, w: 10, h: 6, r: -10 },
        { x: 62, y: 38, w: 9, h: 5.5, r: 15 },
        { x: 48, y: 58, w: 10, h: 6, r: -5 },
        { x: 70, y: 56, w: 8, h: 5, r: 20 },
        { x: 42, y: 70, w: 9, h: 5.5, r: -15 },
        { x: 60, y: 72, w: 10, h: 6, r: 5 },
      ].map((h, i) => (
        <rect key={i} x={h.x} y={h.y} width={h.w} height={h.h} rx="2" fill="#FFAB91" opacity="0.7" transform={`rotate(${h.r} ${h.x + h.w / 2} ${h.y + h.h / 2})`} />
      ))}
      {/* Pineapple chunks */}
      {[
        { cx: 45, cy: 48, r: 4 },
        { cx: 68, cy: 45, r: 3.5 },
        { cx: 55, cy: 65, r: 4 },
        { cx: 72, cy: 62, r: 3.5 },
        { cx: 50, cy: 78, r: 3 },
      ].map((p, i) => (
        <g key={i}>
          <polygon points={`${p.cx},${p.cy - p.r} ${p.cx + p.r},${p.cy} ${p.cx},${p.cy + p.r} ${p.cx - p.r},${p.cy}`} fill="#FFD54F" opacity="0.75" />
          <polygon points={`${p.cx},${p.cy - p.r} ${p.cx + p.r},${p.cy} ${p.cx},${p.cy + p.r} ${p.cx - p.r},${p.cy}`} fill="none" stroke="#FFC107" strokeWidth="0.5" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
});

const PizzaCheese = memo(function PizzaCheese({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Cheese pizza">
      <defs>
        <radialGradient id="chz-crust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="70%" stopColor="#C4903A" />
          <stop offset="100%" stopColor="#A67B2E" />
        </radialGradient>
        <radialGradient id="chz-sauce" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#E8453C" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
        <radialGradient id="chz-cheese" cx="40%" cy="38%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="30%" stopColor="#FFF9C4" />
          <stop offset="70%" stopColor="#F0E68C" />
          <stop offset="100%" stopColor="#E6D568" />
        </radialGradient>
        <filter id="chz-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
        <radialGradient id="chz-sheen" cx="35%" cy="30%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#chz-crust)" filter="url(#chz-shadow)" />
      <circle cx="60" cy="60" r="48" fill="url(#chz-sauce)" />
      <circle cx="60" cy="60" r="48" fill="url(#chz-cheese)" />
      <circle cx="60" cy="60" r="48" fill="url(#chz-sheen)" />
      {/* Cheese melt bubbles */}
      {[
        { cx: 42, cy: 42, r: 3 },
        { cx: 65, cy: 38, r: 2.5 },
        { cx: 50, cy: 55, r: 3.5 },
        { cx: 72, cy: 52, r: 2.8 },
        { cx: 38, cy: 65, r: 2.5 },
        { cx: 58, cy: 70, r: 3 },
        { cx: 70, cy: 68, r: 2.2 },
        { cx: 48, cy: 78, r: 2 },
      ].map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#FFFDE7" opacity="0.4" />
      ))}
      {/* Browning spots */}
      <circle cx="55" cy="48" r="1.5" fill="#E6D568" opacity="0.3" />
      <circle cx="68" cy="60" r="1.8" fill="#E6D568" opacity="0.25" />
      <circle cx="45" cy="58" r="1.2" fill="#E6D568" opacity="0.3" />
    </svg>
  );
});

export {
  PizzaMargherita,
  PizzaPepperoni,
  PizzaVeggie,
  PizzaMeatLovers,
  PizzaTruffleMushroom,
  PizzaDiavola,
  PizzaQuattroFormaggi,
  PizzaBBQChicken,
  PizzaHawaiian,
  PizzaCheese,
};

export const PIZZA_BY_CATEGORY = {
  classic: PizzaMargherita,
  premium: PizzaTruffleMushroom,
  vegetarian: PizzaVeggie,
  'meat-lovers': PizzaMeatLovers,
  specialty: PizzaDiavola,
  signature: PizzaQuattroFormaggi,
};

export const PIZZA_BY_NAME = {
  'Margherita Classica': PizzaMargherita,
  'Margherita': PizzaMargherita,
  'Pepperoni Supreme': PizzaPepperoni,
  'Truffle Mushroom': PizzaTruffleMushroom,
  'Diavola Piccante': PizzaDiavola,
  'Quattro Formaggi': PizzaQuattroFormaggi,
  'BBQ Chicken': PizzaBBQChicken,
  'Hawaiian Classic': PizzaHawaiian,
  'Four Cheese': PizzaQuattroFormaggi,
  'Garden Fresh': PizzaVeggie,
  'Meat Feast': PizzaMeatLovers,
  'The Artisan': PizzaCheese,
};
