import { memo } from 'react';

const ToppingMushroom = memo(function ToppingMushroom({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Mushroom">
      <defs>
        <radialGradient id="mush-cap" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#A1887F" />
          <stop offset="100%" stopColor="#6D4C41" />
        </radialGradient>
      </defs>
      <ellipse cx="16" cy="14" rx="11" ry="8" fill="url(#mush-cap)" />
      <ellipse cx="16" cy="14" rx="11" ry="8" fill="none" stroke="#5D4037" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="13" cy="12" rx="4" ry="2.5" fill="#BCAAA4" opacity="0.3" />
      <rect x="14" y="18" width="4" height="8" rx="2" fill="#EFEBE9" />
      <rect x="14" y="18" width="4" height="8" rx="2" fill="none" stroke="#D7CCC8" strokeWidth="0.5" />
    </svg>
  );
});

const ToppingBellPepper = memo(function ToppingBellPepper({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Bell pepper">
      <defs>
        <linearGradient id="pep-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#388E3C" />
        </linearGradient>
      </defs>
      <path d="M8 18 Q8 8 16 6 Q24 8 24 18 Q24 24 16 26 Q8 24 8 18Z" fill="url(#pep-green)" />
      <path d="M8 18 Q8 8 16 6 Q24 8 24 18 Q24 24 16 26 Q8 24 8 18Z" fill="none" stroke="#2E7D32" strokeWidth="0.5" opacity="0.4" />
      <path d="M12 12 Q14 10 16 12" fill="none" stroke="#A5D6A7" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <rect x="15" y="4" width="2" height="4" rx="1" fill="#558B2F" />
    </svg>
  );
});

const ToppingRedOnion = memo(function ToppingRedOnion({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Red onion">
      <circle cx="16" cy="16" r="10" fill="none" stroke="#7B1FA2" strokeWidth="2.5" opacity="0.7" />
      <circle cx="16" cy="16" r="7" fill="none" stroke="#9C27B0" strokeWidth="1.5" opacity="0.4" />
      <circle cx="16" cy="16" r="4" fill="none" stroke="#CE93D8" strokeWidth="1" opacity="0.3" />
    </svg>
  );
});

const ToppingOlive = memo(function ToppingOlive({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Olive">
      <defs>
        <radialGradient id="olive-grad" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#2C2C2C" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="10" fill="url(#olive-grad)" />
      <circle cx="16" cy="16" r="4" fill="#4E342E" />
      <circle cx="13" cy="13" r="2" fill="#8D6E63" opacity="0.3" />
    </svg>
  );
});

const ToppingTomato = memo(function ToppingTomato({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Tomato">
      <defs>
        <radialGradient id="tom-grad" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#EF5350" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="10" fill="url(#tom-grad)" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="#B71C1C" strokeWidth="0.5" opacity="0.3" />
      <path d="M10 16 Q16 12 22 16" fill="none" stroke="#FFCDD2" strokeWidth="0.8" opacity="0.3" />
      <path d="M12 20 Q16 17 20 20" fill="none" stroke="#FFCDD2" strokeWidth="0.6" opacity="0.25" />
      <circle cx="13" cy="13" r="1.5" fill="#FF8A80" opacity="0.3" />
    </svg>
  );
});

const ToppingJalapeno = memo(function ToppingJalapeno({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Jalapeno">
      <defs>
        <linearGradient id="jal-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="10" fill="url(#jal-grad)" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="#1B5E20" strokeWidth="0.5" opacity="0.3" />
      <circle cx="16" cy="16" r="6" fill="#388E3C" opacity="0.5" />
      <circle cx="16" cy="16" r="3" fill="#C8E6C9" opacity="0.3" />
      {/* Seeds */}
      <ellipse cx="13" cy="13" rx="1.5" ry="1" fill="#FDD835" opacity="0.6" />
      <ellipse cx="19" cy="14" rx="1.2" ry="0.8" fill="#FDD835" opacity="0.5" />
      <ellipse cx="15" cy="19" rx="1.3" ry="0.9" fill="#FDD835" opacity="0.55" />
    </svg>
  );
});

const ToppingSpinach = memo(function ToppingSpinach({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Spinach">
      <defs>
        <linearGradient id="spin-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <ellipse cx="16" cy="16" rx="10" ry="7" fill="url(#spin-grad)" transform="rotate(-15 16 16)" />
      <path d="M8 16 Q16 12 24 16" fill="none" stroke="#1B5E20" strokeWidth="0.8" opacity="0.3" />
      <path d="M12 14 Q16 10 20 14" fill="none" stroke="#A5D6A7" strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
});

const ToppingArtichoke = memo(function ToppingArtichoke({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Artichoke">
      <defs>
        <linearGradient id="arti-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
      </defs>
      <ellipse cx="16" cy="18" rx="8" ry="9" fill="url(#arti-grad)" />
      <path d="M10 18 Q16 10 22 18" fill="none" stroke="#388E3C" strokeWidth="1" opacity="0.4" />
      <path d="M12 20 Q16 14 20 20" fill="none" stroke="#388E3C" strokeWidth="0.8" opacity="0.35" />
      <path d="M14 22 Q16 18 18 22" fill="none" stroke="#388E3C" strokeWidth="0.6" opacity="0.3" />
      <rect x="15" y="24" width="2" height="4" rx="1" fill="#689F38" opacity="0.7" />
    </svg>
  );
});

const ToppingArugula = memo(function ToppingArugula({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Arugula">
      <defs>
        <linearGradient id="aru-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="100%" stopColor="#43A047" />
        </linearGradient>
      </defs>
      <path d="M16 4 Q8 12 10 20 Q12 28 16 28 Q20 28 22 20 Q24 12 16 4Z" fill="url(#aru-grad)" />
      <path d="M16 4 Q8 12 10 20 Q12 28 16 28 Q20 28 22 20 Q24 12 16 4Z" fill="none" stroke="#2E7D32" strokeWidth="0.5" opacity="0.3" />
      <path d="M16 6 L16 26" fill="none" stroke="#1B5E20" strokeWidth="0.8" opacity="0.3" />
      <path d="M16 12 L12 16" fill="none" stroke="#1B5E20" strokeWidth="0.5" opacity="0.2" />
      <path d="M16 16 L20 20" fill="none" stroke="#1B5E20" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
});

const ToppingCaramelizedOnion = memo(function ToppingCaramelizedOnion({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Caramelized onion">
      <defs>
        <linearGradient id="carm-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="50%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#8D6E63" />
        </linearGradient>
      </defs>
      <path d="M4 16 Q8 10 16 12 Q24 14 28 16 Q24 18 16 20 Q8 22 4 16Z" fill="url(#carm-grad)" opacity="0.8" />
      <path d="M6 16 Q10 12 16 13 Q22 14 26 16" fill="none" stroke="#4E342E" strokeWidth="0.6" opacity="0.3" />
      <path d="M8 17 Q14 14 20 16 Q24 17 26 16" fill="none" stroke="#4E342E" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
});

const ToppingSunDriedTomato = memo(function ToppingSunDriedTomato({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Sun-dried tomato">
      <defs>
        <radialGradient id="sd-grad" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#8B1A1A" />
        </radialGradient>
      </defs>
      <ellipse cx="16" cy="16" rx="9" ry="7" fill="url(#sd-grad)" transform="rotate(-10 16 16)" />
      <path d="M10 14 Q14 10 20 14" fill="none" stroke="#B71C1C" strokeWidth="0.6" opacity="0.3" />
      <path d="M12 18 Q16 15 22 18" fill="none" stroke="#B71C1C" strokeWidth="0.5" opacity="0.25" />
      <ellipse cx="13" cy="14" rx="2" ry="1.2" fill="#E57373" opacity="0.25" />
    </svg>
  );
});

const ToppingTruffleOil = memo(function ToppingTruffleOil({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Truffle oil">
      <defs>
        <radialGradient id="truf-oil" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#F9A825" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="8" fill="url(#truf-oil)" opacity="0.7" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="#F57F17" strokeWidth="0.5" opacity="0.3" />
      <circle cx="14" cy="14" r="3" fill="#FFECB3" opacity="0.4" />
      <circle cx="18" cy="18" r="2" fill="#FFF8E1" opacity="0.3" />
    </svg>
  );
});

const ToppingPepperoni = memo(function ToppingPepperoni({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Pepperoni">
      <defs>
        <radialGradient id="pep-slice2" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#8B1A1A" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="10" fill="url(#pep-slice2)" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="#6D1A1A" strokeWidth="0.5" opacity="0.3" />
      <circle cx="13" cy="13" r="2" fill="#E57373" opacity="0.3" />
      <circle cx="18" cy="17" r="1.5" fill="#E57373" opacity="0.25" />
      <circle cx="14" cy="19" r="1" fill="#FFCDD2" opacity="0.2" />
    </svg>
  );
});

const ToppingChicken = memo(function ToppingChicken({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Chicken">
      <defs>
        <linearGradient id="chkn-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#FFCC80" />
        </linearGradient>
      </defs>
      <rect x="6" y="8" width="20" height="16" rx="4" fill="url(#chkn-grad)" />
      <rect x="6" y="8" width="20" height="16" rx="4" fill="none" stroke="#FFB74D" strokeWidth="0.5" opacity="0.3" />
      <path d="M10 14 Q16 10 22 14" fill="none" stroke="#FFE0B2" strokeWidth="0.8" opacity="0.3" />
      <path d="M10 18 Q16 15 22 18" fill="none" stroke="#FFE0B2" strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
});

export {
  ToppingMushroom,
  ToppingBellPepper,
  ToppingRedOnion,
  ToppingOlive,
  ToppingTomato,
  ToppingJalapeno,
  ToppingSpinach,
  ToppingArtichoke,
  ToppingArugula,
  ToppingCaramelizedOnion,
  ToppingSunDriedTomato,
  ToppingTruffleOil,
  ToppingPepperoni,
  ToppingChicken,
};

export const TOPPING_ICONS = {
  mushrooms: ToppingMushroom,
  bell_peppers: ToppingBellPepper,
  red_onion: ToppingRedOnion,
  olives: ToppingOlive,
  tomatoes: ToppingTomato,
  jalapenos: ToppingJalapeno,
  spinach: ToppingSpinach,
  artichoke: ToppingArtichoke,
  arugula: ToppingArugula,
  caramelized_onion: ToppingCaramelizedOnion,
  sun_dried_tomato: ToppingSunDriedTomato,
  truffle_oil: ToppingTruffleOil,
  pepperoni: ToppingPepperoni,
  chicken: ToppingChicken,
};
