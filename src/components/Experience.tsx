'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Blocks, Briefcase, Landmark, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScrambleText from './ScrambleText';
import type { TokenPhase } from './three/TokenScene';

const TokenCanvas = dynamic(() => import('./three/TokenScene'), { ssr: false });

const tags = ['Ripple', 'XRP Ledger', 'Web3', 'Fintech', 'Tokenização', 'Cibersegurança'];

const points = [
  { icon: Blocks, key: 'one', text: 'text-primary', border: 'border-primary', bg: 'bg-primary' },
  { icon: Shield, key: 'two', text: 'text-secondary', border: 'border-secondary', bg: 'bg-secondary' },
  { icon: Landmark, key: 'three', text: 'text-accent', border: 'border-accent', bg: 'bg-accent' },
] as const;

const STEP_MS = 3600;

// Centro de cada nó na linha (os nós ficam a 1,25rem das bordas)
const nodeLeft = (index: number) => {
  const fraction = index / (points.length - 1);
  return `calc(${fraction * 100}% + ${1.25 - fraction * 2.5}rem)`;
};

export default function Experience() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<TokenPhase>('asset');

  // O "pacote" percorre os três focos do trabalho, um por vez
  useEffect(() => {
    if (!inView || paused) return;
    const timer = setInterval(() => setActive((index) => (index + 1) % points.length), STEP_MS);
    return () => clearInterval(timer);
  }, [inView, paused]);

  const current = points[active];

  return (
    <section id="experience" ref={sectionRef} className="screen-section overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(139,92,246,0.14),transparent_50%)]"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex flex-col gap-2 md:mb-6 md:flex-row md:items-end md:justify-between"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {t('experience.title')} <span className="text-primary">{t('experience.titleHighlight')}</span>
            </h2>
            <p className="hidden max-w-md text-sm text-gray-400 sm:block md:text-right">{t('experience.subtitle')}</p>
          </motion.div>

          <div className="grid items-stretch gap-3 md:grid-cols-[1.15fr_1fr] md:gap-5">
            <motion.div
              data-tour="experience-0"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-2xl border glass-apple-strong p-5 sm:p-6"
            >
              <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl"></div>
              <div className="relative mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10">
                  <Briefcase className="h-4 w-4 text-primary" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-400">{t('experience.context')}</span>
                <span className="ml-auto flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
                  {t('experience.current')}
                </span>
              </div>
              <h3 className="relative text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl" style={{ fontFamily: 'var(--font-display)' }}>
                <ScrambleText text={t('experience.company')} active={inView} duration={800} />
              </h3>
              <p className="relative mb-3 mt-1 font-mono text-sm text-primary">{'> '}{t('experience.role')}</p>
              <p className="relative line-clamp-4 text-[13px] leading-relaxed text-gray-300 sm:line-clamp-none sm:text-[15px]">{t('experience.summary')}</p>
              <div className="no-scrollbar relative -mx-5 mt-3 flex gap-1.5 overflow-x-auto px-5 sm:mx-0 sm:mt-4 sm:flex-wrap sm:px-0">
                {tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.06 }}
                    className="shrink-0 rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-gray-300 transition hover:border-primary/60 hover:text-primary"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              data-tour="experience-1"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[7.5rem] overflow-hidden rounded-2xl border glass-apple-strong sm:min-h-[14rem]"
            >
              <TokenCanvas className="absolute inset-0" onPhase={setPhase} />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 font-mono text-[10px] uppercase tracking-[0.22em]">
                <span className="text-gray-500">{t('experienceScene.caption')}</span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
                {(['asset', 'split', 'tokens'] as const).map((key) => (
                  <span
                    key={key}
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                      phase === key ? 'border-accent/60 bg-accent/15 text-accent' : 'border-white/10 text-gray-600'
                    }`}
                  >
                    {t(`experienceScene.${key === 'asset' ? 'asset' : key === 'split' ? 'split' : 'tokens'}`)}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <div
            data-tour="experience-2"
            className="mt-3 rounded-2xl border glass-apple-strong p-4 md:mt-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative mb-3 flex items-center justify-between md:mb-4">
              <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-white/10"></div>
              <motion.div
                className="absolute left-5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-primary via-secondary to-accent"
                animate={{ width: `calc(${(active / (points.length - 1)) * 100}% - ${(active / (points.length - 1)) * 2.5}rem)` }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              {inView && (
                <motion.span
                  key={`packet-${active}`}
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_rgba(255,59,71,0.9)]"
                  initial={{ left: nodeLeft(active), opacity: 0 }}
                  animate={{ left: nodeLeft((active + 1) % points.length), opacity: [0, 1, 1, 0] }}
                  transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                  style={{ x: '-50%' }}
                />
              )}
              {points.map((point, index) => {
                const on = index === active;
                const done = index < active;
                return (
                  <button
                    key={point.key}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={t(`experience.pointTitles.${point.key}`)}
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border bg-[#0c0c0f] transition-all duration-300 ${
                      on ? `${point.border} scale-110 shadow-[0_0_20px_rgba(139,92,246,0.45)]` : done ? 'border-primary/40' : 'border-white/15'
                    }`}
                  >
                    <point.icon className={`h-4 w-4 ${on || done ? point.text : 'text-gray-500'}`} />
                    {on && <span className={`absolute -inset-1 animate-ping rounded-xl border ${point.border} opacity-30`}></span>}
                  </button>
                );
              })}
            </div>

            <div className="hidden gap-4 md:grid md:grid-cols-3">
              {points.map((point, index) => {
                const on = index === active;
                return (
                  <button
                    key={point.key}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`rounded-xl border p-3 text-left transition-all duration-300 ${on ? 'border-white/15 bg-white/[0.04]' : 'border-transparent opacity-55 hover:opacity-90'}`}
                  >
                    <p className={`mb-1 flex items-center gap-2 text-sm font-semibold ${on ? 'text-white' : 'text-gray-300'}`}>
                      <span className={`font-mono text-[10px] ${point.text}`}>0{index + 1}</span>
                      {t(`experience.pointTitles.${point.key}`)}
                    </p>
                    <p className="text-[13px] leading-relaxed text-gray-400">{t(`experience.points.${point.key}`)}</p>
                    <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/5">
                      {on && (
                        <motion.div
                          key={`bar-${active}`}
                          className={`h-full ${point.bg}`}
                          initial={{ width: '0%' }}
                          animate={{ width: paused ? undefined : '100%' }}
                          transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="md:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
                    <span className={`font-mono text-[10px] ${current.text}`}>0{active + 1}</span>
                    {t(`experience.pointTitles.${current.key}`)}
                  </p>
                  <p className="min-h-[3.6rem] text-[13px] leading-relaxed text-gray-400">{t(`experience.points.${current.key}`)}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
