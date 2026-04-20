import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'celebrate';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface UiState {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarExpanded: true, // we might want to check localStorage or window width, but simplified for now
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => {
      const newToasts = [{ ...toast, id }, ...state.toasts].slice(0, 4);
      return { toasts: newToasts };
    });
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));

export const useToast = () => {
  const { addToast } = useUiStore();
  
  return {
    success: (message: string, title?: string) => addToast({ type: 'success', message, title}),
    error: (message: string, title?: string) => addToast({ type: 'error', message, title}),
    info: (message: string, title?: string) => addToast({ type: 'info', message, title}),
    celebrate: (message: string, title?: string) => addToast({ type: 'celebrate', message, title}),
  };
};
