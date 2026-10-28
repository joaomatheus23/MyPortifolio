'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Globe, Languages, Plane, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const GlobeCanvas = dynamic(() => import('./three/GlobeScene'), { ssr: false });

// Cada capítulo junta um card (inglês, desenvolvimento, visão global) com o parágrafo que conta essa parte
const chapters = [
  { key: 'english', paragraph: 'p1', icon: Languages, text: 'text-primary', bar: 'bg-primary', border: 'border-primary/50' },
  { key: 'growth', paragraph: 'p2', icon: Sparkles, text: 'text-secondary', bar: 'bg-secondary', border: 'border-secondary/50' },
  { key: 'global', paragraph: 'p3', icon: Globe, text: 'text-accent', bar: 'bg-accent', border: 'border-accent/50' },
] as const;

const CHAPTER_MS = 5200;

export default function CanadaSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const timer = setInterval(() => setActive((index) => (index + 1) % chapters.length), CHAPTER_MS);
    return () => clearInterval(timer);
  }, [inView, paused, active]);

  const current = chapters[active];

  return (
    <section id="canada" ref={sectionRef} className="screen-section overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,rgba(139,92,246,0.14),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(255,59,71,0.08),transparent_45%)]"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-4 md:grid-cols-[1fr_1.1fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 h-52 sm:h-72 md:order-1 md:row-span-2 md:h-[min(32rem,64svh)]"
          >
            <GlobeCanvas
              className="h-full w-full"
              from={{ name: t('canada.route.from'), lat: -22.29, lon: -48.56 }}
              to={{ name: t('canada.route.to'), lat: 43.65, lon: -79.38 }}
            />

            <motion.figure
              data-tour="canada-0"
              initial={{ opacity: 0, y: 30, rotate: -14 }}
              whileInView={{ opacity: 1, y: 0, rotate: -6 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.3 }}
              className="absolute bottom-0 left-0 w-24 rounded-md bg-[#f4f4f5] p-1.5 pb-5 shadow-[0_20px_40px_rgba(0,0,0,0.55)] sm:w-36 sm:p-2 sm:pb-7 md:w-44"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                <Image
                  src="/img/canada.jpg"
                  alt="João Matheus em Toronto, durante a imersão no Canadá"
                  fill
                  className="object-cover object-[50%_30%]"
                  sizes="(min-width: 768px) 176px, 96px"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-1 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-600 sm:bottom-2 sm:text-[10px]">
                {t('canada.place')}
              </figcaption>
            </motion.figure>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute right-0 top-0 hidden w-56 overflow-hidden rounded-xl border border-white/10 glass-apple-strong sm:block"
            >
              <div className="flex items-center justify-between border-b border-dashed border-white/15 px-3 py-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">{t('canada.passLabel')}</span>
                <Plane className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="space-y-2 px-3 py-2.5">
                <p className="flex items-center justify-between font-mono text-[11px] font-bold text-white">
                  <span>{t('canada.route.from')}</span>
                  <span className="mx-2 h-px flex-1 bg-gradient-to-r from-secondary to-accent"></span>
                  <span className="text-accent">{t('canada.route.to')}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono text-[9px] uppercase tracking-[0.12em]">
                  <div>
                    <p className="text-gray-600">{t('canada.passenger')}</p>
                    <p className="truncate text-gray-200">João Matheus</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('canada.purpose')}</p>
                    <p className="truncate text-gray-200">{t('education.academic.canada.institution')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 md:order-2"
          >
            <p className="mb-2 font-mono text-[11px] tracking-[0.3em] text-accent">{t('canada.kicker')}</p>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-white md:mb-3 md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {t('canada.title')} <span className="text-primary">{t('canada.titleHighlight')}</span>
            </h2>
            <p className="text-sm leading-relaxed text-white md:mb-6 md:text-lg">{t('canada.lead')}</p>
          </motion.div>

          <div
            data-tour="canada-1"
            className="order-3 md:col-start-2 md:-mt-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="mb-3 grid grid-cols-3 gap-2" role="tablist">
              {chapters.map((chapter, index) => {
                const on = index === active;
                return (
                  <button
                    key={chapter.key}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(index)}
                    className={`relative overflow-hidden rounded-xl border p-2.5 text-left transition-all duration-300 sm:p-3 ${
                      on ? `${chapter.border} bg-white/[0.04]` : 'border-white/[0.08] glass-apple-strong opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="mb-1 flex items-center justify-between">
                      <chapter.icon className={`h-4 w-4 ${chapter.text}`} />
                      <span className="font-mono text-[9px] text-gray-600">{t('canada.chapter')} 0{index + 1}</span>
                    </span>
                    <span className="block text-[11px] font-semibold leading-tight text-white sm:text-sm">{t(`canada.cards.${chapter.key}.title`)}</span>
                    {on && (
                      <motion.span
                        key={`bar-${active}`}
                        className={`absolute bottom-0 left-0 h-0.5 ${chapter.bar}`}
                        initial={{ width: '0%' }}
                        animate={{ width: paused || !inView ? '0%' : '100%' }}
                        transition={{ duration: CHAPTER_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[9.5rem] overflow-hidden rounded-xl border glass-apple-strong p-4 sm:min-h-[10.5rem] sm:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35 }}
                >
                  <p className={`mb-2 font-mono text-[10px] uppercase tracking-[0.22em] ${current.text}`}>
                    {t(`canada.cards.${current.key}.description`)}
                  </p>
                  <p className="text-[13px] leading-relaxed text-gray-300 sm:text-[15px]">{t(`canada.${current.paragraph}`)}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
