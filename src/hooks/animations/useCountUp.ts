import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

export function useCountUp<T extends HTMLElement>(endValue: number, duration = 2000, decimals = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef<T>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          const obj = { val: 0 };
          anime({
            targets: obj,
            val: endValue,
            round: decimals === 0 ? 1 : Math.pow(10, decimals),
            easing: 'easeOutExpo',
            duration,
            update: () => {
              setValue(obj.val);
            }
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [endValue, duration]);

  return { ref, value };
}
