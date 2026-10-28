'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, ExternalLink, GraduationCap, ScanLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fakeHash } from '@/lib/fakeHash';

type Course = {
  title: string;
  platform: string;
  hours: string;
  description: string;
  certificateUrl?: string;
};

const ACADEMIC = ['english', 'highSchool', 'canada', 'graduation'] as const;

export default function Education() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [verified, setVerified] = useState(false);
  const [narrow, setNarrow] = useState(false);

  const courses: Course[] = [
    {
      title: t('education.courses.items.solidity.title'),
      platform: t('education.courses.items.solidity.platform'),
      hours: t('education.courses.items.solidity.hours'),
      description: t('education.courses.items.solidity.description'),
      certificateUrl: 'https://cursos.alura.com.br/certificate/4652e050-fc74-4f42-8266-abedb91cb5e2',
    },
    {
      title: t('education.courses.items.cybersecurity.title'),
      platform: t('education.courses.items.cybersecurity.platform'),
      hours: t('education.courses.items.cybersecurity.hours'),
      description: t('education.courses.items.cybersecurity.description'),
      certificateUrl: 'https://cursos.alura.com.br/certificate/a64ffd34-dbd5-477d-882f-974f6a2d0c80',
    },
    {
      title: t('education.courses.items.reactIntensive.title'),
      platform: t('education.courses.items.reactIntensive.platform'),
      hours: t('education.courses.items.reactIntensive.hours'),
      description: t('education.courses.items.reactIntensive.description'),
      certificateUrl: 'https://udemy-certificate.s3.amazonaws.com/pdf/UC-ea74a10c-79b4-426a-8040-0d7e1c1eeaf5.pdf',
    },
    {
      title: t('education.courses.items.reactSpecialized.title'),
      platform: t('education.courses.items.reactSpecialized.platform'),
      hours: t('education.courses.items.reactSpecialized.hours'),
      description: t('education.courses.items.reactSpecialized.description'),
      certificateUrl: 'https://cursos.dankicode.com/api/certificados/8812378a-abf4-4ff4-a2aa-5536fc40b4b5',
    },
    {
      title: t('education.courses.items.webDevelopment.title'),
      platform: t('education.courses.items.webDevelopment.platform'),
      hours: t('education.courses.items.webDevelopment.hours'),
      description: t('education.courses.items.webDevelopment.description'),
    },
    {
      title: t('education.courses.items.webDevelopmentDanki.title'),
      platform: t('education.courses.items.webDevelopmentDanki.platform'),
      hours: t('education.courses.items.webDevelopmentDanki.hours'),
      description: t('education.courses.items.webDevelopmentDanki.description'),
    },
  ];
  const total = courses.length;

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setActive((index) => (index + 1) % total), 4800);
    return () => clearInterval(timer);
  }, [paused, total]);

  // Cada certificado que vem para a frente passa pela "verificação de assinatura"
  useEffect(() => {
    setVerified(false);
    const timer = setTimeout(() => setVerified(true), 900);
    return () => clearTimeout(timer);
  }, [active]);

  const go = (delta: number) => setActive((index) => (index + delta + total) % total);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) go(1);
    else if (info.offset.x > 50) go(-1);
  };

  return (
    <section id="education" className="screen-section overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-6"
          >
            <p className="mb-1 font-mono text-[11px] tracking-[0.32em] text-accent">{t('education.kicker')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {t('education.title')} <span className="text-primary">{t('education.titleHighlight')}</span>
            </h2>
          </motion.div>

          <div data-tour="education-0" className="no-scrollbar mb-5 flex gap-2 overflow-x-auto md:mb-8 md:grid md:grid-cols-4 md:gap-3">
            {ACADEMIC.map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`relative min-w-[11.5rem] shrink-0 rounded-xl border p-3 md:min-w-0 ${
                  key === 'graduation' ? 'border-primary/40 bg-primary/[0.06]' : 'border-white/[0.08] glass-apple-strong'
                }`}
              >
                <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  {t(`education.academic.${key}.period`)}
                  {key === 'graduation' && <span className="ml-auto text-accent">{t('education.now')}</span>}
                </p>
                <p className="text-sm font-semibold leading-tight text-white">{t(`education.academic.${key}.title`)}</p>
                <p className="mt-0.5 truncate text-xs text-gray-500">{t(`education.academic.${key}.institution`)}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">{t('certs.courses')}</p>
            <p className="font-mono text-xs text-white">
              <span className="text-accent">{String(active + 1).padStart(2, '0')}</span>
              <span className="text-gray-600"> / {String(total).padStart(2, '0')}</span>
            </p>
          </div>

          <motion.div
            data-tour="education-1"
            className="relative h-[clamp(17rem,40svh,21rem)] cursor-grab touch-pan-y active:cursor-grabbing"
            style={{ perspective: 1400 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
          >
            {courses.map((course, index) => {
              let offset = index - active;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;
              const distance = Math.abs(offset);
              const on = offset === 0;
              const spread = narrow ? 82 : 58;
              return (
                <motion.article
                  key={course.title + index}
                  initial={false}
                  animate={{
                    x: `${offset * spread}%`,
                    rotateY: offset * (narrow ? -18 : -32),
                    z: -distance * 140,
                    scale: on ? 1 : 0.86,
                    opacity: distance > 2 ? 0 : on ? 1 : 0.45,
                  }}
                  transition={{ type: 'spring', stiffness: 170, damping: 24 }}
                  style={{ zIndex: 10 - distance, marginLeft: 'calc(min(84vw, 26rem) / -2)' }}
                  onClick={() => !on && setActive(index)}
                  className={`absolute left-1/2 top-0 flex h-full w-[min(84vw,26rem)] flex-col overflow-hidden rounded-2xl border p-5 ${
                    on ? 'border-primary/50 bg-[#100e16] shadow-[0_20px_60px_rgba(139,92,246,0.25)]' : 'border-white/10 bg-[#0d0d10]'
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(139,92,246,0.2),transparent_45%)]"></div>
                  <div className="relative mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">{t('education.hud')}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-primary">{course.hours}</span>
                  </div>
                  <p className="relative mb-1 font-mono text-xs uppercase tracking-[0.2em] text-accent">{course.platform}</p>
                  <h3 className="relative mb-2 text-xl font-bold leading-tight text-white sm:text-2xl">{course.title}</h3>
                  <p className="relative line-clamp-3 text-[13px] leading-relaxed text-gray-400 sm:line-clamp-4">{course.description}</p>

                  <div className="relative mt-auto flex items-end justify-between gap-3 pt-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[9px] text-gray-600">sig 0x{fakeHash(course.title + course.platform, 24)}</p>
                      {on && course.certificateUrl && verified && (
                        <motion.a
                          href={course.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={(event) => event.stopPropagation()}
                          className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/85"
                        >
                          <Award className="h-3.5 w-3.5" />
                          {t('education.courses.viewCertificate')}
                          <ExternalLink className="h-3 w-3" />
                        </motion.a>
                      )}
                      {on && !course.certificateUrl && verified && (
                        <p className="mt-1.5 font-mono text-[10px] text-gray-500">{t('certs.noLink')}</p>
                      )}
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </span>
                  </div>

                  <AnimatePresence>
                    {on && !verified && (
                      <motion.div
                        key="scan"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute inset-0 z-10"
                      >
                        <motion.span
                          initial={{ top: '-10%' }}
                          animate={{ top: '105%' }}
                          transition={{ duration: 0.85, ease: 'linear' }}
                          className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-primary/40 to-transparent"
                        />
                        <span className="absolute bottom-3 left-5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                          <ScanLine className="h-3.5 w-3.5" />
                          {t('certs.verifying')}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {on && verified && (
                      <motion.span
                        key="stamp"
                        initial={{ opacity: 0, scale: 2.2, rotate: -24 }}
                        animate={{ opacity: 0.9, scale: 1, rotate: -12 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 16 }}
                        className="pointer-events-none absolute bottom-16 right-4 z-10 rounded-md border-2 border-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent"
                      >
                        {t('certs.verified')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </motion.div>

          <div data-tour="education-2" className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="previous"
              className="rounded-full border border-white/10 p-2 text-gray-300 transition hover:border-primary/60 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {courses.map((course, index) => (
                <button
                  key={course.title + index}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={course.title}
                  className={`h-1.5 rounded-full transition-all ${index === active ? 'w-6 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="next"
              className="rounded-full border border-white/10 p-2 text-gray-300 transition hover:border-primary/60 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600 sm:hidden">{t('certs.swipe')}</p>
        </div>
      </div>
    </section>
  );
}
