import { create } from 'zustand';

export type WatchStatus = 'Watching' | 'Completed' | 'Paused' | 'Dropped' | 'Plan to Watch';

export interface WatchlistItem {
  id: string;
  animeId: number;
  title: string;
  imageUrl: string;
  episodesWatched: number;
  totalEpisodes: number | null;
  status: WatchStatus;
  score: number | null;
  addedAt: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  setItems: (items: WatchlistItem[]) => void;
  addItem: (item: WatchlistItem) => void;
  updateItem: (id: string, updates: Partial<WatchlistItem>) => void;
  removeItem: (id: string) => void;
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
}));
