'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, Lock, LockOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { introStore, useIntro } from '@/lib/introStore';
import type { LaptopLabels } from './three/LaptopScene';
import PixelBot from './PixelBot';
import ScrambleText from './ScrambleText';

// Senha fictícia, só para a animação. Nunca coloque uma senha real aqui.
const DECOY_PASSWORD = 'J0ao#Web3!';
const SEGMENTS = 10;
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789#$%&@!?*';

const StaticPortrait = () => (
  <div className="absolute inset-x-0 bottom-0 flex justify-center">
    <Image
      src="/profile.png"
      alt="João Matheus Marques - desenvolvedor Web3"
      width={1024}
      height={1024}
      priority
      className="h-auto w-[min(100%,34rem)] object-contain lg:h-[88vh] lg:w-auto"
    />
  </div>
);

const LaptopCanvas = dynamic(() => import('./three/LaptopScene'), { ssr: false });

// Trava a rolagem enquanto a criptografia não cai. Tentar rolar conta como força bruta,
// a quebra anda sozinha e há o botão de pular. Reduced motion libera na hora.
function useIntroDriver() {
  useEffect(() => {
    // Quem chega por convite do jogo (?sala=) pula direto para o portfólio liberado
    const invited = new URLSearchParams(window.location.search).has('sala');
    if (invited || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      introStore.set({ progress: 1, unlocked: true });
      return;
    }
    if (introStore.get().unlocked) return;

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const start = performance.now();
    let last = start;
    let doneAt = 0;
    let lastNudge = 0;
    let frame = 0;

    const nudge = () => {
      const now = performance.now();
      if (now - start < 2400 || now - lastNudge < 140) return;
      lastNudge = now;
      introStore.hit(0.015);
    };
    const holdTop = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) nudge();
    };

    const release = () => {
      html.style.overflow = previousOverflow;
      window.removeEventListener('scroll', holdTop);
      window.removeEventListener('wheel', nudge);
      window.removeEventListener('touchmove', nudge);
      window.removeEventListener('keydown', onKey);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const current = introStore.get();
      if (current.unlocked) {
        release();
        return;
      }
      if (now - start > 2600 && current.progress < 1) {
        introStore.set({ progress: Math.min(1, current.progress + dt * 0.055) });
      }
      if (introStore.get().progress >= 1) {
        doneAt = doneAt || now;
        if (now - doneAt > 1400) introStore.set({ unlocked: true });
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', holdTop, { passive: true });
    window.addEventListener('wheel', nudge, { passive: true });
    window.addEventListener('touchmove', nudge, { passive: true });
    window.addEventListener('keydown', onKey);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      release();
    };
  }, []);
}

function PasswordCracker() {
  const progress = useIntro((s) => s.progress);
  const unlocked = useIntro((s) => s.unlocked);
  const [, setTick] = useState(0);
  const cracked = unlocked ? DECOY_PASSWORD.length : Math.floor(progress * DECOY_PASSWORD.length + 0.0001);

  useEffect(() => {
    if (unlocked) return;
    const timer = setInterval(() => setTick((value) => value + 1), 70);
    return () => clearInterval(timer);
  }, [unlocked]);

  return (
    <div className="flex gap-0.5 sm:gap-1" aria-hidden="true">
      {DECOY_PASSWORD.split('').map((char, index) => {
        const done = index < cracked;
        return (
          <span
            key={index}
            className={`flex h-6 w-[1.15rem] items-center justify-center rounded border font-mono text-xs font-bold transition-colors duration-300 sm:h-7 sm:w-6 sm:text-sm ${
              done
                ? 'border-accent/70 bg-accent/10 text-accent shadow-[0_0_10px_rgba(255,59,71,0.35)]'
                : index === cracked
                ? 'border-red-400/60 bg-red-500/10 text-red-300'
                : 'border-white/10 bg-white/[0.03] text-gray-500'
            }`}
          >
            {done ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]}
          </span>
        );
      })}
    </div>
  );
}

function CrackHelp() {
  const { t } = useTranslation();
  const progress = useIntro((s) => s.progress);
  const unlocked = useIntro((s) => s.unlocked);
  const filled = Math.round(progress * SEGMENTS);

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16, transition: { duration: 0.35 } }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="absolute left-1/2 top-16 z-20 w-[min(94vw,26rem)] -translate-x-1/2 md:top-20 lg:bottom-28 lg:left-auto lg:right-8 lg:top-auto lg:translate-x-0 xl:right-12"
        >
          <div className="rounded-xl border border-primary/30 glass-apple-strong p-3 shadow-[0_0_40px_rgba(139,92,246,0.18)]">
            <div className="flex items-center gap-3">
              <PixelBot className="h-11 w-11 shrink-0 animate-float" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-gray-200 sm:text-sm">{t('intro.ask')}</p>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: SEGMENTS }, (_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 flex-1 rounded-sm transition-colors duration-300 ${
                        index < filled ? 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => introStore.hit(0.08)}
                className="shrink-0 rounded-md border border-primary/60 bg-primary/15 px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/25 active:scale-95 animate-pulse-glow"
              >
                {t('intro.button')}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
                {progress >= 1 ? <LockOpen className="h-3 w-3 text-accent" /> : <Lock className="h-3 w-3 text-red-400" />}
                {t('intro.password')}
              </span>
              <PasswordCracker />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <span>{t('intro.hint')}</span>
            <button type="button" onClick={() => introStore.finish()} className="text-gray-400 underline-offset-4 hover:text-primary hover:underline">
              {t('intro.skip')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  const unlocked = useIntro((s) => s.unlocked);
  useIntroDriver();

  const labels = useMemo<LaptopLabels>(() => {
    const rawLayers = t('intro.layers', { returnObjects: true });
    return {
      lockTitle: t('intro.lockTitle'),
      user: `${t('hero.name')} ${t('hero.fullName')}`,
      passwordLabel: t('intro.password'),
      decrypting: t('intro.decrypting'),
      layers: Array.isArray(rawLayers) ? (rawLayers as string[]) : [],
      granted: t('intro.granted'),
      role: t('hero.greeting'),
    };
  }, [t]);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const highlight = (word: string) => {
    const normalized = word.toLowerCase().replace(/[.,]/g, '');
    if (normalized.includes('blockchain') || normalized.includes('fintech')) return 'text-primary font-semibold';
    if (['ripple', 'cibersegurança', 'cybersecurity', 'segurança', 'security'].some((key) => normalized.includes(key))) {
      return 'text-secondary font-semibold';
    }
    return 'text-gray-300';
  };

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_55%,rgba(139,92,246,0.12),transparent_55%)]"></div>

      <div data-tour="home-1" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[22%] select-none text-center md:top-[26%]">
        <ScrambleText text="joão matheus." active={unlocked} duration={1100} className="wordmark" />
      </div>

      <LaptopCanvas className="absolute inset-0" fallback={<StaticPortrait />} labels={labels} password={DECOY_PASSWORD} />

      <CrackHelp />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-dark via-dark/70 to-transparent pt-24 lg:bg-none">
        <div className="container mx-auto px-6 pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pointer-events-auto max-w-md"
          >
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">{t('hero.greeting')}</p>
            <h1 data-tour="home-0" className="mb-3 text-3xl font-bold tracking-tight leading-tight text-white md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
              <ScrambleText text={`${t('hero.name')} ${t('hero.fullName')}`} active={unlocked} />
            </h1>
            <p className="mb-6 text-sm leading-relaxed md:text-base">
              {t('hero.tagline')
                .split(' ')
                .map((word, index) => (
                  <span key={index} className={highlight(word)}>
                    {word}{' '}
                  </span>
                ))}
            </p>
            <AnimatePresence>
              {unlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  data-tour="home-2"
                  className="flex flex-wrap gap-3"
                >
                  <button
                    type="button"
                    onClick={scrollToAbout}
                    className="rounded-lg bg-gradient-to-r from-primary via-secondary to-accent px-6 py-3 text-sm font-semibold text-dark transition-all duration-300 hover:scale-105 animate-gradient"
                  >
                    {t('hero.aboutBtn')}
                  </button>
                  <a
                    href="#projects"
                    className="glass rounded-lg border border-primary/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-primary/60 hover:glow-cyan"
                  >
                    {t('hero.projectsBtn')}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {unlocked && (
          <motion.button
            type="button"
            onClick={scrollToAbout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-gray-400 transition hover:text-primary lg:flex xl:right-12"
          >
            {t('hero.scrollDown')}
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      <p className="sr-only" aria-live="polite">
        {unlocked ? t('intro.unlockedLine') : ''}
      </p>
    </section>
  );
}
