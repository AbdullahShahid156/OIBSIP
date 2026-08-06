import { memo } from 'react';

const IconBaseRegular = memo(function IconBaseRegular({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Classic hand-tossed">
      <defs>
        <radialGradient id="base-reg" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#E8C87A" />
          <stop offset="100%" stopColor="#C4903A" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill="url(#base-reg)" />
      <circle cx="14" cy="14" r="9" fill="#D4A056" opacity="0.6" />
      <circle cx="14" cy="14" r="12" fill="none" stroke="#A67B2E" strokeWidth="0.5" opacity="0.3" />
      <circle cx="11" cy="11" r="2" fill="#E8C87A" opacity="0.3" />
    </svg>
  );
});

const IconBaseThin = memo(function IconBaseThin({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Thin crust">
      <circle cx="14" cy="14" r="12" fill="#D4A056" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#C4903A" strokeWidth="0.8" />
      <circle cx="14" cy="14" r="9" fill="#E8C87A" opacity="0.3" />
      <circle cx="14" cy="14" r="12" fill="none" stroke="#A67B2E" strokeWidth="0.3" opacity="0.4" />
    </svg>
  );
});

const IconBaseThick = memo(function IconBaseThick({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Thick and fluffy">
      <defs>
        <radialGradient id="base-thick" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#E8C87A" />
          <stop offset="60%" stopColor="#D4A056" />
          <stop offset="100%" stopColor="#B8862D" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill="url(#base-thick)" />
      <circle cx="14" cy="14" r="8" fill="#C4903A" opacity="0.3" />
      <circle cx="14" cy="14" r="12" fill="none" stroke="#8B6914" strokeWidth="1" opacity="0.15" />
      <circle cx="10" cy="10" r="2.5" fill="#E8C87A" opacity="0.25" />
      <circle cx="17" cy="12" r="1.8" fill="#E8C87A" opacity="0.2" />
    </svg>
  );
});

const IconBaseStuffed = memo(function IconBaseStuffed({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Cheese stuffed crust">
      <defs>
        <radialGradient id="base-stuf" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#E8C87A" />
          <stop offset="100%" stopColor="#C4903A" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill="url(#base-stuf)" />
      <circle cx="14" cy="14" r="9" fill="#D4A056" opacity="0.5" />
      {/* Cheese oozing from crust */}
      <circle cx="14" cy="2" r="1.5" fill="#FFF8E7" opacity="0.7" />
      <circle cx="6" cy="8" r="1.2" fill="#FFF8E7" opacity="0.6" />
      <circle cx="22" cy="10" r="1.3" fill="#FFF8E7" opacity="0.65" />
      <circle cx="20" cy="20" r="1.1" fill="#FFF8E7" opacity="0.55" />
      <circle cx="8" cy="20" r="1.4" fill="#FFF8E7" opacity="0.6" />
      <circle cx="14" cy="14" r="12" fill="none" stroke="#A67B2E" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
});

const IconBaseGlutenFree = memo(function IconBaseGlutenFree({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Gluten-free cauliflower">
      <defs>
        <radialGradient id="base-gf" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#F5F5DC" />
          <stop offset="100%" stopColor="#D2B48C" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill="url(#base-gf)" />
      <circle cx="14" cy="14" r="9" fill="#E8D5B8" opacity="0.5" />
      {/* Cauliflower florets */}
      <circle cx="10" cy="10" r="2" fill="#F5F5DC" opacity="0.4" />
      <circle cx="18" cy="11" r="1.8" fill="#F5F5DC" opacity="0.35" />
      <circle cx="14" cy="17" r="2.2" fill="#F5F5DC" opacity="0.38" />
      <circle cx="14" cy="14" r="12" fill="none" stroke="#C4A882" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
});

const IconSauceMarinara = memo(function IconSauceMarinara({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="San Marzano marinara">
      <defs>
        <radialGradient id="sauce-mar" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#EF5350" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#sauce-mar)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#B71C1C" strokeWidth="0.5" opacity="0.3" />
      <circle cx="11" cy="11" r="2.5" fill="#FF8A80" opacity="0.25" />
      <circle cx="16" cy="15" r="1.8" fill="#FFCDD2" opacity="0.2" />
    </svg>
  );
});

const IconSaucePesto = memo(function IconSaucePesto({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Basil pesto">
      <defs>
        <radialGradient id="sauce-pesto" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#2E7D32" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#sauce-pesto)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#1B5E20" strokeWidth="0.5" opacity="0.3" />
      <circle cx="11" cy="11" r="2" fill="#A5D6A7" opacity="0.3" />
      <circle cx="16" cy="16" r="1.5" fill="#81C784" opacity="0.25" />
    </svg>
  );
});

const IconSauceBBQ = memo(function IconSauceBBQ({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Smoky BBQ">
      <defs>
        <radialGradient id="sauce-bbq" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#4E342E" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#sauce-bbq)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#3E2723" strokeWidth="0.5" opacity="0.3" />
      <circle cx="11" cy="11" r="2" fill="#A1887F" opacity="0.25" />
    </svg>
  );
});

const IconSauceGarlicWhite = memo(function IconSauceGarlicWhite({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Garlic cream white">
      <defs>
        <radialGradient id="sauce-gar" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="100%" stopColor="#F0E68C" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#sauce-gar)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#E6D568" strokeWidth="0.5" opacity="0.3" />
      <circle cx="11" cy="11" r="2" fill="white" opacity="0.3" />
    </svg>
  );
});

const IconSauceBuffalo = memo(function IconSauceBuffalo({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Spicy buffalo">
      <defs>
        <radialGradient id="sauce-buff" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#FF7043" />
          <stop offset="100%" stopColor="#D84315" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#sauce-buff)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#BF360C" strokeWidth="0.5" opacity="0.3" />
      <circle cx="11" cy="11" r="2" fill="#FFAB91" opacity="0.25" />
      <circle cx="16" cy="16" r="1.5" fill="#FF8A65" opacity="0.2" />
    </svg>
  );
});

const IconCheeseMozzarella = memo(function IconCheeseMozzarella({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Fresh mozzarella">
      <defs>
        <radialGradient id="chz-moz" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="100%" stopColor="#F5E6C8" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#chz-moz)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#E8D5A8" strokeWidth="0.5" opacity="0.3" />
      <circle cx="10" cy="10" r="3" fill="white" opacity="0.3" />
      <circle cx="16" cy="15" r="2" fill="white" opacity="0.2" />
    </svg>
  );
});

const IconCheeseParmesan = memo(function IconCheeseParmesan({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Parmigiano Reggiano">
      <defs>
        <linearGradient id="chz-parm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#F0E68C" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#chz-parm)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#E6D568" strokeWidth="0.5" opacity="0.3" />
      <rect x="9" y="11" width="4" height="1.5" rx="0.75" fill="#FFFDE7" opacity="0.4" transform="rotate(-10 11 11.75)" />
      <rect x="15" y="14" width="3.5" height="1.2" rx="0.6" fill="#FFFDE7" opacity="0.35" transform="rotate(15 16.75 14.6)" />
    </svg>
  );
});

const IconCheeseProvolone = memo(function IconCheeseProvolone({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Smoked provolone">
      <defs>
        <radialGradient id="chz-prov" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#FFCC80" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#chz-prov)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#FFB74D" strokeWidth="0.5" opacity="0.3" />
      <circle cx="11" cy="11" r="2.5" fill="#FFE0B2" opacity="0.3" />
      <circle cx="16" cy="16" r="2" fill="#FFE0B2" opacity="0.25" />
    </svg>
  );
});

const IconCheeseGouda = memo(function IconCheeseGouda({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Aged gouda">
      <defs>
        <radialGradient id="chz-gouda" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#FF8F00" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#chz-gouda)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#E65100" strokeWidth="0.5" opacity="0.2" />
      <circle cx="11" cy="11" r="2" fill="#FFD54F" opacity="0.3" />
    </svg>
  );
});

const IconCheeseVegan = memo(function IconCheeseVegan({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} role="img" aria-label="Vegan cashew cheese">
      <defs>
        <radialGradient id="chz-vegan" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#F5F5DC" />
          <stop offset="100%" stopColor="#D2B48C" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill="url(#chz-vegan)" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#C4A882" strokeWidth="0.5" opacity="0.3" />
      {/* Leaf accent */}
      <ellipse cx="14" cy="12" rx="3" ry="1.5" fill="#81C784" opacity="0.4" transform="rotate(-10 14 12)" />
    </svg>
  );
});

export {
  IconBaseRegular,
  IconBaseThin,
  IconBaseThick,
  IconBaseStuffed,
  IconBaseGlutenFree,
  IconSauceMarinara,
  IconSaucePesto,
  IconSauceBBQ,
  IconSauceGarlicWhite,
  IconSauceBuffalo,
  IconCheeseMozzarella,
  IconCheeseParmesan,
  IconCheeseProvolone,
  IconCheeseGouda,
  IconCheeseVegan,
};

export const BUILDER_ICONS = {
  regular: IconBaseRegular,
  thin: IconBaseThin,
  thick: IconBaseThick,
  stuffed: IconBaseStuffed,
  gluten_free: IconBaseGlutenFree,
  marinara: IconSauceMarinara,
  pesto: IconSaucePesto,
  bbq: IconSauceBBQ,
  garlic_white: IconSauceGarlicWhite,
  buffalo: IconSauceBuffalo,
  mozzarella: IconCheeseMozzarella,
  parmesan: IconCheeseParmesan,
  provolone: IconCheeseProvolone,
  gouda: IconCheeseGouda,
  vegan: IconCheeseVegan,
};
