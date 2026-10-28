'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Bot,
  BrickWall,
  Bug,
  Check,
  Copy,
  Cpu,
  DatabaseBackup,
  FileLock,
  Fish,
  HelpCircle,
  KeyRound,
  Layers,
  Radar,
  ScanSearch,
  ShieldCheck,
  Swords,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CARDS,
  applyAction,
  canPlay,
  chooseAiAction,
  createGame,
  type Action,
  type Card,
  type CardId,
  type GameState,
  type PlayerId,
} from '@/lib/breach/engine';
import { hostRoom, joinRoom, normalizeRoomCode, randomRoomCode, type NetMessage, type NetSession } from '@/lib/breach/net';
import { useIntro } from '@/lib/introStore';
import Arena, { type Fighter } from './game/Arena';

const ICONS: Record<CardId, LucideIcon> = {
  phishing: Fish,
  bruteforce: KeyRound,
  zeroday: Bug,
  ddos: Activity,
  ransomware: FileLock,
  firewall: BrickWall,
  encrypt: ShieldCheck,
  patch: Wrench,
  backup: DatabaseBackup,
  honeypot: Radar,
  scan: ScanSearch,
};

const KIND_STYLE = {
  attack: { border: 'border-accent/50', text: 'text-accent', glow: 'from-accent/25' },
  defense: { border: 'border-primary/50', text: 'text-primary', glow: 'from-primary/25' },
  utility: { border: 'border-white/15', text: 'text-gray-300', glow: 'from-white/10' },
};

type Mode = 'lobby' | 'hosting' | 'joining' | 'playing';
type Opponent = 'ai' | 'online';

const other = (id: PlayerId): PlayerId => (id === 0 ? 1 : 0);
const newSeed = () => Math.floor(Math.random() * 2 ** 31);

function GameCard({ card, playable, onPlay }: { card: Card; playable: boolean; onPlay: () => void }) {
  const { t } = useTranslation();
  const def = CARDS[card.id];
  const Icon = ICONS[card.id];
  const style = KIND_STYLE[def.kind];
  return (
    <motion.button
      type="button"
      layout
      initial={{ rotateY: 180, opacity: 0, y: 30 }}
      animate={{ rotateY: 0, opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -120, scale: 0.6, rotate: -8, transition: { duration: 0.35 } }}
      whileHover={playable ? { y: -16, rotateX: 12, scale: 1.06 } : undefined}
      whileTap={playable ? { scale: 0.96 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{ transformPerspective: 700 }}
      disabled={!playable}
      onClick={onPlay}
      className={`group relative flex h-32 w-[5.6rem] shrink-0 flex-col overflow-hidden rounded-xl border bg-[#111114] p-2 text-left shadow-[0_12px_30px_rgba(0,0,0,0.5)] sm:h-40 sm:w-28 sm:p-2.5 ${style.border} ${
        playable ? 'cursor-pointer' : 'cursor-not-allowed opacity-40 saturate-50'
      }`}
    >
      <span className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${style.glow} to-transparent opacity-60 transition group-hover:opacity-100`} />
      <span className="relative flex items-center justify-between">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-black/60 font-mono text-[11px] font-bold text-white sm:h-6 sm:w-6">{def.cost}</span>
        <span className={`font-mono text-[8px] uppercase tracking-[0.15em] sm:text-[9px] ${style.text}`}>{t(`game.kinds.${def.kind}`)}</span>
      </span>
      <span className={`relative my-auto flex justify-center py-1 ${style.text}`}>
        <Icon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />
      </span>
      <span className="relative text-[11px] font-semibold leading-tight text-white sm:text-sm">{t(`game.cards.${card.id}.name`)}</span>
      <span className="relative mt-0.5 line-clamp-3 text-[9px] leading-snug text-gray-400 sm:text-[10px]">{t(`game.cards.${card.id}.text`)}</span>
    </motion.button>
  );
}

// Partida máquina contra máquina rodando atrás do lobby para chamar a atenção
function useDemoGame(running: boolean, names: [string, string]) {
  const [demo, setDemo] = useState(() => createGame(7, names));

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setDemo((current) => {
        if (current.winner !== null) return createGame(newSeed(), names);
        const action = chooseAiAction(current, current.turn);
        const next = applyAction(current, current.turn, action);
        return next === current ? applyAction(current, current.turn, { type: 'end' }) : next;
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [running, names]);

  return demo;
}

export default function BreachGame() {
  const { t } = useTranslation();
  const unlocked = useIntro((s) => s.unlocked);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [mode, setMode] = useState<Mode>('lobby');
  const [opponent, setOpponent] = useState<Opponent>('ai');
  const [game, setGame] = useState<GameState | null>(null);
  const [me, setMe] = useState<PlayerId>(0);
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [peerGone, setPeerGone] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const sessionRef = useRef<NetSession | null>(null);
  const cancelHostRef = useRef<(() => void) | null>(null);
  const meRef = useRef<PlayerId>(0);
  const nameRef = useRef('');
  const autoJoinRef = useRef(false);
  const [demoNames] = useState<[string, string]>(['Hacker', 'Bit']);
  const demo = useDemoGame(mode !== 'playing' && inView, demoNames);

  const playerName = useCallback(() => name.trim().slice(0, 16) || t('game.defaultName'), [name, t]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    meRef.current = me;
  }, [me]);
  useEffect(() => {
    nameRef.current = playerName();
  }, [playerName]);

  const closeSession = useCallback(() => {
    sessionRef.current?.close();
    sessionRef.current = null;
    cancelHostRef.current?.();
    cancelHostRef.current = null;
  }, []);

  useEffect(() => closeSession, [closeSession]);

  const backToLobby = () => {
    closeSession();
    setGame(null);
    setMode('lobby');
    setPeerGone(false);
    setStatus(null);
  };

  const onMessage = useCallback((message: NetMessage) => {
    if (message.type === 'hello') {
      const seed = newSeed();
      const names: [string, string] = [nameRef.current, message.name.slice(0, 16) || t('game.defaultName')];
      sessionRef.current?.send({ type: 'start', seed, names });
      setMe(0);
      setGame(createGame(seed, names));
      setMode('playing');
    } else if (message.type === 'start') {
      setMe(1);
      setGame(createGame(message.seed, message.names));
      setMode('playing');
    } else if (message.type === 'action') {
      setGame((current) => (current ? applyAction(current, other(meRef.current), message.action) : current));
    } else if (message.type === 'rematch') {
      setGame((current) => (current ? createGame(message.seed, [current.players[0].name, current.players[1].name]) : current));
    } else if (message.type === 'bye') {
      setPeerGone(true);
    }
  }, [t]);

  const netHandlers = useCallback(
    (onConnected: () => void) => ({
      onMessage,
      onConnected,
      onClosed: () => setPeerGone(true),
      onError: (code: string) => {
        const key = code === 'peer-unavailable' ? 'notFound' : code === 'browser-incompatible' ? 'unsupported' : 'network';
        setStatus(t(`game.errors.${key}`));
        if (code !== 'connection') {
          closeSession();
          setMode('lobby');
        }
      },
    }),
    [closeSession, onMessage, t],
  );

  const startAi = () => {
    closeSession();
    setOpponent('ai');
    setMe(0);
    setGame(createGame(newSeed(), [playerName(), t('game.aiName')]));
    setMode('playing');
    setStatus(null);
  };

  const createRoom = async () => {
    closeSession();
    setOpponent('online');
    setStatus(null);
    const code = randomRoomCode();
    setRoomCode(code);
    setMode('hosting');
    try {
      const room = await hostRoom(code, netHandlers(() => undefined));
      cancelHostRef.current = room.cancel;
      sessionRef.current = await room.ready;
    } catch {
      setStatus(t('game.errors.network'));
      setMode('lobby');
    }
  };

  const enterRoom = useCallback(async (rawCode: string) => {
    const code = normalizeRoomCode(rawCode);
    if (code.length !== 5) {
      setStatus(t('game.errors.code'));
      return;
    }
    closeSession();
    setOpponent('online');
    setStatus(null);
    setMode('joining');
    try {
      sessionRef.current = await joinRoom(
        code,
        netHandlers(() => sessionRef.current?.send({ type: 'hello', name: nameRef.current })),
      );
    } catch {
      setStatus(t('game.errors.network'));
      setMode('lobby');
    }
  }, [closeSession, netHandlers, t]);

  // Convite por link: ?sala=CODIGO abre direto o modo online
  useEffect(() => {
    const code = normalizeRoomCode(new URLSearchParams(window.location.search).get('sala') ?? '');
    if (code) setJoinCode(code);
  }, []);

  useEffect(() => {
    if (!unlocked || autoJoinRef.current || joinCode.length !== 5) return;
    if (!new URLSearchParams(window.location.search).get('sala')) return;
    autoJoinRef.current = true;
    document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' });
    enterRoom(joinCode);
  }, [unlocked, joinCode, enterRoom]);

  const act = (action: Action) => {
    if (!game || game.turn !== me) return;
    const next = applyAction(game, me, action);
    if (next === game) return;
    setGame(next);
    if (opponent === 'online') sessionRef.current?.send({ type: 'action', action });
  };

  // Turno da máquina: uma jogada a cada 1,1 s para dar tempo de ver a animação
  useEffect(() => {
    if (opponent !== 'ai' || !game || game.winner !== null || game.turn !== 1) return;
    const timer = setTimeout(() => {
      setGame((current) => {
        if (!current || current.turn !== 1 || current.winner !== null) return current;
        const action = chooseAiAction(current, 1);
        const next = applyAction(current, 1, action);
        return next === current ? applyAction(current, 1, { type: 'end' }) : next;
      });
    }, 1100);
    return () => clearTimeout(timer);
  }, [game, opponent]);

  const rematch = () => {
    if (!game) return;
    if (opponent === 'ai') {
      setGame(createGame(newSeed(), [game.players[0].name, game.players[1].name]));
      return;
    }
    if (me !== 0) return;
    const seed = newSeed();
    sessionRef.current?.send({ type: 'rematch', seed });
    setGame(createGame(seed, [game.players[0].name, game.players[1].name]));
  };

  const inviteLink = typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}?sala=${roomCode}#game`;
  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const playing = mode === 'playing' && game;
  const shown = playing ? game : demo;
  const fighters: [Fighter, Fighter] = playing
    ? [
        { pid: me, sprite: 'purple' },
        { pid: other(me), sprite: opponent === 'ai' ? 'bot' : 'red' },
      ]
    : [
        { pid: 0, sprite: 'purple' },
        { pid: 1, sprite: 'bot' },
      ];
  const mine = playing ? game.players[me] : null;
  const myTurn = playing ? game.turn === me && game.winner === null : false;

  return (
    <section id="game" ref={sectionRef} className="screen-section overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex flex-col gap-2 md:mb-5 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{t('game.kicker')}</p>
              <h2 data-tour="game-0" className="text-3xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
                {t('game.title')}
              </h2>
            </div>
            <p className="hidden max-w-md text-sm text-gray-400 sm:block md:text-right">{t('game.subtitle')}</p>
          </motion.div>

          <div data-tour="game-1" className="relative overflow-hidden rounded-2xl border glass-apple-strong shadow-[0_0_80px_rgba(139,92,246,0.12)]">
            <Arena game={shown} fighters={fighters} me={playing ? me : null} className="h-[30svh] min-h-[13rem] sm:h-[38svh] lg:h-[40svh]" />

            {!playing && (
              <span className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-accent/40 bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
                {t('gameUi.demo')}
              </span>
            )}
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-300 transition hover:border-primary/60"
            >
              <HelpCircle className="h-3 w-3" />
              {t('gameUi.rules')}
            </button>

            <div data-tour="game-2" className="glass-apple relative rounded-none border-x-0 border-b-0">
              <AnimatePresence mode="wait">
                {!playing && (
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="p-4 sm:p-6"
                  >
                    {mode === 'lobby' && (
                      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                        <div>
                          <label htmlFor="breach-name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-gray-300">
                            {t('game.nameLabel')}
                          </label>
                          <input
                            id="breach-name"
                            value={name}
                            maxLength={16}
                            onChange={(event) => setName(event.target.value)}
                            placeholder={t('game.defaultName')}
                            className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-primary/60 focus:outline-none"
                          />
                        </div>
                        <motion.button
                          type="button"
                          onClick={startAi}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-5 py-2.5 font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.45)]"
                        >
                          <span className="absolute inset-0 animate-[shine_2.6s_linear_infinite] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] bg-[length:200%_100%]"></span>
                          <Bot className="relative h-4 w-4" />
                          <span className="relative">{t('game.vsAi')}</span>
                        </motion.button>
                        <button
                          type="button"
                          onClick={createRoom}
                          className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 font-semibold text-white transition hover:border-accent/60"
                        >
                          <Users className="h-4 w-4" />
                          {t('game.createRoom')}
                        </button>
                        <form
                          className="flex gap-2 md:col-span-3"
                          onSubmit={(event) => {
                            event.preventDefault();
                            enterRoom(joinCode);
                          }}
                        >
                          <input
                            value={joinCode}
                            onChange={(event) => setJoinCode(normalizeRoomCode(event.target.value))}
                            placeholder={t('game.codePlaceholder')}
                            aria-label={t('game.codePlaceholder')}
                            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono uppercase tracking-[0.3em] text-white placeholder:tracking-normal placeholder-gray-400 focus:border-primary/60 focus:outline-none"
                          />
                          <button type="submit" className="rounded-lg border border-white/15 px-5 py-2.5 font-semibold text-white transition hover:border-accent/60 hover:text-accent">
                            {t('game.join')}
                          </button>
                        </form>
                        {status && <p className="font-mono text-xs text-accent md:col-span-3">{status}</p>}
                      </div>
                    )}

                    {mode === 'hosting' && (
                      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">{t('game.roomCode')}</p>
                          <p className="font-mono text-4xl font-bold tracking-[0.3em] text-white">{roomCode}</p>
                          <p className="mt-1 flex items-center gap-2 font-mono text-xs text-gray-400">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
                            {t('game.waiting')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={copyInvite}
                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/85"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? t('game.copied') : t('game.copyLink')}
                          </button>
                          <button type="button" onClick={backToLobby} className="rounded-lg px-4 py-2.5 text-sm text-gray-400 hover:text-white">
                            {t('game.cancel')}
                          </button>
                        </div>
                      </div>
                    )}

                    {mode === 'joining' && (
                      <div className="flex items-center justify-between">
                        <p className="flex items-center gap-2 font-mono text-sm text-gray-300">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                          {t('game.connecting')}
                        </p>
                        <button type="button" onClick={backToLobby} className="text-sm text-gray-400 hover:text-white">
                          {t('game.cancel')}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {playing && mine && (
                <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className={`font-mono text-[10px] uppercase tracking-[0.22em] ${myTurn ? 'text-primary' : 'text-gray-500'}`}>
                      {myTurn ? t('game.yourTurn') : t('game.theirTurn', { name: game.players[game.turn].name })} · {t('game.round', { round: game.round })}
                    </p>
                    <span className="flex items-center gap-3 font-mono text-[10px] text-gray-400">
                      <span className="flex items-center gap-1" title={t('game.cpu')}>
                        <Cpu className="h-3.5 w-3.5" />
                        {Array.from({ length: mine.maxCpu }, (_, index) => (
                          <span key={index} className={`h-2 w-2 rounded-sm ${index < mine.cpu ? 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]' : 'bg-white/10'}`} />
                        ))}
                      </span>
                      <span className="flex items-center gap-1" title={t('game.deck')}>
                        <Layers className="h-3.5 w-3.5" />
                        {mine.deck.length}
                      </span>
                    </span>
                  </div>
                  <div className="no-scrollbar flex items-end gap-2 overflow-x-auto pb-1 pt-4 sm:justify-center" style={{ perspective: 900 }} aria-label={t('gameUi.hand')}>
                    <AnimatePresence>
                      {mine.hand.map((card) => (
                        <GameCard key={card.uid} card={card} playable={canPlay(game, me, card)} onPlay={() => act({ type: 'play', uid: card.uid })} />
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button type="button" onClick={backToLobby} className="rounded-lg px-3 py-2 text-xs text-gray-500 transition hover:text-white">
                      {t('game.leave')}
                    </button>
                    <motion.button
                      type="button"
                      disabled={!myTurn}
                      onClick={() => act({ type: 'end' })}
                      animate={myTurn ? { boxShadow: ['0 0 0 rgba(139,92,246,0)', '0 0 24px rgba(139,92,246,0.7)', '0 0 0 rgba(139,92,246,0)'] } : { boxShadow: '0 0 0 rgba(0,0,0,0)' }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/85 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
                    >
                      {t('game.endTurn')}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {playing && (game.winner !== null || peerGone) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: game.winner !== null ? 0.9 : 0 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/80 p-6 text-center backdrop-blur-sm"
                >
                  <motion.p
                    initial={{ letterSpacing: '0.8em', opacity: 0 }}
                    animate={{ letterSpacing: '0.35em', opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className={`font-mono text-xs uppercase ${game.winner === me ? 'text-accent' : 'text-gray-400'}`}
                  >
                    {peerGone && game.winner === null ? t('game.disconnectedKicker') : game.winner === me ? t('game.winKicker') : t('game.loseKicker')}
                  </motion.p>
                  <p className="max-w-md text-2xl font-bold tracking-tight text-white md:text-4xl">
                    {peerGone && game.winner === null
                      ? t('game.disconnected')
                      : game.winner === me
                      ? t('game.win', { name: game.players[other(me)].name })
                      : t('game.lose', { name: game.players[other(me)].name })}
                  </p>
                  <div className="mt-2 flex gap-3">
                    {!peerGone && (opponent === 'ai' || me === 0) && (
                      <button type="button" onClick={rematch} className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary/85">
                        {t('game.rematch')}
                      </button>
                    )}
                    {!peerGone && opponent === 'online' && me === 1 && <p className="self-center font-mono text-xs text-gray-500">{t('game.waitHost')}</p>}
                    <button type="button" onClick={backToLobby} className="rounded-lg border border-white/15 px-5 py-2.5 font-semibold text-white transition hover:border-white/40">
                      {t('game.leave')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {rulesOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                  onClick={() => setRulesOpen(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="relative w-full max-w-lg rounded-xl border border-white/10 bg-[#0c0c0f] p-5"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setRulesOpen(false)}
                      aria-label={t('gameUi.close')}
                      className="absolute right-3 top-3 rounded p-1 text-gray-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300">
                      <Swords className="h-4 w-4 text-accent" />
                      {t('game.rulesTitle')}
                    </p>
                    <ul className="space-y-2 text-sm leading-relaxed text-gray-400">
                      {(t('game.rules', { returnObjects: true }) as string[]).map((rule) => (
                        <li key={rule} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"></span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs leading-relaxed text-gray-500">{t('game.onlineNote')}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
