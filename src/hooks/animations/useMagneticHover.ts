import { useRef } from 'react';
import { useSpring } from 'react-spring';
import { useHover } from '@use-gesture/react';

export function useMagneticHover<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  
  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 1, tension: 500, friction: 30 }
  }));

  const bind = useHover(({ hovering, event, active }) => {
    if (!ref.current || !hovering) {
      api.start({ x: 0, y: 0 });
      return;
    }
    
    // Fallback if not pointer event
    if (!('clientX' in event)) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseEvent = event as MouseEvent;
    const distanceX = mouseEvent.clientX - centerX;
    const distanceY = mouseEvent.clientY - centerY;

    api.start({
      x: distanceX * strength,
      y: distanceY * strength
    });
  });

  return { ref, style: { x, y }, bind };
}
