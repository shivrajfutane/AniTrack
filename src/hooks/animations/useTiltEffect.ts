import { useRef, useEffect, useState } from 'react';

export function useTiltEffect<T extends HTMLElement>(maxDeg = 12) {
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = x / rect.width;
      const py = y / rect.height;

      const rotateX = (maxDeg / 2 - py * maxDeg).toFixed(2);
      const rotateY = (px * maxDeg - maxDeg / 2).toFixed(2);

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'none',
      });

      // Inner shine sweep logic
      setShineStyle({
        opacity: 0.15,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, transparent 40%)`,
      });
    };

    const handleMouseLeave = () => {
      setStyle({
        transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)', // ease-out-expo equivalent
      });
      setShineStyle({ opacity: 0 });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxDeg]);

  return { ref, style, shineStyle };
}
