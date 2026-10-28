'use client';

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { Radar, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CARDS, MAX_INTEGRITY, type CardId, type CardKind, type GameState, type LogEntry, type Player, type PlayerId } from '@/lib/breach/engine';
import PixelBot from '../PixelBot';
import HackerSprite from './HackerSprite';

// Arena do "Invasão": dois bonequinhos frente a frente. Quem ataca corre até o outro,
// dispara o pacote e o alvo treme; defesas erguem escudo e números flutuam.
export type Fighter = { pid: PlayerId; sprite: 'purple' | 'red' | 'bot' };

export type FxEvent = {
  serial: number;
  by: PlayerId;
  card: CardId;
  kind: CardKind;
  damage: number;
  absorbed: number;
  trapped: boolean;
  heal: number;
  shield: number;
  draw: number;
};

export function lastEvent(game: GameState): FxEvent | null {
  if (!game.lastPlayed) return null;
  const index = game.log.map((entry) => entry.kind).lastIndexOf('play');
  if (index < 0) return null;
  const play = game.log[index] as Extract<LogEntry, { kind: 'play' }>;
  const event: FxEvent = {
    serial: game.lastPlayed.serial,
    by: play.by,
    card: play.card,
    kind: CARDS[play.card].kind,
    damage: 0,
    absorbed: 0,
    trapped: false,
    heal: 0,
    shield: 0,
    draw: 0,
  };
  for (const entry of game.log.slice(index + 1)) {
    if (entry.kind === 'damage') {
      event.damage = entry.amount;
      event.absorbed = entry.absorbed;
    } else if (entry.kind === 'trap') event.trapped = true;
    else if (entry.kind === 'heal') event.heal = entry.amount;
    else if (entry.kind === 'shield') event.shield = entry.amount;
    else if (entry.kind === 'draw') event.draw = entry.amount;
    else if (entry.kind === 'turn' || entry.kind === 'play') break;
  }
  return event;
}

function Hud({ player, active, align }: { player: Player; active: boolean; align: 'left' | 'right' }) {
  const ratio = Math.max(0, player.integrity) / MAX_INTEGRITY;
  return (
    <div className={`w-28 sm:w-40 ${align === 'right' ? 'text-right' : ''}`}>
      <p className={`truncate font-mono text-[10px] uppercase tracking-[0.16em] sm:text-[11px] ${active ? 'text-white' : 'text-gray-400'}`}>
        {player.name}
      </p>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full ${ratio < 0.35 ? 'bg-accent' : 'bg-primary'} ${align === 'right' ? 'ml-auto' : ''}`}
          animate={{ width: `${ratio * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <p className={`mt-1 flex items-center gap-2 font-mono text-[10px] text-gray-400 ${align === 'right' ? 'justify-end' : ''}`}>
        <span className="text-white">{Math.max(0, player.integrity)}</span>
        <span className="flex items-center gap-0.5"><Shield className="h-3 w-3 text-primary" />{player.firewall}</span>
        {player.trap && <Radar className="h-3 w-3 text-secondary" />}
      </p>
    </div>
  );
}

function FighterView({
  fighter,
  side,
  player,
  event,
  active,
  ko,
  won,
}: {
  fighter: Fighter;
  side: 'left' | 'right';
  player: Player;
  event: FxEvent | null;
  active: boolean;
  ko: boolean;
  won: boolean;
}) {
  const position = useAnimationControls();
  const body = useAnimationControls();
  const [flash, setFlash] = useState(0);
  const isLeft = side === 'left';
  const base = isLeft ? '6%' : '94%';
  const strike = isLeft ? '48%' : '52%';
  const dir = isLeft ? 1 : -1;

  useEffect(() => {
    if (!event) return;
    const mine = event.by === fighter.pid;
    if (mine && event.kind === 'attack') {
      position.start({
        left: event.trapped ? [base, strike, isLeft ? '2%' : '98%', base] : [base, strike, strike, base],
        transition: { duration: 0.85, times: [0, 0.35, 0.6, 1], ease: 'easeInOut' },
      });
      body.start({ rotate: [0, dir * 8, 0], transition: { duration: 0.6 } });
    } else if (mine) {
      body.start({ y: [0, -16, 0], transition: { duration: 0.5 } });
    } else if (event.kind === 'attack' && !event.trapped) {
      body.start({ x: [0, -dir * 12, dir * 8, -dir * 4, 0], transition: { delay: 0.35, duration: 0.45 } });
      if (event.damage > 0) setFlash(event.serial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.serial]);

  useEffect(() => {
    if (ko) body.start({ rotate: dir * -90, y: 18, opacity: 0.45, transition: { duration: 0.5 } });
    else if (won) body.start({ y: [0, -14, 0], rotate: 0, opacity: 1, transition: { duration: 0.6, repeat: Infinity } });
    else body.start({ rotate: 0, y: 0, opacity: 1, transition: { duration: 0.3 } });
  }, [ko, won, body, dir]);

  return (
    <motion.div
      animate={position}
      initial={{ left: base }}
      style={{ x: isLeft ? '0%' : '-100%' }}
      className="absolute bottom-[12%] flex flex-col items-center"
    >
      <div className="mb-2">
        <Hud player={player} active={active} align={isLeft ? 'left' : 'right'} />
      </div>
      <motion.div animate={body} className="relative">
        <div className="animate-float">
          {fighter.sprite === 'bot' ? (
            <PixelBot className="h-20 w-20 sm:h-28 sm:w-28" />
          ) : (
            <HackerSprite variant={fighter.sprite} flip={!isLeft} className="h-20 w-20 sm:h-28 sm:w-28" />
          )}
        </div>
        <AnimatePresence>
          {flash > 0 && (
            <motion.span
              key={flash}
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              onAnimationComplete={() => setFlash(0)}
              className="pointer-events-none absolute inset-0 rounded-full bg-accent/60 mix-blend-screen blur-md"
            />
          )}
        </AnimatePresence>
      </motion.div>
      <span
        className={`mt-1 h-2 w-16 rounded-full blur-[3px] transition-colors duration-300 sm:w-20 ${
          active ? (fighter.sprite === 'purple' ? 'bg-primary/80' : 'bg-accent/80') : 'bg-black/60'
        }`}
      />
    </motion.div>
  );
}

function FloatText({ event, fighters }: { event: FxEvent; fighters: [Fighter, Fighter] }) {
  const { t } = useTranslation();
  const targetLeft = event.kind === 'attack' ? event.by !== fighters[0].pid : event.by === fighters[0].pid;
  let text = '';
  let tone = 'text-white';
  if (event.kind === 'attack') {
    if (event.trapped) {
      text = t('gameUi.trapped');
      tone = 'text-secondary';
    } else if (event.damage > 0) {
      text = `-${event.damage}`;
      tone = 'text-accent';
    } else {
      text = t('gameUi.blocked');
      tone = 'text-primary';
    }
  } else if (event.shield) {
    text = `+${event.shield} FW`;
    tone = 'text-primary';
  } else if (event.heal) {
    text = `+${event.heal}`;
    tone = 'text-secondary';
  } else if (event.draw) {
    text = t('gameUi.cards', { n: event.draw });
  } else if (event.card === 'honeypot') {
    text = 'HONEYPOT';
    tone = 'text-secondary';
  }
  if (!text) return null;
  return (
    <motion.span
      key={`float-${event.serial}`}
      initial={{ opacity: 0, y: 10, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 0], y: -50, scale: [0.6, 1.25, 1, 1] }}
      transition={{ delay: event.kind === 'attack' ? 0.4 : 0.1, duration: 1.3 }}
      className={`pointer-events-none absolute top-[28%] z-20 font-mono text-2xl font-bold drop-shadow-[0_0_12px_currentColor] sm:text-4xl ${tone}`}
      style={{ left: targetLeft ? '16%' : '84%', x: '-50%' }}
    >
      {text}
    </motion.span>
  );
}

export default function Arena({
  game,
  fighters,
  me,
  className,
}: {
  game: GameState;
  fighters: [Fighter, Fighter];
  me: PlayerId | null;
  className?: string;
}) {
  const { t } = useTranslation();
  const event = lastEvent(game);
  const shake = useAnimationControls();
  const [banner, setBanner] = useState<string | null>(null);
  const turnKey = `${game.round}-${game.turn}`;

  useEffect(() => {
    if (event && event.kind === 'attack' && event.damage >= 5) {
      shake.start({ x: [0, -8, 7, -5, 3, 0], transition: { delay: 0.35, duration: 0.45 } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.serial]);

  useEffect(() => {
    if (me === null || game.winner !== null) return;
    const name = game.players[game.turn].name.toUpperCase();
    setBanner(game.turn === me ? t('gameUi.yourTurnBanner') : t('gameUi.theirTurnBanner', { name }));
    const timer = setTimeout(() => setBanner(null), 1100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnKey, me]);

  const lastLine = event ? `${game.players[event.by].name} → ${t(`game.cards.${event.card}.name`)}` : '';
  const attackerLeft = event ? event.by === fighters[0].pid : true;

  return (
    <motion.div animate={shake} className={`relative overflow-hidden ${className ?? ''}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(139,92,246,0.28),transparent_60%),radial-gradient(ellipse_at_85%_20%,rgba(255,59,71,0.12),transparent_45%)]"></div>
      <div className="pointer-events-none absolute inset-x-[-40%] bottom-0 h-[58%] origin-bottom animate-[arenafloor_2.4s_linear_infinite] bg-[linear-gradient(rgba(139,92,246,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.32)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:linear-gradient(to_top,black,transparent)] [transform:perspective(380px)_rotateX(62deg)]"></div>
      <div className="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <AnimatePresence mode="wait">
        {lastLine && (
          <motion.p
            key={`line-${event?.serial}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-11 z-10 truncate px-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400 sm:top-3 sm:text-xs"
          >
            {lastLine}
          </motion.p>
        )}
      </AnimatePresence>

      <FighterView
        fighter={fighters[0]}
        side="left"
        player={game.players[fighters[0].pid]}
        event={event}
        active={game.turn === fighters[0].pid && game.winner === null}
        ko={game.winner !== null && game.winner !== fighters[0].pid}
        won={game.winner === fighters[0].pid}
      />
      <FighterView
        fighter={fighters[1]}
        side="right"
        player={game.players[fighters[1].pid]}
        event={event}
        active={game.turn === fighters[1].pid && game.winner === null}
        ko={game.winner !== null && game.winner !== fighters[1].pid}
        won={game.winner === fighters[1].pid}
      />

      <AnimatePresence>
        {event && event.kind === 'attack' && (
          <motion.div
            key={`shot-${event.serial}`}
            initial={{ left: attackerLeft ? '30%' : '70%', opacity: 0, scale: 0.5 }}
            animate={{ left: attackerLeft ? '80%' : '20%', opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.6] }}
            transition={{ delay: 0.22, duration: 0.45, ease: 'easeIn' }}
            className="pointer-events-none absolute bottom-[30%] z-20 h-3 w-10 rounded-full bg-gradient-to-r from-transparent via-accent to-white shadow-[0_0_20px_rgba(255,59,71,0.9)]"
            style={{ x: '-50%', rotate: attackerLeft ? 0 : 180 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {event && (event.absorbed > 0 || event.shield > 0 || event.trapped) && (
          <motion.span
            key={`shield-${event.serial}`}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.15, 1.3] }}
            transition={{ delay: event.kind === 'attack' ? 0.4 : 0.05, duration: 0.9 }}
            className={`pointer-events-none absolute bottom-[14%] z-10 h-32 w-32 rounded-full border-2 sm:h-44 sm:w-44 ${
              event.trapped ? 'border-secondary bg-secondary/10' : 'border-primary bg-primary/10'
            } shadow-[0_0_40px_rgba(139,92,246,0.6)]`}
            style={{
              x: '-50%',
              left: (event.kind === 'attack' ? event.by !== fighters[0].pid : event.by === fighters[0].pid) ? '16%' : '84%',
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{event && <FloatText event={event} fighters={fighters} />}</AnimatePresence>

      <AnimatePresence>
        {banner && (
          <motion.div
            key={turnKey}
            initial={{ opacity: 0, scale: 1.6, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, scale: 1, letterSpacing: '0.3em' }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute inset-x-0 top-[34%] z-30 text-center font-mono text-xl font-bold text-white drop-shadow-[0_0_18px_rgba(139,92,246,0.9)] sm:text-3xl"
          >
            {banner}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
