'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { CheckCircle2, FileCode2, KeyRound, ScanSearch, ShieldCheck, ShieldX } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import type { ShieldStats } from './three/ShieldScene';

const ShieldCanvas = dynamic(() => import('./three/ShieldScene'), { ssr: false });

const SERVICES = [
  { key: 'pentest', icon: ScanSearch },
  { key: 'review', icon: FileCode2 },
  { key: 'secure', icon: ShieldCheck },
] as const;

const SERVICE_MS = 4200;

const CRACK_TARGET = 'x9#Kq2!v';
const CRACK_GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789#$%&@!?*';

// No centro do escudo: alguém tenta quebrar a senha, alguns caracteres chegam a travar,
// mas o escudo bloqueia a tentativa e tudo recomeça
function PasswordCrack({ active }: { active: boolean }) {
  const { t } = useTranslation();
  const [blocked, setBlocked] = useState(false);
  const [locked, setLocked] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      setBlocked(false);
      setLocked(0);
      for (let index = 1; index <= 5; index++) timers.push(setTimeout(() => setLocked(index), index * 550));
      timers.push(setTimeout(() => setBlocked(true), 3300));
      timers.push(setTimeout(cycle, 4900));
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [active]);

  useEffect(() => {
    if (!active || blocked) return;
    const timer = setInterval(() => setTick((value) => value + 1), 70);
    return () => clearInterval(timer);
  }, [active, blocked]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        animate={blocked ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-apple-strong flex flex-col items-center gap-2 rounded-2xl px-3.5 py-3"
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
            blocked ? 'border-accent/60 bg-accent/15 text-accent' : 'border-primary/50 bg-primary/10 text-primary'
          }`}
        >
          {blocked ? <ShieldX className="h-4 w-4" /> : <KeyRound className="h-4 w-4 animate-pulse" />}
        </span>
        <div className="flex gap-1" aria-hidden="true">
          {CRACK_TARGET.split('').map((char, index) => {
            const done = index < locked;
            return (
              <span
                key={index}
                className={`flex h-7 w-5 items-center justify-center rounded border font-mono text-xs font-bold transition-colors duration-200 sm:w-6 ${
                  blocked
                    ? 'border-accent/60 bg-accent/10 text-accent'
                    : done
                    ? 'border-primary/60 bg-primary/15 text-white'
                    : 'border-white/15 bg-black/40 text-gray-500'
                }`}
              >
                {blocked ? '×' : done ? char : CRACK_GLYPHS[Math.floor(Math.random() * CRACK_GLYPHS.length)]}
              </span>
            );
          })}
        </div>
        <p className={`font-mono text-[9px] uppercase tracking-[0.2em] ${blocked ? 'text-accent' : 'text-gray-300'}`}>
          {blocked ? t('cyberHud.denied') : t('cyberHud.trying')}
        </p>
      </motion.div>
    </div>
  );
}

type LabLine = { kind: 'cmd' | 'out' | 'danger' | 'ok'; text: string };

// Terminal da revisão de segurança: digita o roteiro e recomeça, no mesmo visual de vidro do site
function SecurityTerminal({
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
    }, 2400);
    return () => clearTimeout(timer);
  }, [active, lineIndex, lines.length]);

  const finished = active && lineIndex >= lines.length;
  const reviewing = !finished && lines[lineIndex]?.kind === 'danger';

  return (
    <div className="glass-apple-strong overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-white/20"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-white/20"></span>
          <span className="ml-2 font-mono text-[11px] text-gray-400">{title}</span>
        </div>
        <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span className="text-gray-500">run {String(run).padStart(2, '0')}</span>
          <span className={finished ? 'text-secondary' : reviewing ? 'text-accent' : 'text-primary'}>
            {finished ? 'ok' : reviewing ? 'review' : 'scan'}
          </span>
        </span>
      </div>
      <div className="min-h-[10.5rem] space-y-0.5 px-4 py-3 font-mono text-[12px] leading-[17px]">
        {(finished ? lines : lines.slice(0, lineIndex + 1)).map((line, index) => {
          const shown = finished || index < lineIndex ? line.text : line.text.slice(0, charIndex);
          return (
            <p
              key={`${run}-${line.text}-${index}`}
              className={
                line.kind === 'danger' ? 'text-accent' : line.kind === 'ok' ? 'text-secondary' : line.kind === 'cmd' ? 'text-white' : 'text-gray-400'
              }
            >
              {line.kind === 'cmd' && <span className="text-primary">$ </span>}
              {line.kind === 'danger' && <span>▲ </span>}
              {line.kind === 'ok' && <span>✓ </span>}
              {shown}
              {!finished && index === lineIndex && (
                <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-primary/80 animate-pulse"></span>
              )}
            </p>
          );
        })}
      </div>
      <AnimatePresence>
        {finished && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 border-t border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-300"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            {contained}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CyberLab() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const [started, setStarted] = useState(false);
  const [service, setService] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState<'cards' | 'terminal'>('cards');
  const shieldStats = useRef<ShieldStats>({ blocked: 0, allowed: 0 });

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  // Os três tipos de trabalho em segurança ganham destaque um por vez
  useEffect(() => {
    if (!inView || paused) return;
    const timer = setInterval(() => setService((index) => (index + 1) % SERVICES.length), SERVICE_MS);
    return () => clearInterval(timer);
  }, [inView, paused, service]);

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

  const services = (
    <div data-tour="cyber-1" className="grid gap-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {SERVICES.map((item, index) => {
        const on = index === service;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setService(index)}
            className={`glass-apple relative overflow-hidden rounded-xl p-3.5 text-left transition-all duration-300 ${
              on ? 'border-primary/50' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                  on ? 'border-primary/50 bg-primary/15 text-primary' : 'border-white/10 bg-white/5 text-gray-400'
                }`}
              >
                <item.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="mb-0.5 flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="font-mono text-[10px] text-gray-500">0{index + 1}</span>
                  {t(`cyber.cards.${item.key}.title`)}
                </span>
                <span className="block text-[13px] leading-snug text-gray-400">{t(`cyber.cards.${item.key}.description`)}</span>
              </span>
            </div>
            {on && (
              <motion.span
                key={`bar-${service}`}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                initial={{ width: '0%' }}
                animate={{ width: paused || !inView ? '0%' : '100%' }}
                transition={{ duration: SERVICE_MS / 1000, ease: 'linear' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  const terminal = (
    <SecurityTerminal active={started} lines={lines} title={t('cyber.terminalTitle')} contained={t('cyber.contained')} />
  );

  return (
    <section id="cyber" ref={sectionRef} className="screen-section overflow-hidden">
      <div className="pointer-events-none absolute left-[8%] top-1/3 h-80 w-80 rounded-full bg-accent/10 blur-3xl"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex flex-col gap-2 md:mb-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="mb-1 font-mono text-[11px] tracking-[0.32em] text-accent">{t('cyber.kicker')}</p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
                {t('cyber.title')} <span className="text-primary">{t('cyber.titleHighlight')}</span>
              </h2>
            </div>
            <div className="max-w-md md:text-right">
              <p className="hidden text-sm text-gray-400 sm:block">{t('cyber.subtitle')}</p>
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
                {t('cyber.status')}
              </p>
            </div>
          </motion.div>

          <div className="grid items-stretch gap-3 lg:grid-cols-[1.05fr_1fr] lg:gap-5">
            <motion.div
              data-tour="cyber-0"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-apple-strong relative min-h-[11.5rem] overflow-hidden rounded-2xl sm:min-h-[18rem]"
            >
              <ShieldCanvas className="absolute inset-0" stats={shieldStats} />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-end p-3 font-mono text-[10px] uppercase tracking-[0.22em] sm:p-4">
                <span className="flex items-center gap-1.5 text-accent">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
                  {t('cyberHud.live')}
                </span>
              </div>
              <PasswordCrack active={inView} />
            </motion.div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-1 rounded-lg border border-white/10 bg-black/40 p-1 lg:hidden" role="tablist">
                {(['cards', 'terminal'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={`flex-1 rounded-md py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${tab === key ? 'bg-primary text-white' : 'text-gray-400'}`}
                  >
                    {t(`cyberTabs.${key}`)}
                  </button>
                ))}
              </div>
              <div className={`${tab === 'cards' ? 'block' : 'hidden'} lg:block`}>{services}</div>
              <div data-tour="cyber-2" className={`${tab === 'terminal' ? 'block' : 'hidden'} lg:block`}>
                {terminal}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
