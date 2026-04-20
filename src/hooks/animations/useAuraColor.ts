import { useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';

export interface AuraColor {
  r: number;
  g: number;
  b: number;
  hex: string;
  isDark: boolean;
}

export function useAuraColor(imageUrl?: string | null): AuraColor | null {
  const [color, setColor] = useState<AuraColor | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setColor(null);
      return;
    }

    const fac = new FastAverageColor();
    const cleanUrl = imageUrl.replace(/&amp;/g, '&');
    
    fac.getColorAsync(cleanUrl, { crossOrigin: 'anonymous' })
      .then((c) => {
        setColor({
          r: c.value[0],
          g: c.value[1],
          b: c.value[2],
          hex: c.hex,
          isDark: c.isDark,
        });
      })
      .catch((e) => {
        console.error('Failed to get average color', e);
        setColor(null);
      });

    return () => fac.destroy();
  }, [imageUrl]);

  return color;
}
