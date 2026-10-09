'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Course = {
  title: string;
  platform: string;
  hours: string;
  description: string;
  certificateUrl?: string;
};

export default function Education() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const educationTitles = [
    t('education.academic.english.title'),
    t('education.academic.highSchool.title'),
    t('education.academic.canada.title'),
    t('education.academic.graduation.title'),
  ];

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

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((index) => (index + 1) % courses.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [paused, courses.length]);

  const current = courses[active];

  useEffect(() => {
    const strip = stripRef.current;
    const child = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !child) return;
    const left = child.offsetLeft - strip.clientWidth / 2 + child.clientWidth / 2;
    strip.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  return (
    <section id="education" className="relative overflow-hidden bg-[#05080d] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,212,255,0.14),transparent_36%),radial-gradient(circle_at_10%_80%,rgba(139,92,246,0.12),transparent_32%)]"></div>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <p className="mb-4 font-mono text-sm tracking-[0.32em] text-primary">{t('education.kicker')}</p>
            <h2 className="mb-6 text-4xl font-black text-white md:text-5xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {t('education.title')} <span className="text-primary text-glow-cyan">{t('education.titleHighlight')}</span>
            </h2>
            <div className="mx-auto h-1 w-20 bg-gradient-to-r from-primary to-secondary"></div>
          </motion.div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {educationTitles.map((title) => (
              <span
                key={title}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white"
              >
                {title}
              </span>
            ))}
          </div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-black/70 shadow-[0_0_80px_rgba(0,212,255,0.16)]">
                <span className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-primary/80"></span>
                <span className="pointer-events-none absolute right-3 top-3 h-8 w-8 border-r-2 border-t-2 border-primary/80"></span>
                <span className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-primary/80"></span>
                <span className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-primary/80"></span>
                <div className="pointer-events-none absolute inset-x-8 top-0 h-24 animate-[eduscan_3.6s_linear_infinite] bg-gradient-to-b from-transparent via-primary/25 to-transparent"></div>

                <div className="flex items-center justify-between border-b border-primary/20 px-6 py-4">
                  <p className="font-mono text-xs tracking-[0.28em] text-primary">{t('education.hud')}</p>
                  <div className="flex items-center gap-3">
                    <span className="relative h-8 w-8">
                      <span className="absolute inset-0 rounded-full border border-primary/40"></span>
                      <span className="absolute inset-1 animate-spin rounded-full border-t-2 border-primary" style={{ animationDuration: '2.4s' }}></span>
                    </span>
                    <p className="font-mono text-sm text-white">
                      <span className="text-primary">{String(active + 1).padStart(2, '0')}</span>
                      <span className="text-gray-500"> / {String(courses.length).padStart(2, '0')}</span>
                    </p>
                  </div>
                </div>

                <div className="min-h-[18rem] px-6 py-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.title}
                      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                      transition={{ duration: 0.35 }}
                    >
                      <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-accent">
                        {t('education.scanning')} · {current.platform}
                      </p>
                      {current.certificateUrl ? (
                        <a
                          href={current.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mb-3 block text-3xl font-black text-white transition hover:text-primary"
                          style={{ fontFamily: 'var(--font-orbitron)' }}
                        >
                          {current.title}
                        </a>
                      ) : (
                        <h3 className="mb-3 text-3xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                          {current.title}
                        </h3>
                      )}
                      <p className="mb-4 font-mono text-sm text-primary">{current.hours}</p>
                      <p className="max-w-xl text-base leading-relaxed text-gray-300">{current.description}</p>
                      {current.certificateUrl && (
                        <a
                          href={current.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary transition hover:bg-primary/20"
                        >
                          <Award className="h-4 w-4" />
                          {t('education.courses.viewCertificate')}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div ref={stripRef} className="flex flex-wrap gap-2 border-t border-primary/20 px-4 py-4">
                  {courses.map((course, index) => {
                    const on = index === active;
                    const className = `rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      on
                        ? 'border-primary bg-primary/15 text-primary shadow-[0_0_24px_rgba(0,212,255,0.25)]'
                        : 'border-white/10 text-white hover:border-primary/40'
                    }`;
                    if (!course.certificateUrl) {
                      return (
                        <span key={`${course.title}-${index}`} className={className}>
                          {course.title}
                        </span>
                      );
                    }
                    return (
                      <a
                        key={`${course.title}-${index}`}
                        href={course.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {course.title}
                      </a>
                    );
                  })}
                </div>
              </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @keyframes eduscan {
          0% { transform: translateY(-40%); }
          100% { transform: translateY(420%); }
        }
      `}</style>
    </section>
  );
}
