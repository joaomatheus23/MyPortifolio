'use client';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown, ChevronLeft, Minus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIntro } from '@/lib/introStore';
import { SECTION_IDS, useActiveSection, type SectionId } from '@/lib/useActiveSection';
import PixelBot from './PixelBot';

const TOP_SAFE = 68;
const EDGE = 12;

type Placement = { side: 'left' | 'right'; vertical: 'up' | 'down' };
type Box = { x: number; y: number; w: number; h: number };

const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

// Tudo que o Bit deve evitar cobrir na seção atual: texto e botões pesam mais que fundos e cards
function obstaclesIn(section: SectionId, vh: number) {
  const root = document.getElementById(section);
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>('h2, h3, p, a, button, input, textarea, canvas, figure, img, [data-tour]'))
    .filter((node) => node.offsetWidth > 0 && node.getClientRects().length > 0)
    .map((node) => {
      const rect = node.getBoundingClientRect();
      const tag = node.tagName;
      const weight = node.hasAttribute('data-tour') ? 1 : tag === 'CANVAS' || tag === 'FIGURE' || tag === 'IMG' ? 1.5 : 3;
      return { box: { x: rect.left, y: rect.top, w: rect.width, h: rect.height }, weight };
    })
    .filter(({ box }) => box.w > 4 && box.h > 4 && box.y + box.h > 0 && box.y < vh);
}

// Primeiro elemento visível marcado com data-tour para aquele passo (há versões de celular e desktop)
function findTarget(section: SectionId, step: number) {
  for (const key of [`${section}-${step}`, `${section}-0`]) {
    const element = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${key}"]`)).find(
      (node) => node.getClientRects().length > 0 && node.offsetWidth > 0,
    );
    if (element) return element;
  }
  return document.querySelector<HTMLElement>(`#${section} h2`) ?? document.getElementById(section);
}

// O Bit caminha pela tela até o que está explicando e, em cada seção, faz um tour passo a passo
export default function GuideBot() {
  const { t } = useTranslation();
  const unlocked = useIntro((s) => s.unlocked);
  const section = useActiveSection();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);
  const [blinking, setBlinking] = useState(false);
  const [typed, setTyped] = useState('');
  const [narrow, setNarrow] = useState(false);
  const [walking, setWalking] = useState(false);
  const [placement, setPlacement] = useState<Placement>({ side: 'left', vertical: 'up' });
  const walkingRef = useRef(false);
  const placementRef = useRef(placement);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  const startX = typeof window === 'undefined' ? 0 : window.innerWidth - 90;
  const startY = typeof window === 'undefined' ? 0 : window.innerHeight - 90;
  const targetX = useMotionValue(startX);
  const targetY = useMotionValue(startY);
  const x = useSpring(targetX, { stiffness: 38, damping: 13, mass: 1 });
  const y = useSpring(targetY, { stiffness: 38, damping: 13, mass: 1 });

  const rawSteps = t(`guide.tour.${section}`, { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? (rawSteps as string[]) : [];
  const message = steps[Math.min(step, steps.length - 1)] ?? '';
  const isLast = step >= steps.length - 1;
  const sectionIndex = SECTION_IDS.indexOf(section);
  const nextSection = SECTION_IDS[sectionIndex + 1];
  const size = narrow ? 48 : 64;

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Cada seção nova reabre o tour no primeiro passo
  useEffect(() => {
    setStep(0);
    setOpen(true);
  }, [section]);

  // No celular e no jogo o balão se recolhe sozinho para não cobrir o conteúdo
  useEffect(() => {
    if (!open || (!narrow && section !== 'game')) return;
    const timer = setTimeout(() => setOpen(false), section === 'game' ? 5000 : 8000);
    return () => clearTimeout(timer);
  }, [open, narrow, section, step]);

  // Escolhe onde o Bit para: testa lugares ao redor do alvo e nas margens da tela e fica
  // onde ele e o balão cobrem menos conteúdo. A mola leva ele até lá e acompanha a rolagem.
  useEffect(() => {
    if (!unlocked) return;
    let frame = 0;
    let lastPick = 0;
    let chosen = -1;
    const loop = (now: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (now - lastPick > 120) {
        lastPick = now;
        const minX = vw >= 1280 ? 56 : EDGE;
        const maxX = vw - size - EDGE;
        const maxY = vh - size - EDGE;
        const clampX = (value: number) => Math.min(Math.max(value, minX), maxX);
        const clampY = (value: number) => Math.min(Math.max(value, TOP_SAFE), maxY);
        const target = findTarget(section, step);
        const r = target?.getBoundingClientRect() ?? new DOMRect(vw - 200, vh - 200, 100, 100);
        const gap = 14;
        const candidates = narrow
          ? [
              { x: minX, y: vh - size - 10 },
              { x: maxX, y: vh - size - 10 },
              { x: r.left + r.width * 0.75 - size / 2, y: vh - size - 10 },
            ]
          : [
              { x: r.right + gap, y: r.top },
              { x: r.right + gap, y: r.bottom - size },
              { x: r.left - size - gap, y: r.top },
              { x: r.left - size - gap, y: r.bottom - size },
              { x: r.right - size, y: r.top - size - 10 },
              { x: r.left, y: r.top - size - 10 },
              { x: r.right - size, y: r.bottom + 10 },
              { x: r.left, y: r.bottom + 10 },
              { x: maxX, y: r.top },
              { x: minX, y: r.top },
              { x: maxX, y: maxY },
              { x: minX, y: maxY },
            ];
        const obstacles = obstaclesIn(section, vh);
        const bubbleW = bubbleRef.current?.offsetWidth ?? (narrow ? 264 : 304);
        const bubbleH = bubbleRef.current?.offsetHeight ?? 150;
        const centerX = r.left + r.width / 2;
        const centerY = r.top + r.height / 2;
        const scored = candidates.map((raw) => {
          const cx = clampX(raw.x);
          const cy = clampY(raw.y);
          const side: Placement['side'] = cx + size / 2 > vw / 2 ? 'left' : 'right';
          const vertical: Placement['vertical'] = narrow || cy + size / 2 > vh * 0.55 ? 'up' : 'down';
          const bot: Box = { x: cx, y: cy, w: size, h: size };
          const bubble: Box = narrow
            ? { x: side === 'left' ? cx + size - bubbleW : cx, y: cy - bubbleH - 12, w: bubbleW, h: bubbleH }
            : {
                x: side === 'left' ? cx - 12 - bubbleW : cx + size + 12,
                y: vertical === 'up' ? cy + size - bubbleH : cy,
                w: bubbleW,
                h: bubbleH,
              };
          let score = Math.hypot(cx + size / 2 - centerX, cy + size / 2 - centerY) * 1.5;
          obstacles.forEach(({ box, weight }) => {
            score += overlap(bot, box) * weight * 2;
            if (openRef.current) score += overlap(bubble, box) * weight * 0.5;
          });
          return { x: cx, y: cy, side, vertical, score };
        });
        let best = scored.reduce((bestIndex, item, index) => (item.score < scored[bestIndex].score ? index : bestIndex), 0);
        // Histerese: não troca de lugar por diferenças pequenas, evita o Bit ficar indo e vindo
        if (chosen >= 0 && chosen < scored.length && scored[chosen].score <= scored[best].score * 1.15 + 500) best = chosen;
        chosen = best;
        const pick = scored[best];
        targetX.set(pick.x);
        targetY.set(pick.y);
        if (pick.side !== placementRef.current.side || pick.vertical !== placementRef.current.vertical) {
          placementRef.current = { side: pick.side, vertical: pick.vertical };
          setPlacement(placementRef.current);
        }
      }

      const moving = Math.abs(x.getVelocity()) + Math.abs(y.getVelocity()) > 35;
      if (moving !== walkingRef.current) {
        walkingRef.current = moving;
        setWalking(moving);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [unlocked, section, step, narrow, size, targetX, targetY, x, y]);

  useEffect(() => {
    let index = 0;
    setTyped('');
    const timer = setInterval(() => {
      index += 1;
      setTyped(message.slice(0, index));
      if (index >= message.length) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [message]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const loop = () => {
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 140);
        loop();
      }, 2200 + Math.random() * 2600);
    };
    loop();
    return () => clearTimeout(timeout);
  }, []);

  const advance = () => {
    if (!isLast) {
      setStep((value) => value + 1);
      return;
    }
    if (nextSection) document.getElementById(nextSection)?.scrollIntoView({ behavior: 'smooth' });
  };

  const bubblePosition = narrow
    ? `bottom-full mb-3 ${placement.side === 'left' ? 'right-0' : 'left-0'}`
    : `${placement.side === 'left' ? 'right-full mr-3' : 'left-full ml-3'} ${placement.vertical === 'up' ? 'bottom-0' : 'top-0'}`;

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ x, y, width: size, height: size }}
          className="pointer-events-none fixed left-0 top-0 z-40"
        >
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                key={section}
                ref={bubbleRef}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22 }}
                className={`pointer-events-auto absolute w-[min(16.5rem,calc(100vw-1.5rem))] rounded-xl border border-primary/30 glass-apple-strong p-3 shadow-[0_0_40px_rgba(139,92,246,0.25)] sm:w-[19rem] ${bubblePosition}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    {t(`nav.${section === 'projects' ? 'portfolio' : section}`)} · {t('guide.step', { current: Math.min(step + 1, steps.length), total: steps.length })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t('guide.minimize')}
                    className="rounded p-1 text-gray-500 transition hover:text-white"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="min-h-[3.2rem] font-mono text-xs leading-relaxed text-gray-100" aria-live="polite">
                  {typed}
                  <span className="ml-0.5 inline-block h-3 w-1 translate-y-0.5 bg-primary/80 animate-pulse"></span>
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex gap-1" aria-hidden="true">
                    {steps.map((_, index) => (
                      <span key={index} className={`h-1 rounded-full transition-all ${index === step ? 'w-5 bg-primary' : 'w-2 bg-white/15'}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => setStep((value) => value - 1)}
                        aria-label={t('guide.back')}
                        className="rounded-md p-1.5 text-gray-400 transition hover:bg-white/5 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    )}
                    {(!isLast || nextSection) && (
                      <button
                        type="button"
                        onClick={advance}
                        className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-primary/85"
                      >
                        {isLast ? t('guide.nextSection') : t('guide.next')}
                        {isLast && <ArrowDown className="h-3 w-3" />}
                      </button>
                    )}
                    {isLast && !nextSection && (
                      <button
                        type="button"
                        onClick={() => document.body.scrollIntoView({ behavior: 'smooth' })}
                        className="rounded-md border border-white/15 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-300 transition hover:border-primary/60"
                      >
                        {t('guide.restart')}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={t('guide.open')}
            aria-expanded={open}
            className="pointer-events-auto group relative block h-full w-full"
          >
            <span
              className={`absolute inset-x-2 -bottom-1 h-2 rounded-full blur-md transition ${
                walking ? 'bg-accent/40' : 'bg-primary/30 group-hover:bg-primary/60'
              }`}
            ></span>
            {!open && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-accent"></span>}
            <span className={`block h-full w-full ${walking ? 'animate-[botwalk_0.32s_ease-in-out_infinite]' : 'animate-float'}`}>
              <PixelBot blinking={blinking} className="relative h-full w-full drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
