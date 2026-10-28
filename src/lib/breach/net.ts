import type { DataConnection, Peer } from 'peerjs';
import type { Action } from './engine';

// Modo online: conexão direta entre os dois navegadores (WebRTC via PeerJS).
// O servidor público do PeerJS só faz o "aperto de mão"; as jogadas vão de um para o outro.
export type NetMessage =
  | { type: 'hello'; name: string }
  | { type: 'start'; seed: number; names: [string, string] }
  | { type: 'action'; action: Action }
  | { type: 'rematch'; seed: number }
  | { type: 'bye' };

export type NetHandlers = {
  onMessage: (message: NetMessage) => void;
  onConnected: () => void;
  onClosed: () => void;
  onError: (code: string) => void;
};

export type NetSession = {
  send: (message: NetMessage) => void;
  close: () => void;
};

const PREFIX = 'jm-portfolio-invasao-';
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function randomRoomCode() {
  return Array.from({ length: 5 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
}

export function normalizeRoomCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
}

function wire(peer: Peer, connection: DataConnection, handlers: NetHandlers): NetSession {
  connection.on('open', handlers.onConnected);
  connection.on('data', (data) => handlers.onMessage(data as NetMessage));
  connection.on('close', handlers.onClosed);
  connection.on('error', () => handlers.onError('connection'));
  return {
    send: (message) => {
      if (connection.open) connection.send(message);
    },
    close: () => {
      try {
        if (connection.open) connection.send({ type: 'bye' } satisfies NetMessage);
        connection.close();
      } finally {
        peer.destroy();
      }
    },
  };
}

// Cria a sala e espera o oponente. Resolve com a sessão quando alguém entra.
export async function hostRoom(code: string, handlers: NetHandlers): Promise<{ cancel: () => void; ready: Promise<NetSession> }> {
  const { default: PeerClass } = await import('peerjs');
  const peer = new PeerClass(PREFIX + code);
  const ready = new Promise<NetSession>((resolve) => {
    peer.on('connection', (connection) => {
      resolve(wire(peer, connection, handlers));
    });
  });
  peer.on('error', (error) => handlers.onError(error.type));
  return { cancel: () => peer.destroy(), ready };
}

export async function joinRoom(code: string, handlers: NetHandlers): Promise<NetSession> {
  const { default: PeerClass } = await import('peerjs');
  const peer = new PeerClass();
  peer.on('error', (error) => handlers.onError(error.type));
  return new Promise<NetSession>((resolve) => {
    peer.on('open', () => {
      const connection = peer.connect(PREFIX + code, { reliable: true });
      resolve(wire(peer, connection, handlers));
    });
  });
}
