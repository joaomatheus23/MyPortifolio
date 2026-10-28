'use client';

import { motion, useInView } from 'framer-motion';
import { Blocks, Landmark, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import MatrixRain from './MatrixRain';

const PillarCanvas = dynamic(() => import('./three/PillarScene'), { ssr: false });

const pillars = [
  { key: 'frontend', icon: Blocks, tone: 'primary' },
  { key: 'backend', icon: Landmark, tone: 'secondary' },
  { key: 'automation', icon: Shield, tone: 'accent' },
] as const;

const toneClass = {
  primary: { on: 'border-primary/60 bg-primary/[0.08]', icon: 'text-primary', chip: 'text-primary', bar: 'bg-primary' },
  secondary: { on: 'border-secondary/60 bg-secondary/[0.08]', icon: 'text-secondary', chip: 'text-secondary', bar: 'bg-secondary' },
  accent: { on: 'border-accent/60 bg-accent/[0.08]', icon: 'text-accent', chip: 'text-accent', bar: 'bg-accent' },
};

function CountUp({ value, active }: { value: number; active: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      setCurrent(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return <>{current}</>;
}

export default function AboutMe() {
  const { t } = useTranslation();
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.6 });
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<'bio' | 'pillars'>('bio');

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((index) => (index + 1) % pillars.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { value: 2, suffix: '', label: t('about.stats.years'), tone: 'text-primary' },
    { value: 10, suffix: '+', label: t('about.stats.projects'), tone: 'text-secondary' },
    { value: 3, suffix: '', label: t('about.stats.technologies'), tone: 'text-accent' },
  ];

  return (
    <section id="about" className="screen-section overflow-hidden">
      <MatrixRain className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.4]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.5),rgba(9,9,11,0.85)_80%)]"></div>

      <div className="container relative z-10 mx-auto px-5 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-5 lg:mb-8"
          >
            <p className="mb-2 font-mono text-[11px] tracking-[0.32em] text-accent">{t('about.kicker')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {t('about.title')} <span className="text-primary">{t('about.titleHighlight')}</span>
            </h2>
          </motion.div>

          <div className="mb-4 flex gap-1 rounded-lg border border-white/10 bg-black/40 p-1 lg:hidden" role="tablist">
            {(['bio', 'pillars'] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`flex-1 rounded-md py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${
                  tab === key ? 'bg-primary text-white' : 'text-gray-400'
                }`}
              >
                {t(`aboutTabs.${key}`)}
              </button>
            ))}
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              data-tour="about-0"
              className={`${tab === 'bio' ? 'block' : 'hidden'} relative overflow-hidden rounded-2xl border glass-apple-strong p-5 sm:p-7 lg:block`}
            >
              <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>
              <h3 className="mb-3 text-lg font-semibold text-white md:text-2xl">{t('about.subtitle')}</h3>
              <div className="space-y-3 text-[13.5px] leading-relaxed text-gray-300 sm:text-[15px]">
                <p>
                  {t('about.description1')}{' '}
                  <span className="font-semibold text-primary">{t('about.experience')}</span>{' '}
                  {t('about.description2')}{' '}
                  <span className="font-semibold text-secondary">{t('about.frontend')}</span> {t('about.and')}{' '}
                  <span className="font-semibold text-accent">{t('about.backend')}</span>
                  {t('about.description3')}
                </p>
                <p>
                  {t('about.description4')}{' '}
                  <span className="text-primary">React</span>, <span className="text-primary">Next.js</span>{' '}
                  {t('about.description5')} <span className="text-secondary">Node</span>{' '}
                  {t('about.description6')}
                </p>
                <p className="hidden sm:block">{t('about.description7')}</p>
              </div>

              <div ref={statsRef} data-tour="about-2" className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 sm:gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-black/30 px-2 py-3 text-center">
                    <div className={`mb-1 text-2xl font-bold sm:text-3xl ${stat.tone}`}>
                      <CountUp value={stat.value} active={statsInView} />
                      {stat.suffix}
                    </div>
                    <div className="font-mono text-[10px] leading-tight text-gray-500 sm:text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div data-tour="about-1" className={`${tab === 'pillars' ? 'flex' : 'hidden'} flex-col gap-3 lg:flex`}>
              <PillarCanvas className="h-36 w-full sm:h-44 lg:h-[min(12rem,19svh)]" active={active} />
              {pillars.map((pillar, index) => {
                const on = index === active;
                const tone = toneClass[pillar.tone];
                const rawTags = t(`about.cards.${pillar.key}.tags`, { returnObjects: true });
                const tags = Array.isArray(rawTags) ? (rawTags as string[]) : [];
                return (
                  <motion.button
                    key={pillar.key}
                    type="button"
                    onClick={() => setActive(index)}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className={`relative w-full overflow-hidden rounded-xl border p-3.5 text-left backdrop-blur transition-all duration-500 sm:p-4 ${
                      on ? tone.on : 'border-white/[0.06] glass-apple-strong opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2.5">
                        <pillar.icon className={`h-5 w-5 ${tone.icon}`} />
                        <span className="font-semibold text-white">{t(`about.cards.${pillar.key}.title`)}</span>
                      </span>
                      <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${on ? tone.chip : 'text-gray-600'}`}>
                        {on ? t('about.focus') : `0${index + 1}`}
                      </span>
                    </div>
                    <p className="text-[13px] leading-snug text-gray-400">{t(`about.cards.${pillar.key}.description`)}</p>
                    {on && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span key={tag} className={`rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] ${tone.chip}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {on && <span className={`absolute bottom-0 left-0 h-0.5 ${tone.bar} animate-[aboutbar_3.4s_linear]`}></span>}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes aboutbar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
