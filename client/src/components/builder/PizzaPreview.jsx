import { memo, useMemo, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { useDarkMode, useMediaQuery } from '../../hooks';
import { BUILDER_ICONS, TOPPING_ICONS } from '../food';

const PIZZA_DIM = 260;

/* ── Sauce visual config ─────────────────────────────────── */
const SAUCE_STYLES = {
  marinara:     { base: '#C0392B', mid: '#E74C3C', highlight: '#FF6B5A', shadow: '#7B241C', gloss: 'rgba(255,120,90,0.35)' },
  pesto:        { base: '#2D6A4F', mid: '#40916C', highlight: '#52B788', shadow: '#1B4332', gloss: 'rgba(82,183,136,0.35)' },
  bbq:          { base: '#5C2D0E', mid: '#784212', highlight: '#A0522D', shadow: '#3E1A06', gloss: 'rgba(160,82,45,0.3)' },
  garlic_white: { base: '#EDE0CC', mid: '#F5E6CA', highlight: '#FFF8E7', shadow: '#C4B89A', gloss: 'rgba(255,248,231,0.5)' },
  buffalo:      { base: '#C0392B', mid: '#D35400', highlight: '#E67E22', shadow: '#7B1F0E', gloss: 'rgba(230,126,34,0.35)' },
};

/* ── Cheese visual config ─────────────────────────────────── */
const CHEESE_STYLES = {
  mozzarella: { base: '#FFF3CD', mid: '#FFEAA7', highlight: '#FFFEF5', shadow: '#E8D5A3', gloss: 'rgba(255,254,245,0.6)', name: 'Mozzarella' },
  parmesan:   { base: '#F0DEB4', mid: '#E8D5A3', highlight: '#FFF8E1', shadow: '#C9B88B', gloss: 'rgba(255,248,225,0.4)', name: 'Parmigiano' },
  provolone:  { base: '#F5E6A0', mid: '#EDDA7A', highlight: '#FFF9C4', shadow: '#D4C06A', gloss: 'rgba(255,249,196,0.5)', name: 'Provolone' },
  gouda:      { base: '#FFD54F', mid: '#FFC107', highlight: '#FFE082', shadow: '#C49000', gloss: 'rgba(255,224,130,0.45)', name: 'Gouda' },
  vegan:      { base: '#F5F0E1', mid: '#EDE8D5', highlight: '#FFFEF8', shadow: '#D5D0C1', gloss: 'rgba(255,254,248,0.4)', name: 'Vegan' },
};

/* ── Crust visual config ─────────────────────────────────── */
const BASE_STYLES = {
  thin:        { w: 8,  d: '#7A5C1F', m: '#A0793D', l: '#C49A5E', hl: '#D4B87A', label: 'Thin' },
  regular:     { w: 12, d: '#8B5E34', m: '#A0724A', l: '#C49466', hl: '#D4A87E', label: 'Regular' },
  thick:       { w: 16, d: '#6B3A1A', m: '#8B5E34', l: '#B8844C', hl: '#CD9A66', label: 'Thick' },
  stuffed:     { w: 18, d: '#7A5C1F', m: '#9B7838', l: '#C49A5E', hl: '#D4B87A', label: 'Stuffed' },
  gluten_free: { w: 10, d: '#5A7A4A', m: '#7A9A6A', l: '#9AB88A', hl: '#B0D0A0', label: 'GF Cauliflower' },
};

/* ── Topping rendering configs ─────────────────────────────── */
const TOPPING_RENDER = {
  mushrooms: {
    label: 'Mushrooms',
    positions: [
      { x: 35, y: 32, r: -12 }, { x: 58, y: 35, r: 8 }, { x: 42, y: 50, r: -5 },
      { x: 65, y: 48, r: 15 }, { x: 28, y: 58, r: -8 }, { x: 55, y: 65, r: 3 },
      { x: 38, y: 72, r: -18 }, { x: 62, y: 70, r: 10 }, { x: 48, y: 42, r: -3 },
    ],
  },
  bell_peppers: {
    label: 'Bell Peppers',
    positions: [
      { x: 32, y: 35, r: 25 }, { x: 58, y: 32, r: -15 }, { x: 45, y: 48, r: 40 },
      { x: 65, y: 55, r: -30 }, { x: 35, y: 60, r: 10 }, { x: 52, y: 68, r: -20 },
      { x: 72, y: 45, r: 35 }, { x: 40, y: 75, r: -10 }, { x: 60, y: 78, r: 20 },
    ],
  },
  red_onion: {
    label: 'Red Onion',
    positions: [
      { x: 48, y: 30, r: 5 }, { x: 30, y: 42, r: -10 }, { x: 68, y: 40, r: 15 },
      { x: 42, y: 55, r: -8 }, { x: 58, y: 58, r: 12 }, { x: 25, y: 55, r: -5 },
      { x: 72, y: 55, r: 8 }, { x: 45, y: 70, r: -15 }, { x: 62, y: 72, r: 10 },
    ],
  },
  olives: {
    label: 'Olives',
    positions: [
      { x: 50, y: 28, r: 0 }, { x: 35, y: 38, r: 15 }, { x: 65, y: 36, r: -10 },
      { x: 28, y: 52, r: 8 }, { x: 52, y: 50, r: -5 }, { x: 75, y: 48, r: 12 },
      { x: 40, y: 65, r: -8 }, { x: 60, y: 62, r: 5 }, { x: 50, y: 75, r: -12 },
    ],
  },
  tomatoes: {
    label: 'Cherry Tomatoes',
    positions: [
      { x: 42, y: 34, r: 10 }, { x: 62, y: 32, r: -8 }, { x: 38, y: 50, r: 15 },
      { x: 58, y: 52, r: -12 }, { x: 32, y: 62, r: 5 }, { x: 55, y: 68, r: -15 },
      { x: 72, y: 58, r: 8 }, { x: 45, y: 75, r: -5 }, { x: 65, y: 72, r: 12 },
    ],
  },
  spinach: {
    label: 'Spinach',
    positions: [
      { x: 45, y: 32, r: 20 }, { x: 55, y: 40, r: -25 }, { x: 35, y: 45, r: 35 },
      { x: 65, y: 48, r: -15 }, { x: 48, y: 58, r: 10 }, { x: 30, y: 58, r: -30 },
      { x: 70, y: 55, r: 25 }, { x: 52, y: 70, r: -20 }, { x: 40, y: 68, r: 15 },
    ],
  },
  jalapenos: {
    label: 'Jalapeños',
    positions: [
      { x: 52, y: 30, r: 15 }, { x: 38, y: 40, r: -20 }, { x: 62, y: 38, r: 5 },
      { x: 45, y: 52, r: -10 }, { x: 28, y: 52, r: 25 }, { x: 68, y: 50, r: -15 },
      { x: 55, y: 65, r: 10 }, { x: 35, y: 65, r: -8 }, { x: 65, y: 68, r: 20 },
    ],
  },
  artichoke: {
    label: 'Artichoke',
    positions: [
      { x: 40, y: 35, r: 10 }, { x: 60, y: 35, r: -15 }, { x: 35, y: 50, r: 20 },
      { x: 55, y: 50, r: -10 }, { x: 70, y: 45, r: 5 }, { x: 42, y: 62, r: -20 },
      { x: 58, y: 65, r: 15 }, { x: 48, y: 75, r: -5 }, { x: 32, y: 72, r: 10 },
    ],
  },
  arugula: {
    label: 'Arugula',
    positions: [
      { x: 50, y: 35, r: 30 }, { x: 35, y: 45, r: -20 }, { x: 65, y: 42, r: 15 },
      { x: 45, y: 55, r: -25 }, { x: 60, y: 58, r: 10 }, { x: 30, y: 60, r: -15 },
      { x: 72, y: 55, r: 25 }, { x: 52, y: 70, r: -10 }, { x: 40, y: 72, r: 20 },
    ],
  },
  caramelized_onion: {
    label: 'Onion Jam',
    positions: [
      { x: 48, y: 32, r: -5 }, { x: 38, y: 42, r: 10 }, { x: 58, y: 40, r: -15 },
      { x: 42, y: 55, r: 8 }, { x: 62, y: 52, r: -12 }, { x: 35, y: 62, r: 5 },
      { x: 55, y: 62, r: -8 }, { x: 68, y: 60, r: 15 }, { x: 50, y: 75, r: -10 },
    ],
  },
  sun_dried_tomato: {
    label: 'Sun-Dried Tomato',
    positions: [
      { x: 52, y: 35, r: 12 }, { x: 40, y: 38, r: -8 }, { x: 60, y: 42, r: 18 },
      { x: 35, y: 52, r: -15 }, { x: 55, y: 55, r: 5 }, { x: 70, y: 50, r: -10 },
      { x: 42, y: 65, r: 15 }, { x: 62, y: 68, r: -12 }, { x: 50, y: 78, r: 8 },
    ],
  },
  truffle_oil: {
    label: 'Truffle Oil',
    positions: [
      { x: 50, y: 30, r: 0 }, { x: 35, y: 40, r: 0 }, { x: 65, y: 38, r: 0 },
      { x: 45, y: 50, r: 0 }, { x: 58, y: 55, r: 0 }, { x: 30, y: 55, r: 0 },
      { x: 70, y: 52, r: 0 }, { x: 52, y: 68, r: 0 }, { x: 42, y: 72, r: 0 },
      { x: 60, y: 65, r: 0 }, { x: 38, y: 58, r: 0 }, { x: 68, y: 72, r: 0 },
    ],
  },
};

/* ══════════════════════════════════════════════════════════════
   CSS-BASED INGREDIENT RENDERERS
   Each creates a realistic food-shaped element using
   gradients, shadows, and shaped containers.
   ══════════════════════════════════════════════════════════════ */

function MushroomSlice({ size = 24 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {/* Cap */}
      <div style={{
        position: 'absolute', bottom: '30%', left: '10%', right: '10%', height: '55%',
        borderRadius: '50% 50% 10% 10%',
        background: 'linear-gradient(135deg, #D4A574 0%, #A0724A 40%, #7A5232 100%)',
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.25)',
      }} />
      {/* Cap highlight */}
      <div style={{
        position: 'absolute', bottom: '55%', left: '22%', width: '30%', height: '20%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
      }} />
      {/* Stem */}
      <div style={{
        position: 'absolute', bottom: '5%', left: '32%', right: '32%', height: '35%',
        borderRadius: '20%',
        background: 'linear-gradient(180deg, #F5E6CA 0%, #E8D5A3 100%)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
      }} />
    </div>
  );
}

function BellPepperSlice({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size * 0.7,
      borderRadius: '45% 45% 35% 35%',
      background: 'linear-gradient(160deg, #4CAF50 0%, #2E7D32 40%, #1B5E20 100%)',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 5px rgba(0,0,0,0.25)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Inner wall highlight */}
      <div style={{
        position: 'absolute', top: '15%', left: '15%', right: '15%', bottom: '25%',
        borderRadius: '40%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }} />
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '8%', left: '20%', width: '35%', height: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function RedOnionRing({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      border: `${size * 0.18}px solid transparent`,
      background: `linear-gradient(145deg, #8B1A4A, #C2185B 30%, #E91E63 60%, #AD1457) padding-box,
                   linear-gradient(145deg, #F8BBD0, #F48FB1, #FCE4EC) border-box`,
      boxShadow: '0 2px 5px rgba(139,26,74,0.3), inset 0 1px 3px rgba(255,255,255,0.1)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: '15%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2) 0%, transparent 60%)',
      }} />
    </div>
  );
}

function OliveSlice({ size = 18 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      border: `${size * 0.22}px solid #2C2C2C`,
      background: `linear-gradient(145deg, #1B5E20, #2E7D32 30%, #1B5E20 70%, #0D3311)`,
      boxShadow: '0 2px 5px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.1)',
      position: 'relative',
    }}>
      {/* Center pit hole */}
      <div style={{
        position: 'absolute', inset: '30%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, #5D4037, #3E2723)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
      }} />
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '5%', left: '15%', width: '35%', height: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function TomatoSlice({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size * 0.6,
      borderRadius: '50% 50% 45% 45%',
      background: 'linear-gradient(150deg, #FF6B5A 0%, #E53935 30%, #C62828 70%, #8E0000 100%)',
      boxShadow: '0 2px 5px rgba(198,40,40,0.3), inset 0 2px 4px rgba(255,255,255,0.15)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Seed chambers */}
      {[0.25, 0.5, 0.75].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: '25%', left: `${p * 80}%`, width: '18%', height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,200,100,0.35) 0%, rgba(255,150,50,0.15) 60%, transparent 80%)',
          transform: 'translate(-50%, 0)',
        }} />
      ))}
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: '40%', height: '30%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function JalapenoSlice({ size = 18 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'linear-gradient(150deg, #4CAF50 0%, #388E3C 35%, #2E7D32 65%, #1B5E20 100%)',
      boxShadow: '0 2px 5px rgba(30,94,32,0.35), inset 0 1px 3px rgba(255,255,255,0.12)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Inner membrane */}
      <div style={{
        position: 'absolute', inset: '12%',
        borderRadius: '50%',
        border: '1px solid rgba(200,230,200,0.2)',
        background: 'radial-gradient(circle, rgba(180,230,180,0.15) 0%, transparent 70%)',
      }} />
      {/* Seeds */}
      {[
        { x: 30, y: 30 }, { x: 55, y: 25 }, { x: 40, y: 50 },
        { x: 60, y: 48 }, { x: 45, y: 68 }, { x: 65, y: 65 },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: '10%', height: '14%',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%) rotate(15deg)',
          background: 'linear-gradient(180deg, #FFF8E1 0%, #F5E6A0 100%)',
          boxShadow: '0 0 1px rgba(0,0,0,0.15)',
        }} />
      ))}
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '8%', left: '15%', width: '35%', height: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function SpinachLeaf({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size * 0.7,
      borderRadius: '70% 30% 65% 35%',
      background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 30%, #2E7D32 70%, #1B5E20 100%)',
      boxShadow: '0 2px 5px rgba(27,94,32,0.3), inset 0 1px 3px rgba(255,255,255,0.12)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Center vein */}
      <div style={{
        position: 'absolute', top: '20%', left: '48%', width: '4%', height: '65%',
        borderRadius: '2px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      }} />
      {/* Side veins */}
      {[25, 40, 55, 70].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${p}%`, left: '25%', width: '50%', height: '1px',
          background: 'rgba(255,255,255,0.08)',
          transform: `rotate(${i % 2 ? 15 : -15}deg)`,
        }} />
      ))}
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: '40%', height: '30%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function ArtichokePiece({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size * 0.8,
      borderRadius: '50% 50% 30% 30%',
      background: 'linear-gradient(150deg, #8BC34A 0%, #689F38 30%, #558B2F 60%, #33691E 100%)',
      boxShadow: '0 2px 5px rgba(51,105,30,0.3), inset 0 1px 3px rgba(255,255,255,0.1)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Layer lines */}
      {[30, 45, 60].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${p}%`, left: '15%', right: '15%', height: '1px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '50%',
        }} />
      ))}
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%', width: '35%', height: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function ArugulaLeaf({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size * 0.65,
      borderRadius: '60% 40% 55% 45% / 50% 50% 50% 50%',
      background: 'linear-gradient(130deg, #7CB342 0%, #558B2F 40%, #33691E 100%)',
      boxShadow: '0 2px 4px rgba(51,105,30,0.25), inset 0 1px 2px rgba(255,255,255,0.1)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Jagged edges effect via pseudo-shadow */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        boxShadow: 'inset 2px 0 3px -2px rgba(51,105,30,0.3), inset -2px 0 3px -2px rgba(51,105,30,0.3)',
      }} />
      {/* Center vein */}
      <div style={{
        position: 'absolute', top: '20%', left: '48%', width: '4%', height: '60%',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.1)',
      }} />
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%', width: '35%', height: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function CaramelizedOnionStrip({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size * 0.3,
      borderRadius: '40% 60% 50% 50% / 80% 80% 20% 20%',
      background: 'linear-gradient(90deg, #8D6E3F, #A0793D 30%, #C49A5E 60%, #8D6E3F)',
      boxShadow: '0 1px 3px rgba(100,70,30,0.35), inset 0 1px 2px rgba(255,255,255,0.15)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%', width: '40%', height: '40%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function SunDriedTomato({ size = 18 }) {
  return (
    <div style={{
      width: size, height: size * 0.7,
      borderRadius: '45% 55% 50% 50% / 55% 55% 45% 45%',
      background: 'linear-gradient(140deg, #B71C1C 0%, #8B0000 40%, #5D0000 100%)',
      boxShadow: '0 2px 4px rgba(93,0,0,0.4), inset 0 1px 3px rgba(255,200,200,0.1)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Wrinkle lines */}
      {[30, 50, 70].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${p}%`, left: '10%', right: '10%', height: '1px',
          background: 'rgba(0,0,0,0.15)',
          transform: `rotate(${(i - 1) * 8}deg)`,
        }} />
      ))}
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: '35%', height: '30%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,200,200,0.2) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function TruffleOilDrop({ size = 14 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #C8A84E 0%, #A08230 40%, #785A18 100%)',
      boxShadow: '0 2px 6px rgba(120,90,24,0.4), 0 0 8px rgba(200,168,78,0.3)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '20%', width: '30%', height: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)',
      }} />
    </div>
  );
}

const TOPPING_COMPONENTS = {
  mushrooms: MushroomSlice,
  bell_peppers: BellPepperSlice,
  red_onion: RedOnionRing,
  olives: OliveSlice,
  tomatoes: TomatoSlice,
  jalapenos: JalapenoSlice,
  spinach: SpinachLeaf,
  artichoke: ArtichokePiece,
  arugula: ArugulaLeaf,
  caramelized_onion: CaramelizedOnionStrip,
  sun_dried_tomato: SunDriedTomato,
  truffle_oil: TruffleOilDrop,
};

const TOPPING_SIZES = {
  mushrooms: 26, bell_peppers: 24, red_onion: 22, olives: 20,
  tomatoes: 22, jalapenos: 18, spinach: 24, artichoke: 24,
  arugula: 24, caramelized_onion: 22, sun_dried_tomato: 20, truffle_oil: 14,
};

/* ══════════════════════════════════════════════════════════════
   DRAGGABLE TOPPING — uses Framer Motion drag
   ══════════════════════════════════════════════════════════════ */

function clampToCircle(xPct, yPct, dim, toppingRadius) {
  const cx = dim / 2;
  const cy = dim / 2;
  const maxR = dim / 2 - toppingRadius - 8;
  const px = (xPct / 100) * dim;
  const py = (yPct / 100) * dim;
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= maxR) return { x: xPct, y: yPct };
  const scale = maxR / dist;
  return { x: ((cx + dx * scale) / dim) * 100, y: ((cy + dy * scale) / dim) * 100 };
}

function snapAwayOverlap(xPct, yPct, dim, toppingRadius, occupied, selfKey) {
  const MIN_GAP = toppingRadius * 2.4;
  let out = { x: xPct, y: yPct };
  for (let pass = 0; pass < 4; pass++) {
    let moved = false;
    for (const [key, other] of Object.entries(occupied)) {
      if (key === selfKey) continue;
      const dx = ((out.x - other.x) / 100) * dim;
      const dy = ((out.y - other.y) / 100) * dim;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MIN_GAP && dist > 0.1) {
        const angle = Math.atan2(dy, dx);
        const push = (MIN_GAP - dist) / 2;
        out = {
          x: out.x + (Math.cos(angle) * push / dim) * 100,
          y: out.y + (Math.sin(angle) * push / dim) * 100,
        };
        moved = true;
      }
    }
    if (!moved) break;
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════
   MAIN PIZZA RENDERING
   ══════════════════════════════════════════════════════════════ */

function PizzaCanvas({ base, sauce, cheese, veggies, size }) {
  const pizzaRef = useRef(null);
  const [dragPositions, setDragPositions] = useState({});
  const [dragVersions, setDragVersions] = useState({});
  const dragPositionsRef = useRef({});

  const sizeScale = { small: 0.72, medium: 0.85, large: 1, extra_large: 1.1 };
  const s = sizeScale[size] || 1;
  const bs = BASE_STYLES[base] || BASE_STYLES.regular;
  const ss = SAUCE_STYLES[sauce] || SAUCE_STYLES.marinara;
  const cs = CHEESE_STYLES[cheese] || CHEESE_STYLES.mozzarella;
  const DIM = PIZZA_DIM;

  const handleDragEnd = useCallback((vid, idx, defaultPos, tSize, e, info) => {
    const key = `${vid}-${idx}`;
    const prev = dragPositionsRef.current[key] || defaultPos;
    const rawX = prev.x + (info.offset.x / DIM) * 100;
    const rawY = prev.y + (info.offset.y / DIM) * 100;
    let snapped = snapAwayOverlap(rawX, rawY, DIM, tSize / 2, dragPositionsRef.current, key);
    snapped = clampToCircle(snapped.x, snapped.y, DIM, tSize / 2);
    const finalPos = { x: snapped.x, y: snapped.y, r: defaultPos.r };
    dragPositionsRef.current = { ...dragPositionsRef.current, [key]: finalPos };
    setDragPositions((prev) => ({ ...prev, [key]: finalPos }));
    setDragVersions((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  }, [DIM]);

  return (
    <div className="relative" style={{ width: DIM, height: DIM, transform: `scale(${s})` }}>
      {/* ── Ground shadow ── */}
      <div className="absolute" style={{
        width: DIM - 10, height: DIM - 10, left: 5, top: 12,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 55%, transparent 72%)',
        filter: 'blur(14px)',
      }} />

      {/* ── Crust base ring ── */}
      <div className="absolute" style={{
        width: DIM - 6, height: DIM - 6, left: 3, top: 3,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 32% 28%, ${bs.hl} 0%, ${bs.l} 25%, ${bs.m} 55%, ${bs.d} 80%, #4A2A0A 100%)
        `,
        boxShadow: `
          inset 0 3px 10px rgba(255,255,255,0.18),
          inset 0 -4px 12px rgba(0,0,0,0.25),
          0 6px 24px rgba(0,0,0,0.35)
        `,
      }} />

      {/* ── Crust browning texture ── */}
      <div className="absolute" style={{
        width: DIM - 6, height: DIM - 6, left: 3, top: 3,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 18% 12%, rgba(160,114,74,0.4) 0%, transparent 6%),
          radial-gradient(circle at 82% 18%, rgba(139,94,52,0.35) 0%, transparent 5%),
          radial-gradient(circle at 88% 65%, rgba(160,114,74,0.3) 0%, transparent 7%),
          radial-gradient(circle at 35% 90%, rgba(139,94,52,0.35) 0%, transparent 5%),
          radial-gradient(circle at 12% 72%, rgba(160,114,74,0.3) 0%, transparent 6%),
          radial-gradient(circle at 65% 8%, rgba(210,168,90,0.2) 0%, transparent 4%),
          radial-gradient(circle at 92% 40%, rgba(139,94,52,0.2) 0%, transparent 5%)
        `,
      }} />

      {/* ── Crust edge bubbles ── */}
      <div className="absolute" style={{
        width: DIM - 6, height: DIM - 6, left: 3, top: 3,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 22% 8%, rgba(255,255,255,0.12) 0%, transparent 4%),
          radial-gradient(circle at 78% 14%, rgba(255,255,255,0.09) 0%, transparent 3.5%),
          radial-gradient(circle at 90% 58%, rgba(255,255,255,0.11) 0%, transparent 4%),
          radial-gradient(circle at 42% 92%, rgba(255,255,255,0.08) 0%, transparent 3%),
          radial-gradient(circle at 8% 68%, rgba(255,255,255,0.1) 0%, transparent 3.5%),
          radial-gradient(circle at 55% 5%, rgba(255,255,255,0.07) 0%, transparent 3%),
          radial-gradient(circle at 95% 30%, rgba(255,255,255,0.06) 0%, transparent 2.5%)
        `,
      }} />

      {/* ── Stuffed crust cheese dots ── */}
      {base === 'stuffed' && (
        <div className="absolute" style={{ width: DIM - 6, height: DIM - 6, left: 3, top: 3 }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const r = (DIM - 6) / 2 - bs.w / 2 + 2;
            const cx = (DIM - 6) / 2;
            const cy = (DIM - 6) / 2;
            const x = cx + Math.cos(angle) * r - 4;
            const y = cy + Math.sin(angle) * r - 4;
            return (
              <div key={i} className="absolute" style={{
                left: x, top: y, width: 9, height: 9, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #FFF8DC, #F5DEB3, #D4A574)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.3)',
              }} />
            );
          })}
        </div>
      )}

      {/* ── Sauce layer ── */}
      <AnimatePresence>
        {sauce && (
          <motion.div
            key={`sauce-${sauce}`}
            className="absolute"
            style={{
              width: DIM - bs.w * 2 - 14, height: DIM - bs.w * 2 - 14,
              left: bs.w + 7, top: bs.w + 7,
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 38% 32%, ${ss.gloss} 0%, transparent 40%),
                radial-gradient(circle at 42% 38%, ${ss.highlight} 0%, ${ss.mid} 35%, ${ss.base} 65%, ${ss.shadow} 100%)
              `,
              boxShadow: `
                inset 0 2px 12px rgba(0,0,0,0.12),
                inset 0 -1px 6px rgba(0,0,0,0.08)
              `,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          />
        )}
      </AnimatePresence>

      {/* ── Cheese layer ── */}
      <AnimatePresence>
        {cheese && (
          <motion.div
            key={`cheese-${cheese}`}
            className="absolute"
            style={{
              width: DIM - bs.w * 2 - 22, height: DIM - bs.w * 2 - 22,
              left: bs.w + 11, top: bs.w + 11,
              borderRadius: '50%',
              background: `
                radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.35) 0%, transparent 35%),
                radial-gradient(circle at 50% 50%, ${cs.highlight} 0%, ${cs.mid} 30%, ${cs.base} 60%, ${cs.shadow} 100%)
              `,
              boxShadow: `
                inset 0 2px 8px rgba(255,255,255,0.2),
                inset 0 -3px 8px rgba(0,0,0,0.06),
                0 1px 4px rgba(0,0,0,0.05)
              `,
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.08 }}
          />
        )}
      </AnimatePresence>

      {/* ── Cheese melt bubbles ── */}
      {cheese && (
        <div className="absolute" style={{
          width: DIM - bs.w * 2 - 22, height: DIM - bs.w * 2 - 22,
          left: bs.w + 11, top: bs.w + 11, borderRadius: '50%', pointerEvents: 'none',
        }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2 + 0.4;
            const r = 28 + (i % 3) * 18;
            const cx = (DIM - bs.w * 2 - 22) / 2;
            const cy = (DIM - bs.w * 2 - 22) / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            const sz = 6 + (i % 4) * 2;
            return (
              <div key={`cb-${i}`} className="absolute" style={{
                left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${cs.highlight}ee, ${cs.mid}88 60%, transparent 100%)`,
                boxShadow: `inset 0 0 2px rgba(255,255,255,0.15)`,
                opacity: 0.4 + (i % 3) * 0.15,
              }} />
            );
          })}
        </div>
      )}

      {/* ── Cheese browning spots ── */}
      {cheese && (
        <div className="absolute" style={{
          width: DIM - bs.w * 2 - 22, height: DIM - bs.w * 2 - 22,
          left: bs.w + 11, top: bs.w + 11, borderRadius: '50%', pointerEvents: 'none',
        }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2 + 1.2;
            const r = 25 + (i % 2) * 22;
            const cx = (DIM - bs.w * 2 - 22) / 2;
            const cy = (DIM - bs.w * 2 - 22) / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            return (
              <div key={`br-${i}`} className="absolute" style={{
                left: x - 5, top: y - 5, width: 10, height: 10, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(180,140,60,0.25) 0%, transparent 70%)',
                filter: 'blur(1px)',
              }} />
            );
          })}
        </div>
      )}

      {/* ── Draggable Toppings ── */}
      <div ref={pizzaRef} className="absolute inset-0" style={{ borderRadius: '50%' }}>
        <AnimatePresence>
          {(() => {
            const instances = [];
            let globalIdx = 0;
            Object.entries(veggies).forEach(([vid, qty]) => {
              const cfg = TOPPING_RENDER[vid];
              if (!cfg || qty <= 0) return;
              const positions = cfg.positions || [];
              const ToppingComp = TOPPING_COMPONENTS[vid];
              const tSize = TOPPING_SIZES[vid] || 22;
              for (let q = 0; q < qty; q++) {
                const defaultPos = positions[globalIdx % positions.length] || { x: 50, y: 50, r: 0 };
                const key = `${vid}-${globalIdx}`;
                const currentPos = dragPositionsRef.current[key] || defaultPos;
                const version = dragVersions[key] || 0;
                instances.push(
                  <motion.div
                    key={`drag-${key}-${version}`}
                    drag
                    dragConstraints={pizzaRef}
                    dragElastic={0.08}
                    dragMomentum={false}
                    dragTransition={{
                      bounceStiffness: 500,
                      bounceDamping: 30,
                      power: 0.3,
                      timeConstant: 200,
                    }}
                    whileDrag={{
                      scale: 1.25,
                      zIndex: 200,
                      cursor: 'grabbing',
                      filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))',
                      transition: { type: 'spring', stiffness: 400, damping: 25 },
                    }}
                    onDragEnd={(e, info) => handleDragEnd(vid, globalIdx, defaultPos, tSize, e, info)}
                    initial={{ scale: 0.6, opacity: 0, y: -12 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotate: defaultPos.r,
                      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.35))',
                    }}
                    exit={{ scale: 0.4, opacity: 0, y: 8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 320,
                      damping: 22,
                      delay: globalIdx * 0.04,
                    }}
                    style={{
                      position: 'absolute',
                      left: `${currentPos.x}%`,
                      top: `${currentPos.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10 + globalIdx,
                      cursor: 'grab',
                      touchAction: 'none',
                      willChange: 'transform',
                    }}
                  >
                    {ToppingComp ? <ToppingComp size={tSize} /> : null}
                  </motion.div>
                );
                globalIdx++;
              }
            });
            return instances;
          })()}
        </AnimatePresence>
      </div>

      {/* ── Top lighting overlay ── */}
      <div className="absolute pointer-events-none" style={{
        width: DIM - bs.w * 2 - 22, height: DIM - bs.w * 2 - 22,
        left: bs.w + 11, top: bs.w + 11,
        borderRadius: '50%',
        background: `
          radial-gradient(ellipse at 32% 22%, rgba(255,255,255,0.12) 0%, transparent 45%),
          radial-gradient(ellipse at 68% 78%, rgba(0,0,0,0.04) 0%, transparent 35%)
        `,
        zIndex: 30,
      }} />

      {/* ── Outer rim specular highlight ── */}
      <div className="absolute pointer-events-none" style={{
        width: DIM - 6, height: DIM - 6, left: 3, top: 3,
        borderRadius: '50%',
        background: `
          radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.1) 0%, transparent 25%),
          radial-gradient(ellipse at 72% 82%, rgba(0,0,0,0.06) 0%, transparent 25%)
        `,
        zIndex: 35,
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   INGREDIENT CHIP (for the list below the pizza)
   ══════════════════════════════════════════════════════════════ */

function IngredientChip({ emoji, name, price, qty, delay = 0, iconId }) {
  const { isDark } = useDarkMode();
  const IconComponent = BUILDER_ICONS[iconId] || TOPPING_ICONS[iconId];
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22, delay }}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold',
        isDark ? 'bg-white/[0.06] text-white/60 border border-white/[0.06]' : 'bg-surface-50 text-surface-600 border border-surface-100'
      )}
    >
      {IconComponent ? <IconComponent size={14} /> : <span className="text-xs">{emoji}</span>}
      {name}
      {qty > 1 && (
        <span className={cn('font-bold', isDark ? 'text-white/70' : 'text-surface-700')}>×{qty}</span>
      )}
      {price > 0 && (
        <span className={cn('ml-0.5', isDark ? 'text-accent-400' : 'text-accent-600')}>
          +${price.toFixed(2)}
        </span>
      )}
    </motion.span>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORTED COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function PizzaPreview({ builder, allIngredients, isOpen, onToggle }) {
  const { isDark } = useDarkMode();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const chips = useMemo(() => {
    const c = [];
    if (builder.base) {
      const opt = allIngredients.base.find((b) => b.id === builder.base);
      if (opt) c.push({ emoji: opt.emoji, name: opt.name, price: opt.price, key: 'base', iconId: opt.id });
    }
    if (builder.sauce) {
      const opt = allIngredients.sauce.find((s) => s.id === builder.sauce);
      if (opt) c.push({ emoji: opt.emoji, name: opt.name, price: opt.price, key: 'sauce', iconId: opt.id });
    }
    if (builder.cheese) {
      const opt = allIngredients.cheese.find((c) => c.id === builder.cheese);
      if (opt) c.push({ emoji: opt.emoji, name: opt.name, price: opt.price, key: 'cheese', iconId: opt.id });
    }
    Object.entries(builder.veggies).forEach(([vid, qty]) => {
      const opt = allIngredients.veggies.find((v) => v.id === vid);
      if (opt) c.push({ emoji: opt.emoji, name: opt.name, price: opt.price * qty, qty, key: vid, iconId: opt.id });
    });
    return c;
  }, [builder, allIngredients]);

  const hasAny = builder.base || builder.sauce || builder.cheese || Object.keys(builder.veggies).length > 0;

  const previewContent = (
    <div className={cn(
      'rounded-2xl border overflow-hidden transition-colors duration-300',
      isDark ? 'border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01]' : 'border-surface-200/80 bg-gradient-to-b from-white to-surface-50'
    )}>
      {/* Header */}
      <div className={cn(
        'px-5 py-3.5 border-b',
        isDark ? 'border-white/[0.06]' : 'border-surface-100'
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={cn('font-display font-bold text-sm', isDark ? 'text-white' : 'text-surface-900')}>
              Live Preview
            </h3>
            <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-surface-400')}>
              {hasAny ? 'Your custom creation' : 'Start building above'}
            </p>
          </div>
          <div className={cn(
            'w-2 h-2 rounded-full',
            hasAny ? 'bg-success-500 animate-pulse' : isDark ? 'bg-white/10' : 'bg-surface-200'
          )} />
        </div>
      </div>

      {/* Pizza canvas */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          minHeight: 300,
          background: isDark
            ? 'radial-gradient(circle at 50% 45%, rgba(230,57,70,0.05) 0%, transparent 60%)'
            : 'radial-gradient(circle at 50% 45%, rgba(230,57,70,0.03) 0%, transparent 60%)',
        }}
      >
        {/* Ambient warm glow */}
        <div className="absolute pointer-events-none" style={{
          width: 220, height: 220,
          left: '50%', top: '50%',
          transform: 'translate(-50%, -55%)',
          background: 'radial-gradient(circle, rgba(230,57,70,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />

        {/* Pizza */}
        <motion.div
          className="relative"
          style={{ transformOrigin: 'center center' }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PizzaCanvas
            base={builder.base}
            sauce={builder.sauce}
            cheese={builder.cheese}
            veggies={builder.veggies}
            size={builder.size}
          />
        </motion.div>

        {/* Empty state */}
        {!hasAny && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <svg className="w-8 h-8" style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" />
                </svg>
              </div>
              <p className={cn('text-xs font-medium', isDark ? 'text-white/30' : 'text-surface-400')}>
                Choose a base to begin
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Ingredient chips */}
      <div className={cn(
        'px-5 py-3.5 border-t',
        isDark ? 'border-white/[0.06]' : 'border-surface-100'
      )}>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence mode="popLayout">
            {chips.map((chip, i) => (
              <IngredientChip key={chip.key} {...chip} delay={i * 0.03} />
            ))}
          </AnimatePresence>
          {!hasAny && (
            <p className={cn('text-[11px] w-full text-center py-1', isDark ? 'text-white/25' : 'text-surface-300')}>
              Ingredients appear here as you select them
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <motion.button
          type="button"
          onClick={onToggle}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-40 lg:hidden',
            'flex items-center justify-between px-5 py-3.5',
            'border-t backdrop-blur-xl',
            isDark
              ? 'border-white/[0.06] bg-dark-950/90'
              : 'border-surface-200 bg-white/90'
          )}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center',
              isDark ? 'bg-brand-500/15' : 'bg-brand-50'
            )}>
              <span className="text-base">🍕</span>
            </div>
            <div className="text-left">
              <span className={cn('text-sm font-semibold block', isDark ? 'text-white' : 'text-surface-900')}>
                {isOpen ? 'Hide Preview' : 'View Preview'}
              </span>
              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-surface-400')}>
                {chips.length > 0 ? `${chips.length} ingredients` : 'Empty'}
              </span>
            </div>
          </div>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-surface-400')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </motion.svg>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-[52px] left-0 right-0 z-30 lg:hidden max-h-[60vh] overflow-y-auto"
            >
              {previewContent}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="sticky top-6">
      {previewContent}
    </div>
  );
}
