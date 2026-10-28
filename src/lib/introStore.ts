import { useSyncExternalStore } from 'react';

// Estado da intro "quebrar a criptografia do laptop", compartilhado entre o hero,
// a cena 3D, a navegação e o robô guia
export type IntroState = {
  progress: number;
  unlocked: boolean;
  hits: number;
};

const initial: IntroState = { progress: 0, unlocked: false, hits: 0 };
let state: IntroState = initial;
const listeners = new Set<() => void>();

export const introStore = {
  get: () => state,
  set(partial: Partial<IntroState>) {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener());
  },
  // Cada tentativa de força bruta avança a quebra da criptografia
  hit(amount = 0.08) {
    if (state.unlocked) return;
    introStore.set({ progress: Math.min(1, state.progress + amount), hits: state.hits + 1 });
  },
  finish() {
    introStore.set({ progress: 1 });
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useIntro<T>(selector: (s: IntroState) => T): T {
  return useSyncExternalStore(
    introStore.subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

// Cada seção depois do hero é liberada quando o progresso passa da sua fatia
export function sectionUnlocked(index: number, total: number, progress: number, unlocked: boolean) {
  if (unlocked || index === 0) return true;
  return progress >= index / total;
}
