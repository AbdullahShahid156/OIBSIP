import { memo, useMemo, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { useDarkMode, useMediaQuery } from '../../hooks';
import { INGREDIENT_PHOTOS } from '../../data/images';

const PIZZA_DIM = 300;

/* ── Premium Sauce palette ─────────────────────────────────── */
const SAUCE_STYLES = {
  marinara:     { base: '#B5342A', mid: '#D94438', highlight: '#F06050', shadow: '#7A1E16', gloss: 'rgba(255,95,65,0.4)' },
  pesto:        { base: '#1E6B42', mid: '#2D8F5A', highlight: '#44B874', shadow: '#0F3D24', gloss: 'rgba(68,184,116,0.4)' },
  bbq:          { base: '#4A2208', mid: '#6B3510', highlight: '#8E4D1C', shadow: '#2C1405', gloss: 'rgba(142,77,28,0.35)' },
  garlic_white: { base: '#E8D8BE', mid: '#F2E6D0', highlight: '#FFF6E8', shadow: '#C4B090', gloss: 'rgba(255,246,232,0.55)' },
  buffalo:      { base: '#C44020', mid: '#E05828', highlight: '#F47840', shadow: '#842810', gloss: 'rgba(244,120,64,0.4)' },
};

/* ── Premium Cheese palette ─────────────────────────────────── */
const CHEESE_STYLES = {
  mozzarella: { base: '#F5E6B8', mid: '#FCEFD0', highlight: '#FFFDF5', shadow: '#D4C48E', gloss: 'rgba(255,253,245,0.65)', name: 'Mozzarella' },
  parmesan:   { base: '#E8D49A', mid: '#F0DEB0', highlight: '#FFF6DC', shadow: '#C4A86A', gloss: 'rgba(255,246,220,0.45)', name: 'Parmigiano' },
  provolone:  { base: '#ECD888', mid: '#F4E4A0', highlight: '#FFFCDA', shadow: '#C4A850', gloss: 'rgba(255,252,218,0.5)', name: 'Provolone' },
  gouda:      { base: '#F0C040', mid: '#F8D060', highlight: '#FFE888', shadow: '#C09020', gloss: 'rgba(255,232,136,0.5)', name: 'Gouda' },
  vegan:      { base: '#EAE4D0', mid: '#F0ECE0', highlight: '#FDFCF8', shadow: '#C8C2B0', gloss: 'rgba(253,252,248,0.45)', name: 'Vegan' },
};

/* ── Premium Crust palette ─────────────────────────────────── */
const BASE_STYLES = {
  thin:        { w: 9,  d: '#6A4A18', m: '#8E6830', l: '#B89050', hl: '#D0A868', label: 'Thin' },
  regular:     { w: 13, d: '#7A5020', m: '#9A6A38', l: '#BE8C54', hl: '#D4A46C', label: 'Regular' },
  thick:       { w: 17, d: '#5A3010', m: '#7A4A20', l: '#A06A38', hl: '#BC8250', label: 'Thick' },
  stuffed:     { w: 19, d: '#6A4A18', m: '#8A6430', l: '#B89050', hl: '#CCA464', label: 'Stuffed' },
  gluten_free: { w: 11, d: '#4A6838', m: '#6A8A58', l: '#8AAA78', hl: '#A0C490', label: 'GF Cauliflower' },
};

/* ══════════════════════════════════════════════════════════════
   PREMIUM 3D TOPPING COMPONENTS
   Each renders a polished, stylized food illustration with
   layered gradients, specular highlights, and soft shadows.
   ══════════════════════════════════════════════════════════════ */

function MushroomSlice({ size = 28 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {/* Shadow underneath */}
      <div style={{
        position: 'absolute', bottom: '2%', left: '15%', width: '70%', height: '20%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Cap — 3D dome shape */}
      <div style={{
        position: 'absolute', bottom: '28%', left: '8%', right: '8%', height: '52%',
        borderRadius: '52% 52% 12% 12%',
        background: `
          radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.18) 0%, transparent 45%),
          linear-gradient(160deg, #D4A878 0%, #B08050 25%, #8A6038 55%, #6A4428 85%, #4A2E18 100%)
        `,
        boxShadow: `
          0 3px 8px rgba(60,30,10,0.4),
          inset 0 -3px 6px rgba(0,0,0,0.15),
          inset 0 2px 4px rgba(255,220,180,0.2)
        `,
      }} />
      {/* Cap top highlight — specular */}
      <div style={{
        position: 'absolute', bottom: '58%', left: '20%', width: '35%', height: '16%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, transparent 70%)',
      }} />
      {/* Gills — underside texture */}
      <div style={{
        position: 'absolute', bottom: '28%', left: '18%', right: '18%', height: '18%',
        borderRadius: '0 0 40% 40%',
        background: 'linear-gradient(180deg, rgba(120,80,40,0.3) 0%, rgba(80,50,20,0.15) 100%)',
      }} />
      {/* Stem */}
      <div style={{
        position: 'absolute', bottom: '6%', left: '30%', right: '30%', height: '30%',
        borderRadius: '25% 25% 30% 30%',
        background: 'linear-gradient(180deg, #F0E0C8 0%, #E0CCA8 40%, #D0B888 100%)',
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.15)',
      }} />
      {/* Stem highlight */}
      <div style={{
        position: 'absolute', bottom: '18%', left: '36%', width: '20%', height: '12%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function BellPepperSlice({ size = 26 }) {
  return (
    <div style={{ width: size, height: size * 0.72, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '0%', left: '12%', width: '76%', height: '18%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Outer wall — 3D curved shape */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '48% 48% 36% 36%',
        background: `
          radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.2) 0%, transparent 40%),
          linear-gradient(165deg, #5CB860 0%, #3A9040 25%, #287830 55%, #1A5A20 85%)
        `,
        boxShadow: `
          0 3px 10px rgba(20,60,20,0.35),
          inset 0 3px 6px rgba(255,255,255,0.15),
          inset 0 -3px 8px rgba(0,0,0,0.12)
        `,
      }} />
      {/* Inner wall — hollow center */}
      <div style={{
        position: 'absolute', top: '18%', left: '16%', right: '16%', bottom: '22%',
        borderRadius: '42%',
        background: 'linear-gradient(180deg, rgba(200,240,200,0.15) 0%, rgba(180,230,180,0.08) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }} />
      {/* Specular highlight — glossy pepper skin */}
      <div style={{
        position: 'absolute', top: '10%', left: '18%', width: '40%', height: '28%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.32) 0%, transparent 65%)',
      }} />
      {/* Secondary highlight */}
      <div style={{
        position: 'absolute', top: '20%', right: '20%', width: '20%', height: '15%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function RedOnionRing({ size = 26 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '5%', left: '10%', width: '80%', height: '20%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(80,10,40,0.15) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Outer ring — layered onion skin effect */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        border: `${size * 0.2}px solid transparent`,
        background: `
          linear-gradient(150deg, #9A1850 0%, #C22068 25%, #E03080 50%, #C22068 75%, #8A1040 100%) padding-box,
          linear-gradient(150deg, #F0C0D8 0%, #E8A0C0 30%, #D080A0 70%, #F0C0D8 100%) border-box
        `,
        boxShadow: `
          0 3px 10px rgba(120,20,60,0.3),
          inset 0 2px 4px rgba(255,255,255,0.12),
          inset 0 -2px 4px rgba(0,0,0,0.1)
        `,
      }} />
      {/* Inner layers — concentric rings */}
      <div style={{
        position: 'absolute', inset: '28%',
        borderRadius: '50%',
        border: `${size * 0.06}px solid rgba(220,160,190,0.3)`,
        background: 'radial-gradient(circle, rgba(255,220,240,0.12) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', inset: '40%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, rgba(255,240,248,0.15) 0%, rgba(200,140,170,0.08) 60%, transparent 80%)',
      }} />
      {/* Specular */}
      <div style={{
        position: 'absolute', top: '12%', left: '18%', width: '30%', height: '22%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.28) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function OliveSlice({ size = 22 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '5%', left: '8%', width: '84%', height: '20%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Olive flesh — dark glossy ring */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        border: `${size * 0.24}px solid #2A2520`,
        background: `linear-gradient(150deg, #3A5030 0%, #2A4020 30%, #1A3010 70%, #102008 100%)`,
        boxShadow: `
          0 3px 8px rgba(0,0,0,0.4),
          inset 0 2px 4px rgba(255,255,255,0.08),
          inset 0 -2px 4px rgba(0,0,0,0.2)
        `,
      }} />
      {/* Pit cavity — depth illusion */}
      <div style={{
        position: 'absolute', inset: '32%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 42% 40%, #5A4030 0%, #3A2818 50%, #2A1A10 100%)',
        boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5), inset 0 -1px 3px rgba(100,80,60,0.15)',
      }} />
      {/* Glossy highlight */}
      <div style={{
        position: 'absolute', top: '6%', left: '12%', width: '38%', height: '28%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 65%)',
      }} />
    </div>
  );
}

function TomatoSlice({ size = 24 }) {
  return (
    <div style={{ width: size, height: size * 0.65, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '0%', left: '10%', width: '80%', height: '18%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(120,10,10,0.15) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Tomato body — 3D curved half */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '52% 52% 42% 42%',
        background: `
          radial-gradient(ellipse at 32% 28%, rgba(255,255,255,0.22) 0%, transparent 35%),
          linear-gradient(160deg, #F06040 0%, #E04030 25%, #C82820 55%, #A01810 85%)
        `,
        boxShadow: `
          0 3px 10px rgba(140,20,15,0.35),
          inset 0 3px 5px rgba(255,150,120,0.2),
          inset 0 -2px 5px rgba(0,0,0,0.12)
        `,
      }} />
      {/* Seed chambers — subtle golden gel */}
      {[0.28, 0.5, 0.72].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: '28%', left: `${p * 78 + 8}%`, width: '16%', height: '48%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,210,120,0.3) 0%, rgba(255,180,80,0.12) 55%, transparent 80%)',
          transform: 'translate(-50%, 0)',
        }} />
      ))}
      {/* Glossy skin highlight */}
      <div style={{
        position: 'absolute', top: '12%', left: '14%', width: '38%', height: '28%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.32) 0%, transparent 65%)',
      }} />
    </div>
  );
}

function JalapenoSlice({ size = 22 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '5%', left: '8%', width: '84%', height: '18%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(20,50,20,0.15) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Outer ring — pepper wall */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 35% 30%, rgba(255,255,255,0.15) 0%, transparent 40%),
          linear-gradient(155deg, #48A048 0%, #348034 30%, #246824 65%, #184A18 100%)
        `,
        boxShadow: `
          0 3px 8px rgba(20,50,20,0.35),
          inset 0 2px 4px rgba(255,255,255,0.12),
          inset 0 -2px 4px rgba(0,0,0,0.1)
        `,
      }} />
      {/* Inner membrane */}
      <div style={{
        position: 'absolute', inset: '14%',
        borderRadius: '50%',
        border: '1px solid rgba(180,230,180,0.18)',
        background: 'radial-gradient(circle, rgba(160,220,160,0.1) 0%, transparent 65%)',
      }} />
      {/* Seeds — realistic oval shape */}
      {[
        { x: 32, y: 32 }, { x: 56, y: 28 }, { x: 42, y: 52 },
        { x: 62, y: 50 }, { x: 48, y: 70 }, { x: 68, y: 66 },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: '9%', height: '13%',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%) rotate(18deg)',
          background: 'linear-gradient(180deg, #FFF8E0 0%, #F0E0A0 50%, #E0C870 100%)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15), inset 0 0.5px 1px rgba(255,255,255,0.4)',
        }} />
      ))}
      {/* Glossy highlight */}
      <div style={{
        position: 'absolute', top: '8%', left: '14%', width: '38%', height: '26%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.28) 0%, transparent 65%)',
      }} />
    </div>
  );
}

function SpinachLeaf({ size = 26 }) {
  return (
    <div style={{ width: size, height: size * 0.72, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '2%', left: '10%', width: '80%', height: '18%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(20,60,20,0.15) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Leaf body — organic shape with depth */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '72% 28% 68% 32%',
        background: `
          radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.15) 0%, transparent 40%),
          linear-gradient(140deg, #5AAA50 0%, #3A8A38 25%, #286A28 55%, #1A4A1A 85%)
        `,
        boxShadow: `
          0 3px 10px rgba(20,60,20,0.3),
          inset 0 2px 4px rgba(255,255,255,0.12),
          inset 0 -2px 4px rgba(0,0,0,0.1)
        `,
      }} />
      {/* Center vein — main rib */}
      <div style={{
        position: 'absolute', top: '18%', left: '47%', width: '5%', height: '68%',
        borderRadius: '3px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(200,230,200,0.08) 100%)',
      }} />
      {/* Side veins */}
      {[28, 42, 56, 68].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${p}%`, left: '22%', width: '56%', height: '1px',
          background: 'rgba(255,255,255,0.08)',
          transform: `rotate(${i % 2 ? 12 : -12}deg)`,
        }} />
      ))}
      {/* Glossy highlight */}
      <div style={{
        position: 'absolute', top: '10%', left: '14%', width: '42%', height: '28%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 65%)',
      }} />
    </div>
  );
}

function ArtichokePiece({ size = 26 }) {
  return (
    <div style={{ width: size, height: size * 0.82, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '2%', left: '10%', width: '80%', height: '18%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(30,60,20,0.15) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Artichoke body — layered leaf shape */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50% 50% 28% 28%',
        background: `
          radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.15) 0%, transparent 40%),
          linear-gradient(155deg, #8AB848 0%, #6A9838 25%, #508028 55%, #386018 85%)
        `,
        boxShadow: `
          0 3px 8px rgba(40,70,20,0.3),
          inset 0 2px 4px rgba(255,255,255,0.1),
          inset 0 -2px 4px rgba(0,0,0,0.1)
        `,
      }} />
      {/* Layer lines — overlapping leaves */}
      {[28, 42, 56].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${p}%`, left: '14%', right: '14%', height: '1px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
        }} />
      ))}
      {/* Glossy highlight */}
      <div style={{
        position: 'absolute', top: '10%', left: '18%', width: '38%', height: '26%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 65%)',
      }} />
    </div>
  );
}

function ArugulaLeaf({ size = 26 }) {
  return (
    <div style={{ width: size, height: size * 0.68, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '2%', left: '8%', width: '84%', height: '16%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(30,60,20,0.12) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Leaf body — elongated jagged shape */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '62% 38% 58% 42% / 52% 48% 52% 48%',
        background: `
          radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 38%),
          linear-gradient(135deg, #6AAA38 0%, #4A8828 30%, #386820 65%, #285018 100%)
        `,
        boxShadow: `
          0 2px 8px rgba(30,60,20,0.28),
          inset 0 2px 3px rgba(255,255,255,0.1),
          inset 0 -1px 3px rgba(0,0,0,0.08)
        `,
      }} />
      {/* Jagged edge illusion */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        boxShadow: 'inset 2px 0 4px -2px rgba(30,60,20,0.25), inset -2px 0 4px -2px rgba(30,60,20,0.25)',
      }} />
      {/* Center vein */}
      <div style={{
        position: 'absolute', top: '18%', left: '47%', width: '5%', height: '62%',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.1)',
      }} />
      {/* Glossy highlight */}
      <div style={{
        position: 'absolute', top: '10%', left: '18%', width: '38%', height: '24%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 65%)',
      }} />
    </div>
  );
}

function CaramelizedOnionStrip({ size = 24 }) {
  return (
    <div style={{ width: size, height: size * 0.32, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '0%', left: '5%', width: '90%', height: '30%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(80,50,10,0.15) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Onion strip — caramelized golden color */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '42% 58% 52% 48% / 82% 78% 22% 18%',
        background: `
          linear-gradient(90deg, #7A5828 0%, #9A7038 20%, #C49850 45%, #B08840 65%, #8A6030 85%, #6A4420 100%)
        `,
        boxShadow: `
          0 2px 6px rgba(60,35,10,0.3),
          inset 0 1px 3px rgba(255,220,140,0.2),
          inset 0 -1px 2px rgba(0,0,0,0.1)
        `,
      }} />
      {/* Glossy caramel sheen */}
      <div style={{
        position: 'absolute', top: '10%', left: '18%', width: '45%', height: '40%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,230,150,0.3) 0%, transparent 65%)',
      }} />
      {/* Texture lines */}
      <div style={{
        position: 'absolute', top: '35%', left: '15%', right: '15%', height: '1px',
        background: 'rgba(255,220,140,0.15)',
      }} />
    </div>
  );
}

function SunDriedTomato({ size = 22 }) {
  return (
    <div style={{ width: size, height: size * 0.72, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '2%', left: '8%', width: '84%', height: '18%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(80,0,0,0.15) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Tomato body — dark red, wrinkled */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '46% 54% 52% 48% / 58% 56% 44% 42%',
        background: `
          radial-gradient(ellipse at 30% 25%, rgba(255,180,180,0.15) 0%, transparent 35%),
          linear-gradient(145deg, #A01818 0%, #801010 30%, #600808 65%, #400404 100%)
        `,
        boxShadow: `
          0 3px 8px rgba(60,0,0,0.4),
          inset 0 2px 3px rgba(255,160,160,0.1),
          inset 0 -1px 3px rgba(0,0,0,0.15)
        `,
      }} />
      {/* Wrinkle texture — dehydration lines */}
      {[28, 45, 62].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${p}%`, left: '12%', right: '12%', height: '1px',
          background: 'rgba(0,0,0,0.18)',
          transform: `rotate(${(i - 1) * 6}deg)`,
        }} />
      ))}
      {/* Subtle gloss */}
      <div style={{
        position: 'absolute', top: '12%', left: '14%', width: '35%', height: '28%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,200,200,0.18) 0%, transparent 65%)',
      }} />
    </div>
  );
}

function TruffleOilDrop({ size = 16 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '8%', left: '10%', width: '80%', height: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }} />
      {/* Oil droplet — golden, glossy */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 32% 30%, rgba(255,255,255,0.35) 0%, transparent 40%),
          radial-gradient(circle at 50% 55%, #D4A830 0%, #B89020 40%, #987818 70%, #786010 100%)
        `,
        boxShadow: `
          0 2px 8px rgba(120,90,20,0.4),
          0 0 10px rgba(200,160,50,0.25),
          inset 0 1px 3px rgba(255,255,255,0.25)
        `,
      }} />
      {/* Specular highlight */}
      <div style={{
        position: 'absolute', top: '14%', left: '18%', width: '32%', height: '28%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)',
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
  mushrooms: 30, bell_peppers: 28, red_onion: 28, olives: 24,
  tomatoes: 26, jalapenos: 24, spinach: 28, artichoke: 28,
  arugula: 28, caramelized_onion: 26, sun_dried_tomato: 24, truffle_oil: 16,
};

/* ── Topping rendering positions ─────────────────────────────── */
const TOPPING_RENDER = {
  mushrooms: {
    positions: [
      { x: 35, y: 32, r: -12 }, { x: 58, y: 35, r: 8 }, { x: 42, y: 50, r: -5 },
      { x: 65, y: 48, r: 15 }, { x: 28, y: 58, r: -8 }, { x: 55, y: 65, r: 3 },
      { x: 38, y: 72, r: -18 }, { x: 62, y: 70, r: 10 }, { x: 48, y: 42, r: -3 },
    ],
  },
  bell_peppers: {
    positions: [
      { x: 32, y: 35, r: 25 }, { x: 58, y: 32, r: -15 }, { x: 45, y: 48, r: 40 },
      { x: 65, y: 55, r: -30 }, { x: 35, y: 60, r: 10 }, { x: 52, y: 68, r: -20 },
      { x: 72, y: 45, r: 35 }, { x: 40, y: 75, r: -10 }, { x: 60, y: 78, r: 20 },
    ],
  },
  red_onion: {
    positions: [
      { x: 48, y: 30, r: 5 }, { x: 30, y: 42, r: -10 }, { x: 68, y: 40, r: 15 },
      { x: 42, y: 55, r: -8 }, { x: 58, y: 58, r: 12 }, { x: 25, y: 55, r: -5 },
      { x: 72, y: 55, r: 8 }, { x: 45, y: 70, r: -15 }, { x: 62, y: 72, r: 10 },
    ],
  },
  olives: {
    positions: [
      { x: 50, y: 28, r: 0 }, { x: 35, y: 38, r: 15 }, { x: 65, y: 36, r: -10 },
      { x: 28, y: 52, r: 8 }, { x: 52, y: 50, r: -5 }, { x: 75, y: 48, r: 12 },
      { x: 40, y: 65, r: -8 }, { x: 60, y: 62, r: 5 }, { x: 50, y: 75, r: -12 },
    ],
  },
  tomatoes: {
    positions: [
      { x: 42, y: 34, r: 10 }, { x: 62, y: 32, r: -8 }, { x: 38, y: 50, r: 15 },
      { x: 58, y: 52, r: -12 }, { x: 32, y: 62, r: 5 }, { x: 55, y: 68, r: -15 },
      { x: 72, y: 58, r: 8 }, { x: 45, y: 75, r: -5 }, { x: 65, y: 72, r: 12 },
    ],
  },
  spinach: {
    positions: [
      { x: 45, y: 32, r: 20 }, { x: 55, y: 40, r: -25 }, { x: 35, y: 45, r: 35 },
      { x: 65, y: 48, r: -15 }, { x: 48, y: 58, r: 10 }, { x: 30, y: 58, r: -30 },
      { x: 70, y: 55, r: 25 }, { x: 52, y: 70, r: -20 }, { x: 40, y: 68, r: 15 },
    ],
  },
  jalapenos: {
    positions: [
      { x: 52, y: 30, r: 15 }, { x: 38, y: 40, r: -20 }, { x: 62, y: 38, r: 5 },
      { x: 45, y: 52, r: -10 }, { x: 28, y: 52, r: 25 }, { x: 68, y: 50, r: -15 },
      { x: 55, y: 65, r: 10 }, { x: 35, y: 65, r: -8 }, { x: 65, y: 68, r: 20 },
    ],
  },
  artichoke: {
    positions: [
      { x: 40, y: 35, r: 10 }, { x: 60, y: 35, r: -15 }, { x: 35, y: 50, r: 20 },
      { x: 55, y: 50, r: -10 }, { x: 70, y: 45, r: 5 }, { x: 42, y: 62, r: -20 },
      { x: 58, y: 65, r: 15 }, { x: 48, y: 75, r: -5 }, { x: 32, y: 72, r: 10 },
    ],
  },
  arugula: {
    positions: [
      { x: 50, y: 35, r: 30 }, { x: 35, y: 45, r: -20 }, { x: 65, y: 42, r: 15 },
      { x: 45, y: 55, r: -25 }, { x: 60, y: 58, r: 10 }, { x: 30, y: 60, r: -15 },
      { x: 72, y: 55, r: 25 }, { x: 52, y: 70, r: -10 }, { x: 40, y: 72, r: 20 },
    ],
  },
  caramelized_onion: {
    positions: [
      { x: 48, y: 32, r: -5 }, { x: 38, y: 42, r: 10 }, { x: 58, y: 40, r: -15 },
      { x: 42, y: 55, r: 8 }, { x: 62, y: 52, r: -12 }, { x: 35, y: 62, r: 5 },
      { x: 55, y: 62, r: -8 }, { x: 68, y: 60, r: 15 }, { x: 50, y: 75, r: -10 },
    ],
  },
  sun_dried_tomato: {
    positions: [
      { x: 52, y: 35, r: 12 }, { x: 40, y: 38, r: -8 }, { x: 60, y: 42, r: 18 },
      { x: 35, y: 52, r: -15 }, { x: 55, y: 55, r: 5 }, { x: 70, y: 50, r: -10 },
      { x: 42, y: 65, r: 15 }, { x: 62, y: 68, r: -12 }, { x: 50, y: 78, r: 8 },
    ],
  },
  truffle_oil: {
    positions: [
      { x: 50, y: 30, r: 0 }, { x: 35, y: 40, r: 0 }, { x: 65, y: 38, r: 0 },
      { x: 45, y: 50, r: 0 }, { x: 58, y: 55, r: 0 }, { x: 30, y: 55, r: 0 },
      { x: 70, y: 52, r: 0 }, { x: 52, y: 68, r: 0 }, { x: 42, y: 72, r: 0 },
      { x: 60, y: 65, r: 0 }, { x: 38, y: 58, r: 0 }, { x: 68, y: 72, r: 0 },
    ],
  },
};

/* ══════════════════════════════════════════════════════════════
   DRAGGABLE TOPPING — uses Framer Motion drag
   ══════════════════════════════════════════════════════════════ */

function clampToCircle(xPct, yPct, dim, toppingRadius) {
  const cx = dim / 2;
  const cy = dim / 2;
  const maxR = dim / 2 - toppingRadius - 10;
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
   MAIN PIZZA CANVAS — Premium 3D stylized rendering
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

  /* ── Pre-compute layer geometry ── */
  const crustOuter = DIM - 4;
  const crustCx = crustOuter / 2;
  const crustCy = crustOuter / 2;
  const sauceSize = DIM - bs.w * 2 - 18;
  const sauceOff = (DIM - sauceSize) / 2;
  const cheeseSize = DIM - bs.w * 2 - 30;
  const cheeseOff = (DIM - cheeseSize) / 2;

  return (
    <div className="relative" style={{ width: DIM, height: DIM, transform: `scale(${s})` }}>

      {/* ── 1. Ground shadow ── */}
      <div className="absolute" style={{
        width: crustOuter + 16, height: crustOuter + 10,
        left: -6, top: 16,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.07) 48%, transparent 70%)',
        filter: 'blur(18px)',
      }} />

      {/* ════════════════════════════════════════════════════════
         2. CRUST — Raised rim with 3D depth
         ════════════════════════════════════════════════════════ */}

      {/* Crust body — the raised outer ring */}
      <div className="absolute" style={{
        width: crustOuter, height: crustOuter, left: 2, top: 2,
        borderRadius: '49% 51% 50% 50% / 50% 49% 51% 50%',
        background: `
          radial-gradient(circle at 28% 24%, ${bs.hl} 0%, ${bs.l} 18%, ${bs.m} 45%, ${bs.d} 72%, #3A1A08 100%)
        `,
        boxShadow: `
          inset 0 5px 18px rgba(255,255,255,0.18),
          inset 0 -6px 20px rgba(0,0,0,0.28),
          0 8px 36px rgba(0,0,0,0.38),
          0 3px 10px rgba(0,0,0,0.22)
        `,
      }} />

      {/* Crust surface texture — scattered browning */}
      <div className="absolute" style={{
        width: crustOuter, height: crustOuter, left: 2, top: 2,
        borderRadius: '49% 51% 50% 50% / 50% 49% 51% 50%',
        background: `
          radial-gradient(circle at 14% 8%, rgba(130,88,42,0.45) 0%, transparent 5.5%),
          radial-gradient(circle at 86% 14%, rgba(110,74,36,0.4) 0%, transparent 5%),
          radial-gradient(circle at 92% 60%, rgba(130,88,42,0.35) 0%, transparent 6%),
          radial-gradient(circle at 28% 94%, rgba(110,74,36,0.4) 0%, transparent 5%),
          radial-gradient(circle at 8% 68%, rgba(130,88,42,0.35) 0%, transparent 5.5%),
          radial-gradient(circle at 60% 4%, rgba(170,130,60,0.25) 0%, transparent 4%),
          radial-gradient(circle at 96% 36%, rgba(110,74,36,0.25) 0%, transparent 4.5%),
          radial-gradient(circle at 48% 98%, rgba(130,88,42,0.2) 0%, transparent 3.5%)
        `,
      }} />

      {/* Crust bubble highlights — raised air pockets */}
      <div className="absolute" style={{
        width: crustOuter, height: crustOuter, left: 2, top: 2,
        borderRadius: '49% 51% 50% 50% / 50% 49% 51% 50%',
        background: `
          radial-gradient(circle at 18% 4%, rgba(255,255,255,0.16) 0%, transparent 3.8%),
          radial-gradient(circle at 82% 10%, rgba(255,255,255,0.12) 0%, transparent 3.2%),
          radial-gradient(circle at 94% 54%, rgba(255,255,255,0.14) 0%, transparent 3.8%),
          radial-gradient(circle at 36% 96%, rgba(255,255,255,0.1) 0%, transparent 2.8%),
          radial-gradient(circle at 4% 64%, rgba(255,255,255,0.13) 0%, transparent 3.2%),
          radial-gradient(circle at 52% 2%, rgba(255,255,255,0.09) 0%, transparent 2.8%),
          radial-gradient(circle at 70% 90%, rgba(255,255,255,0.08) 0%, transparent 2.5%)
        `,
      }} />

      {/* Crust rim — inner shadow to create "raised edge" 3D illusion */}
      <div className="absolute pointer-events-none" style={{
        width: crustOuter, height: crustOuter, left: 2, top: 2,
        borderRadius: '49% 51% 50% 50% / 50% 49% 51% 50%',
        boxShadow: `
          inset 0 0 ${bs.w + 2}px ${bs.w - 2}px rgba(0,0,0,0.12),
          inset 0 0 ${bs.w - 2}px ${bs.w - 6}px rgba(0,0,0,0.06)
        `,
      }} />

      {/* Crust top-left specular — 3D highlight on the raised edge */}
      <div className="absolute pointer-events-none" style={{
        width: crustOuter, height: crustOuter, left: 2, top: 2,
        borderRadius: '49% 51% 50% 50% / 50% 49% 51% 50%',
        background: `
          radial-gradient(ellipse at 24% 14%, rgba(255,255,255,0.14) 0%, transparent 22%),
          radial-gradient(ellipse at 76% 86%, rgba(0,0,0,0.08) 0%, transparent 22%)
        `,
        zIndex: 35,
      }} />

      {/* ════════════════════════════════════════════════════════
         3. CRUST CENTER WELL — depressed flat area
         ════════════════════════════════════════════════════════ */}

      {/* Inner depression — slightly darker, flatter surface */}
      <div className="absolute" style={{
        width: sauceSize + 8, height: sauceSize + 8,
        left: sauceOff - 4, top: sauceOff - 4,
        borderRadius: '49% 51% 50% 50% / 50% 50% 50% 50%',
        background: `
          radial-gradient(circle at 48% 46%,
            ${bs.m}cc 0%,
            ${bs.d}dd 45%,
            ${bs.d} 100%
          )
        `,
        boxShadow: `
          inset 0 2px 8px rgba(0,0,0,0.15),
          inset 0 -1px 4px rgba(0,0,0,0.08)
        `,
      }} />

      {/* Stuffed crust cheese peek */}
      {base === 'stuffed' && (
        <div className="absolute" style={{ width: crustOuter, height: crustOuter, left: 2, top: 2 }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const r = crustOuter / 2 - bs.w / 2 + 3;
            const x = crustCx + Math.cos(angle) * r - 4;
            const y = crustCy + Math.sin(angle) * r - 4;
            return (
              <div key={i} className="absolute" style={{
                left: x, top: y, width: 8, height: 8, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #FFF8DC, #F0DCA0, #D4A860)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.35)',
              }} />
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
         4. SAUCE — Spread on dough, textured, depth
         ════════════════════════════════════════════════════════ */}

      <AnimatePresence>
        {sauce && (
          <motion.div
            key={`sauce-${sauce}`}
            className="absolute"
            style={{
              width: sauceSize, height: sauceSize,
              left: sauceOff, top: sauceOff,
              borderRadius: '50% 49% 51% 50% / 50% 51% 49% 50%',
              background: `
                radial-gradient(circle at 34% 28%, ${ss.gloss} 0%, transparent 36%),
                radial-gradient(circle at 62% 68%, ${ss.shadow}88 0%, transparent 30%),
                radial-gradient(ellipse at 40% 35%, ${ss.highlight} 0%, ${ss.mid} 28%, ${ss.base} 55%, ${ss.shadow} 100%)
              `,
              boxShadow: `
                inset 0 3px 14px rgba(0,0,0,0.12),
                inset 0 -2px 10px rgba(0,0,0,0.08),
                inset 3px 0 8px rgba(0,0,0,0.04),
                inset -3px 0 8px rgba(0,0,0,0.04)
              `,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
          />
        )}
      </AnimatePresence>

      {/* Sauce texture — subtle spread marks and uneven surface */}
      {sauce && (
        <div className="absolute pointer-events-none" style={{
          width: sauceSize, height: sauceSize,
          left: sauceOff, top: sauceOff,
          borderRadius: '50% 49% 51% 50% / 50% 51% 49% 50%',
        }}>
          {/* Spread ripple — concentric rings from center */}
          <div style={{
            position: 'absolute', inset: '8%',
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,0.04)`,
          }} />
          <div style={{
            position: 'absolute', inset: '18%',
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,0.03)`,
          }} />
          <div style={{
            position: 'absolute', inset: '28%',
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,0.02)`,
          }} />
          {/* Darker edge ring — sauce pools near crust */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: 'inherit',
            boxShadow: `
              inset 0 0 ${Math.max(sauceSize * 0.12, 8)}px ${Math.max(sauceSize * 0.04, 3)}px rgba(0,0,0,0.1)
            `,
          }} />
          {/* Surface texture — tomato pulp spots */}
          {[
            { x: 30, y: 25, s: 14, o: 0.08 },
            { x: 65, y: 30, s: 12, o: 0.06 },
            { x: 45, y: 55, s: 16, o: 0.07 },
            { x: 25, y: 60, s: 11, o: 0.06 },
            { x: 70, y: 65, s: 13, o: 0.08 },
            { x: 50, y: 40, s: 10, o: 0.05 },
            { x: 35, y: 75, s: 12, o: 0.06 },
          ].map((p, i) => (
            <div key={`sp-${i}`} style={{
              position: 'absolute',
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.s, height: p.s,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,255,255,${p.o}) 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
            }} />
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
         5. CHEESE — Melted layer with texture and depth
         ════════════════════════════════════════════════════════ */}

      <AnimatePresence>
        {cheese && (
          <motion.div
            key={`cheese-${cheese}`}
            className="absolute"
            style={{
              width: cheeseSize, height: cheeseSize,
              left: cheeseOff, top: cheeseOff,
              borderRadius: '51% 49% 50% 50% / 49% 51% 50% 50%',
              background: `
                radial-gradient(ellipse at 24% 18%, rgba(255,255,255,0.42) 0%, transparent 30%),
                radial-gradient(circle at 65% 70%, ${cs.shadow}55 0%, transparent 25%),
                radial-gradient(circle at 50% 50%, ${cs.highlight} 0%, ${cs.mid} 26%, ${cs.base} 52%, ${cs.shadow} 100%)
              `,
              boxShadow: `
                inset 0 3px 12px rgba(255,255,255,0.22),
                inset 0 -4px 12px rgba(0,0,0,0.06),
                inset 3px 0 8px rgba(255,255,255,0.08),
                inset -3px 0 8px rgba(0,0,0,0.04),
                0 2px 8px rgba(0,0,0,0.05)
              `,
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 130, damping: 16, delay: 0.06 }}
          />
        )}
      </AnimatePresence>

      {/* Cheese melt details — texture, bubbles, browning */}
      {cheese && (
        <div className="absolute pointer-events-none" style={{
          width: cheeseSize, height: cheeseSize,
          left: cheeseOff, top: cheeseOff,
          borderRadius: '51% 49% 50% 50% / 49% 51% 50% 50%',
        }}>
          {/* Melt pools — glossy golden areas */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2 + 0.5;
            const r = 18 + (i % 3) * 14;
            const cx = cheeseSize / 2;
            const cy = cheeseSize / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            const sz = 6 + (i % 4) * 2.5;
            return (
              <div key={`mp-${i}`} className="absolute" style={{
                left: x - sz / 2, top: y - sz / 2, width: sz, height: sz,
                borderRadius: '50%',
                background: `radial-gradient(circle at 32% 30%, ${cs.highlight}cc, ${cs.mid}55 65%, transparent 100%)`,
                boxShadow: `inset 0 0 3px rgba(255,255,255,0.15)`,
                opacity: 0.3 + (i % 3) * 0.1,
              }} />
            );
          })}

          {/* Browning spots — baked cheese marks */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2 + 0.8;
            const r = 16 + (i % 2) * 18;
            const cx = cheeseSize / 2;
            const cy = cheeseSize / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            return (
              <div key={`bs-${i}`} className="absolute" style={{
                left: x - 5, top: y - 5, width: 10, height: 10, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(160,120,40,0.22) 0%, transparent 65%)',
                filter: 'blur(1.5px)',
              }} />
            );
          })}

          {/* Folded areas — cheese ridges */}
          {[
            { x: 35, y: 30, w: 22, h: 6, r: -8 },
            { x: 60, y: 55, w: 18, h: 5, r: 12 },
            { x: 42, y: 70, w: 20, h: 5, r: -5 },
          ].map((f, i) => (
            <div key={`fd-${i}`} className="absolute" style={{
              left: `${f.x}%`, top: `${f.y}%`,
              width: f.w, height: f.h,
              borderRadius: '50%',
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)`,
              transform: `rotate(${f.r}deg) translate(-50%, -50%)`,
              boxShadow: `0 1px 2px rgba(0,0,0,0.04)`,
            }} />
          ))}

          {/* Edge drip — cheese flowing toward crust */}
          {[
            { x: 20, y: 50, r: 0 }, { x: 80, y: 48, r: 0 },
            { x: 50, y: 18, r: 90 }, { x: 48, y: 82, r: 90 },
          ].map((d, i) => (
            <div key={`ed-${i}`} className="absolute" style={{
              left: `${d.x}%`, top: `${d.y}%`,
              width: 6, height: 10,
              borderRadius: '40% 40% 50% 50%',
              background: `linear-gradient(${d.r || 0}deg, ${cs.base}dd, ${cs.shadow}66)`,
              transform: `translate(-50%, -50%) rotate(${d.r}deg)`,
              opacity: 0.3,
            }} />
          ))}

          {/* Specular highlights — melted glossy surface */}
          {[
            { x: 28, y: 22, w: 18, h: 10, o: 0.25 },
            { x: 55, y: 38, w: 12, h: 7, o: 0.18 },
            { x: 40, y: 62, w: 14, h: 8, o: 0.2 },
          ].map((h, i) => (
            <div key={`sh-${i}`} className="absolute" style={{
              left: `${h.x}%`, top: `${h.y}%`,
              width: h.w, height: h.h,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, rgba(255,255,255,${h.o}) 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
            }} />
          ))}
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
              const tSize = TOPPING_SIZES[vid] || 24;
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
                    dragElastic={0.06}
                    dragMomentum={false}
                    dragTransition={{
                      bounceStiffness: 400,
                      bounceDamping: 28,
                      power: 0.25,
                      timeConstant: 180,
                    }}
                    whileDrag={{
                      scale: 1.2,
                      zIndex: 200,
                      cursor: 'grabbing',
                      filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.45))',
                      transition: { type: 'spring', stiffness: 350, damping: 22 },
                    }}
                    onDragEnd={(e, info) => handleDragEnd(vid, globalIdx, defaultPos, tSize, e, info)}
                    initial={{ scale: 0.5, opacity: 0, y: -10 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotate: defaultPos.r,
                      filter: 'drop-shadow(0 3px 7px rgba(0,0,0,0.3))',
                    }}
                    exit={{ scale: 0.3, opacity: 0, y: 6 }}
                    transition={{
                      type: 'spring',
                      stiffness: 280,
                      damping: 20,
                      delay: globalIdx * 0.035,
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

      {/* ── Warm lighting overlay — food photography feel ── */}
      <div className="absolute pointer-events-none" style={{
        width: cheeseSize, height: cheeseSize,
        left: cheeseOff, top: cheeseOff,
        borderRadius: '51% 49% 50% 50% / 49% 51% 50% 50%',
        background: `
          radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.16) 0%, transparent 40%),
          radial-gradient(ellipse at 72% 82%, rgba(0,0,0,0.06) 0%, transparent 30%)
        `,
        zIndex: 30,
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   INGREDIENT CHIP (for the list below the pizza)
   ══════════════════════════════════════════════════════════════ */

function IngredientChip({ emoji, name, price, qty, delay = 0, iconId }) {
  const { isDark } = useDarkMode();
  const photo = INGREDIENT_PHOTOS[iconId];
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
      {photo ? (
        <img
          src={photo.srcThumb || photo.src}
          alt={photo.alt || name}
          className="w-3.5 h-3.5 rounded-sm object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="text-xs">{emoji}</span>
      )}
      {name}
      {qty > 1 && (
        <span className={cn('font-bold', isDark ? 'text-white/70' : 'text-surface-700')}>x{qty}</span>
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
          minHeight: 360,
          background: isDark
            ? 'radial-gradient(circle at 50% 45%, rgba(230,57,70,0.04) 0%, transparent 55%)'
            : 'radial-gradient(circle at 50% 45%, rgba(230,57,70,0.025) 0%, transparent 55%)',
        }}
      >
        {/* Ambient warm glow */}
        <div className="absolute pointer-events-none" style={{
          width: 280, height: 280,
          left: '50%', top: '50%',
          transform: 'translate(-50%, -52%)',
          background: 'radial-gradient(circle, rgba(230,57,70,0.04) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }} />

        {/* Pizza */}
        <motion.div
          className="relative"
          style={{ transformOrigin: 'center center' }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
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
