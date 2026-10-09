'use client';

import { motion, useInView } from 'framer-motion';
import { Blocks, Landmark, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const pillars = [
  { key: 'frontend', icon: Blocks, tone: 'primary' },
  { key: 'backend', icon: Landmark, tone: 'secondary' },
  { key: 'automation', icon: Shield, tone: 'accent' },
] as const;

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((index) => (index + 1) % pillars.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  const toneClass = {
    primary: {
      border: 'border-primary/50 shadow-[0_0_36px_rgba(0,212,255,0.18)]',
      idle: 'border-primary/15',
      icon: 'bg-primary/15 text-primary',
      chip: 'bg-primary/10 text-primary',
      bar: 'bg-primary',
      number: 'text-primary',
    },
    secondary: {
      border: 'border-secondary/50 shadow-[0_0_36px_rgba(139,92,246,0.2)]',
      idle: 'border-secondary/15',
      icon: 'bg-secondary/15 text-secondary',
      chip: 'bg-secondary/10 text-secondary',
      bar: 'bg-secondary',
      number: 'text-secondary',
    },
    accent: {
      border: 'border-accent/50 shadow-[0_0_36px_rgba(0,255,136,0.16)]',
      idle: 'border-accent/15',
      icon: 'bg-accent/15 text-accent',
      chip: 'bg-accent/10 text-accent',
      bar: 'bg-accent',
      number: 'text-accent',
    },
  };

  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-darker via-dark to-darker py-24">
      <div className="absolute inset-0">
        <motion.div
          className="absolute right-[18%] top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ y: [0, 24, 0], x: [0, -16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 left-[12%] h-64 w-64 rounded-full bg-secondary/10 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 18, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <p className="mb-4 font-mono text-sm tracking-[0.32em] text-primary">{t('about.kicker')}</p>
            <h2 className="mb-6 text-4xl font-black text-white md:text-5xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {t('about.title')} <span className="text-primary text-glow-cyan">{t('about.titleHighlight')}</span>
            </h2>
            <div className="mx-auto h-1 w-20 bg-gradient-to-r from-primary to-secondary"></div>
          </motion.div>

          <div className="grid items-stretch gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="glass relative overflow-hidden rounded-3xl border border-primary/20 p-8 md:p-10"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent"></div>
              <h3 className="mb-6 text-2xl font-bold text-white md:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
                {t('about.subtitle')}
              </h3>

              <div className="space-y-5 text-lg leading-relaxed text-gray-300">
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
                <p>{t('about.description7')}</p>
              </div>

              <div ref={statsRef} className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-8">
                {[
                  { value: 2, suffix: '', label: t('about.stats.years'), tone: 'primary' as const },
                  { value: 10, suffix: '+', label: t('about.stats.projects'), tone: 'secondary' as const },
                  { value: 3, suffix: '', label: t('about.stats.technologies'), tone: 'accent' as const },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/30 px-2 py-4 text-center">
                    <div className={`mb-2 text-3xl font-bold ${toneClass[stat.tone].number}`}>
                      <CountUp value={stat.value} active={statsInView} />
                      {stat.suffix}
                    </div>
                    <div className="font-mono text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-col gap-4">
              {pillars.map((pillar, index) => {
                const on = index === active;
                const tone = toneClass[pillar.tone];
                const rawTags = t(`about.cards.${pillar.key}.tags`, { returnObjects: true });
                const tags = Array.isArray(rawTags) ? rawTags : [];
                return (
                  <motion.button
                    key={pillar.key}
                    type="button"
                    onClick={() => setActive(index)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className={`glass relative w-full overflow-hidden rounded-2xl border p-6 text-left transition-all duration-500 ${
                      on ? `${tone.border} scale-[1.02]` : `${tone.idle} opacity-80`
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center">
                        <div className={`mr-4 rounded-xl p-3 ${tone.icon}`}>
                          <pillar.icon className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-bold text-white">{t(`about.cards.${pillar.key}.title`)}</h4>
                      </div>
                      <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${on ? tone.number : 'text-gray-600'}`}>
                        {on ? t('about.focus') : `0${index + 1}`}
                      </span>
                    </div>
                    <p className="mb-4 text-gray-300">{t(`about.cards.${pillar.key}.description`)}</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className={`rounded-full px-3 py-1 font-mono text-sm ${tone.chip}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {on && (
                      <span className={`absolute bottom-0 left-0 h-0.5 ${tone.bar} animate-[aboutbar_3.4s_linear]`}></span>
                    )}
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
