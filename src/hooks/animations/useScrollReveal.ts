import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>(
  options?: { y?: number; duration?: number; stagger?: number; scale?: number }
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial custom properties for the transition duration
    const duration = options?.duration ?? 0.6;
    el.style.transition = `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`;
    el.style.opacity = '0';
    el.style.transform = `translateY(${options?.y ?? 40}px) scale(${options?.scale ?? 0.98})`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [options?.y, options?.duration, options?.scale]);

  return ref;
}
