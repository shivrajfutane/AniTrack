import { useState, useEffect, useRef } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export function useTextScramble<T extends HTMLElement>(text: string, trigger: 'mount' | 'hover' | 'inView' = 'mount') {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef<T>(null);
  const isScrambling = useRef(false);

  const scramble = () => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    
    let frame = 0;
    const length = text.length;
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    
    for (let i = 0; i < length; i++) {
      const from = displayText[i] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end });
    }

    const update = () => {
      let output = '';
      let complete = 0;
      
      for (let i = 0, n = queue.length; i < n; i++) {
        const { from, to, start, end } = queue[i];
        let char = queue[i].char;
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = queue[i].char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          output += char;
        } else {
          output += from;
        }
      }
      
      setDisplayText(output);
      
      if (complete === queue.length) {
        isScrambling.current = false;
        setDisplayText(text); // reset to final
      } else {
        frame++;
        requestAnimationFrame(update);
      }
    };
    
    update();
  };

  useEffect(() => {
    if (trigger === 'mount') {
      scramble();
    } else if (!displayText) {
      setDisplayText(text);
    }
  }, [text, trigger]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (trigger === 'hover') {
      el.addEventListener('mouseenter', scramble);
      return () => el.removeEventListener('mouseenter', scramble);
    }
    
    if (trigger === 'inView' && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          scramble();
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [trigger]);

  return { displayText: displayText || text, ref, scramble };
}
