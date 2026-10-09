'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LabLine = { kind: 'cmd' | 'out' | 'danger' | 'ok'; text: string };

function DangerTerminal({
  active,
  lines,
  title,
  contained,
}: {
  active: boolean;
  lines: LabLine[];
  title: string;
  contained: string;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [run, setRun] = useState(1);
  const scriptKey = lines.map((line) => line.text).join('|');

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
    setRun(1);
  }, [scriptKey]);

  useEffect(() => {
    if (!active || lineIndex >= lines.length) return;
    const current = lines[lineIndex].text;
    if (charIndex < current.length) {
      const speed = lines[lineIndex].kind === 'danger' ? 26 : lines[lineIndex].kind === 'cmd' ? 38 : 14;
      const timer = setTimeout(() => setCharIndex((index) => index + 1), speed);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setLineIndex((index) => index + 1);
      setCharIndex(0);
    }, lines[lineIndex].kind === 'danger' ? 380 : 220);
    return () => clearTimeout(timer);
  }, [active, lineIndex, charIndex, lines]);

  useEffect(() => {
    if (!active || lineIndex < lines.length) return;
    const timer = setTimeout(() => {
      setLineIndex(0);
      setCharIndex(0);
      setRun((value) => value + 1);
    }, 1400);
    return () => clearTimeout(timer);
  }, [active, lineIndex, lines.length]);

  const finished = active && lineIndex >= lines.length;
  const dangerLive = !finished && lines[lineIndex]?.kind === 'danger';

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 bg-black shadow-[0_0_80px_rgba(255,30,50,0.35)] ${dangerLive ? 'border-red-500' : 'border-red-500/50'}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,40,60,0.08) 3px)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-red-500/20 to-transparent" />
      <div className="relative flex items-center justify-between border-b border-red-500/40 bg-red-950/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70"></span>
          <span className="ml-2 font-mono text-xs uppercase tracking-widest text-red-200">{title}</span>
        </div>
        <span className={`font-mono text-xs font-black tracking-[0.28em] ${finished ? 'text-accent' : 'text-primary'}`}>
          {finished ? 'OK' : 'SCAN'}
        </span>
      </div>
      <div className="relative flex items-center justify-between border-b border-red-500/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-red-300/80">
        <span>run {String(run).padStart(2, '0')}</span>
        <span className={dangerLive ? 'text-primary' : 'text-emerald-400/80'}>{dangerLive ? 'review' : 'live'}</span>
      </div>
      <div className="relative min-h-[24rem] space-y-2 px-4 py-4 font-mono text-sm leading-relaxed sm:text-[15px]">
        {(finished ? lines : lines.slice(0, lineIndex + 1)).map((line, index) => {
          const shown = finished || index < lineIndex ? line.text : line.text.slice(0, charIndex);
          const color =
            line.kind === 'danger' ? 'text-red-400' :
            line.kind === 'ok' ? 'text-accent' :
            line.kind === 'cmd' ? 'text-emerald-300' :
            'text-gray-300';
          return (
            <p key={`${run}-${line.text}-${index}`} className={color}>
              {line.kind === 'cmd' && <span className="text-red-400/80">lab@sec:~# </span>}
              {shown}
              {!finished && index === lineIndex && (
                <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-red-400 animate-pulse"></span>
              )}
            </p>
          );
        })}
      </div>
      {finished && (
        <p className="border-t border-red-500/40 bg-red-950/50 px-4 py-3 text-center font-mono text-xs font-bold tracking-[0.35em] text-red-300">
          {contained}
        </p>
      )}
    </div>
  );
}

export default function CyberLab() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const lines = useMemo<LabLine[]>(() => [
    { kind: 'cmd', text: t('cyber.lines.boot') },
    { kind: 'out', text: t('cyber.lines.bootOut') },
    { kind: 'danger', text: t('cyber.lines.danger1') },
    { kind: 'danger', text: t('cyber.lines.danger2') },
    { kind: 'danger', text: t('cyber.lines.danger3') },
    { kind: 'cmd', text: t('cyber.lines.isolate') },
    { kind: 'out', text: t('cyber.lines.isolateOut') },
    { kind: 'cmd', text: t('cyber.lines.lock') },
    { kind: 'out', text: t('cyber.lines.lockOut') },
    { kind: 'ok', text: t('cyber.lines.ok') },
  ], [t]);

  const cards = ['pentest', 'review', 'secure'] as const;

  return (
    <section id="cyber" ref={sectionRef} className="relative overflow-hidden bg-[#050306] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,20,40,0.22),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(0,255,120,0.08),transparent_32%)]"></div>
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,40,60,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,40,60,0.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden border-y border-red-500/30 bg-black/70 py-2">
        <p className="animate-[marquee_18s_linear_infinite] whitespace-nowrap font-mono text-xs tracking-[0.45em] text-primary/80">
          {`${t('cyber.ticker')} ${t('cyber.ticker')}`}
        </p>
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 font-mono text-sm tracking-[0.32em] text-primary">{t('cyber.kicker')}</p>
            <h2 className="mb-5 text-4xl font-black leading-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {t('cyber.title')}{' '}
              <span className="text-primary drop-shadow-[0_0_18px_rgba(0,212,255,0.45)]">{t('cyber.titleHighlight')}</span>
            </h2>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-gray-300">{t('cyber.subtitle')}</p>
            <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.22em] text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
              {t('cyber.status')}
            </p>
            <div className="grid gap-4">
              {cards.map((card, index) => (
                <div key={card} className="rounded-xl border border-red-500/30 bg-black/50 p-4 shadow-[inset_0_0_24px_rgba(255,40,60,0.06)]">
                  <p className="mb-1 font-mono text-[11px] tracking-[0.28em] text-red-400">0{index + 1}</p>
                  <h3 className="mb-1 font-semibold text-white">{t(`cyber.cards.${card}.title`)}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{t(`cyber.cards.${card}.description`)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <DangerTerminal
              active={active}
              lines={lines}
              title={t('cyber.terminalTitle')}
              contained={t('cyber.contained')}
            />
          </motion.div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
