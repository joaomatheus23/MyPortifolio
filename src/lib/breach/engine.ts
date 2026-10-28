// Motor do "Invasão": duelo de cartas hacker. Tudo aqui é puro e determinístico
// (mesma seed + mesmas ações = mesmo estado), o que permite o modo online em lockstep.

export type PlayerId = 0 | 1;

export type CardId =
  | 'phishing'
  | 'bruteforce'
  | 'zeroday'
  | 'ddos'
  | 'ransomware'
  | 'firewall'
  | 'encrypt'
  | 'patch'
  | 'backup'
  | 'honeypot'
  | 'scan';

export type CardKind = 'attack' | 'defense' | 'utility';

export type CardDef = {
  id: CardId;
  cost: number;
  kind: CardKind;
  damage?: number;
  pierce?: boolean;
  bonusVsOpen?: number;
  drain?: number;
  discard?: number;
  shield?: number;
  heal?: number;
  trap?: boolean;
  draw?: number;
};

export const CARDS: Record<CardId, CardDef> = {
  phishing: { id: 'phishing', cost: 1, kind: 'attack', damage: 3 },
  bruteforce: { id: 'bruteforce', cost: 2, kind: 'attack', damage: 4, bonusVsOpen: 2 },
  zeroday: { id: 'zeroday', cost: 4, kind: 'attack', damage: 6, pierce: true },
  ddos: { id: 'ddos', cost: 3, kind: 'attack', damage: 4, drain: 1 },
  ransomware: { id: 'ransomware', cost: 5, kind: 'attack', damage: 6, discard: 1 },
  firewall: { id: 'firewall', cost: 2, kind: 'defense', shield: 4 },
  encrypt: { id: 'encrypt', cost: 3, kind: 'defense', shield: 6 },
  patch: { id: 'patch', cost: 1, kind: 'defense', heal: 3 },
  backup: { id: 'backup', cost: 4, kind: 'defense', heal: 5 },
  honeypot: { id: 'honeypot', cost: 2, kind: 'defense', trap: true },
  scan: { id: 'scan', cost: 1, kind: 'utility', draw: 2 },
};

const DECK: [CardId, number][] = [
  ['phishing', 3],
  ['bruteforce', 3],
  ['zeroday', 1],
  ['ddos', 2],
  ['ransomware', 1],
  ['firewall', 3],
  ['encrypt', 1],
  ['patch', 2],
  ['backup', 1],
  ['honeypot', 1],
  ['scan', 2],
];

export const MAX_INTEGRITY = 18;
export const MAX_FIREWALL = 10;
export const MAX_CPU = 6;
export const MAX_HAND = 7;

export type Card = { uid: number; id: CardId };

export type Player = {
  name: string;
  integrity: number;
  firewall: number;
  cpu: number;
  maxCpu: number;
  drained: number;
  trap: boolean;
  hand: Card[];
  deck: Card[];
};

export type LogEntry =
  | { kind: 'play'; by: PlayerId; card: CardId }
  | { kind: 'damage'; target: PlayerId; amount: number; absorbed: number }
  | { kind: 'trap'; target: PlayerId }
  | { kind: 'heal'; by: PlayerId; amount: number }
  | { kind: 'shield'; by: PlayerId; amount: number }
  | { kind: 'draw'; by: PlayerId; amount: number }
  | { kind: 'discard'; target: PlayerId }
  | { kind: 'drain'; target: PlayerId }
  | { kind: 'fatigue'; by: PlayerId }
  | { kind: 'turn'; by: PlayerId };

export type GameState = {
  players: [Player, Player];
  turn: PlayerId;
  round: number;
  winner: PlayerId | null;
  seed: number;
  rng: number;
  nextUid: number;
  log: LogEntry[];
  lastPlayed: { by: PlayerId; card: CardId; serial: number } | null;
};

export type Action = { type: 'play'; uid: number } | { type: 'end' };

const other = (id: PlayerId): PlayerId => (id === 0 ? 1 : 0);

function nextRandom(state: GameState) {
  let t = (state.rng += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function pushLog(state: GameState, entry: LogEntry) {
  state.log = [...state.log.slice(-29), entry];
}

function draw(state: GameState, id: PlayerId, amount: number) {
  const player = state.players[id];
  for (let i = 0; i < amount; i++) {
    const card = player.deck.shift();
    if (!card) {
      // Baralho vazio: o sistema começa a falhar
      player.integrity -= 1;
      pushLog(state, { kind: 'fatigue', by: id });
      continue;
    }
    if (player.hand.length < MAX_HAND) player.hand.push(card);
  }
}

function checkWinner(state: GameState) {
  if (state.players[0].integrity <= 0) state.winner = 1;
  else if (state.players[1].integrity <= 0) state.winner = 0;
}

function startTurn(state: GameState, id: PlayerId) {
  const player = state.players[id];
  player.maxCpu = Math.min(MAX_CPU, player.maxCpu + 1);
  player.cpu = Math.max(0, player.maxCpu - player.drained);
  player.drained = 0;
  state.turn = id;
  pushLog(state, { kind: 'turn', by: id });
  draw(state, id, 1);
  checkWinner(state);
}

function newPlayer(name: string): Player {
  return { name, integrity: MAX_INTEGRITY, firewall: 0, cpu: 0, maxCpu: 1, drained: 0, trap: false, hand: [], deck: [] };
}

export function createGame(seed: number, names: [string, string]): GameState {
  const state: GameState = {
    players: [newPlayer(names[0]), newPlayer(names[1])],
    turn: 0,
    round: 1,
    winner: null,
    seed,
    rng: seed >>> 0,
    nextUid: 1,
    log: [],
    lastPlayed: null,
  };

  state.players.forEach((player) => {
    const cards: Card[] = [];
    DECK.forEach(([id, count]) => {
      for (let i = 0; i < count; i++) cards.push({ uid: state.nextUid++, id });
    });
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(nextRandom(state) * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    player.deck = cards;
  });

  draw(state, 0, 4);
  draw(state, 1, 5);
  // Quem joga depois compensa com uma carta e 1 CPU a mais no primeiro turno
  state.players[1].drained = -1;
  startTurn(state, 0);
  return state;
}

export function canPlay(state: GameState, by: PlayerId, card: Card) {
  return state.winner === null && state.turn === by && CARDS[card.id].cost <= state.players[by].cpu;
}

function resolve(state: GameState, by: PlayerId, def: CardDef) {
  const me = state.players[by];
  const target = other(by);
  const foe = state.players[target];

  if (def.kind === 'attack') {
    if (foe.trap) {
      foe.trap = false;
      pushLog(state, { kind: 'trap', target });
      return;
    }
    let damage = def.damage ?? 0;
    if (def.bonusVsOpen && foe.firewall === 0) damage += def.bonusVsOpen;
    const absorbed = def.pierce ? 0 : Math.min(foe.firewall, damage);
    foe.firewall -= absorbed;
    foe.integrity -= damage - absorbed;
    pushLog(state, { kind: 'damage', target, amount: damage - absorbed, absorbed });
    if (def.drain) {
      foe.drained += def.drain;
      pushLog(state, { kind: 'drain', target });
    }
    if (def.discard && foe.hand.length) {
      const index = Math.floor(nextRandom(state) * foe.hand.length);
      foe.hand.splice(index, 1);
      pushLog(state, { kind: 'discard', target });
    }
    return;
  }

  if (def.shield) {
    const before = me.firewall;
    me.firewall = Math.min(MAX_FIREWALL, me.firewall + def.shield);
    pushLog(state, { kind: 'shield', by, amount: me.firewall - before });
  }
  if (def.heal) {
    const before = me.integrity;
    me.integrity = Math.min(MAX_INTEGRITY, me.integrity + def.heal);
    pushLog(state, { kind: 'heal', by, amount: me.integrity - before });
  }
  if (def.trap) me.trap = true;
  if (def.draw) {
    draw(state, by, def.draw);
    pushLog(state, { kind: 'draw', by, amount: def.draw });
  }
}

// Aplica a ação de quem está na vez. Ações inválidas devolvem o mesmo estado.
export function applyAction(current: GameState, by: PlayerId, action: Action): GameState {
  if (current.winner !== null || current.turn !== by) return current;
  const state: GameState = structuredClone(current);

  if (action.type === 'end') {
    const next = other(by);
    if (next === 0) state.round += 1;
    startTurn(state, next);
    return state;
  }

  const me = state.players[by];
  const index = me.hand.findIndex((card) => card.uid === action.uid);
  if (index < 0) return current;
  const card = me.hand[index];
  const def = CARDS[card.id];
  if (def.cost > me.cpu) return current;

  me.cpu -= def.cost;
  me.hand.splice(index, 1);
  pushLog(state, { kind: 'play', by, card: card.id });
  state.lastPlayed = { by, card: card.id, serial: (current.lastPlayed?.serial ?? 0) + 1 };
  resolve(state, by, def);
  checkWinner(state);
  return state;
}

function effectiveDamage(def: CardDef, foeFirewall: number) {
  let damage = def.damage ?? 0;
  if (def.bonusVsOpen && foeFirewall === 0) damage += def.bonusVsOpen;
  return def.pierce ? damage : Math.max(0, damage - foeFirewall) + Math.min(foeFirewall, damage) * 0.35;
}

// IA da máquina: escolhe a jogada de maior valor, ou encerra o turno
export function chooseAiAction(state: GameState, me: PlayerId): Action {
  const self = state.players[me];
  const foe = state.players[other(me)];
  let best: { uid: number; score: number } | null = null;

  self.hand.forEach((card) => {
    if (!canPlay(state, me, card)) return;
    const def = CARDS[card.id];
    let score = 0;
    if (def.kind === 'attack') {
      const dealt = def.pierce ? def.damage ?? 0 : Math.max(0, (def.damage ?? 0) + (def.bonusVsOpen && foe.firewall === 0 ? def.bonusVsOpen : 0) - foe.firewall);
      if (foe.trap) score = def.cost <= 1 ? 6 : 0.5;
      else if (dealt >= foe.integrity) score = 100;
      else score = effectiveDamage(def, foe.firewall) * 1.3 + (def.drain ? 1.5 : 0) + (def.discard ? 2 : 0);
    } else if (def.heal) {
      const missing = MAX_INTEGRITY - self.integrity;
      score = self.integrity <= 10 ? Math.min(def.heal, missing) * 1.4 : Math.min(def.heal, missing) * 0.4;
    } else if (def.shield) {
      score = self.firewall < 4 ? Math.min(def.shield, MAX_FIREWALL - self.firewall) * 0.9 : 0.6;
    } else if (def.trap) {
      score = self.trap ? 0 : 3.2;
    } else if (def.draw) {
      score = self.hand.length <= 3 ? 4 : 1.2;
    }
    score -= def.cost * 0.15;
    if (score > 0.4 && (!best || score > best.score)) best = { uid: card.uid, score };
  });

  const choice = best as { uid: number; score: number } | null;
  return choice ? { type: 'play', uid: choice.uid } : { type: 'end' };
}
