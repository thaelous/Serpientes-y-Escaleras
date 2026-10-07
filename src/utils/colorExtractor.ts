/**
 * Utility to process corporate logos and extract the dominant accent color
 * Uses an off-screen HTML5 Canvas to inspect pixel data without dependencies
 */

export interface ColorExtractionResult {
  logoUrl: string;
  dominantColor: string;
  palette: string[];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === min) return 0;
  const d = max - min;
  const l = (max + min) / 2;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}

export function extractLogoBranding(file: File): Promise<ColorExtractionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Lectura de imagen vacía.'));
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onerror = () => reject(new Error('No se pudo cargar la imagen para análisis.'));

      img.onload = () => {
        try {
          const sampleSize = 64;
          const canvas = document.createElement('canvas');
          canvas.width = sampleSize;
          canvas.height = sampleSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({
              logoUrl: dataUrl,
              dominantColor: '#3b82f6',
              palette: ['#3b82f6', '#10b981', '#f59e0b']
            });
            return;
          }

          ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
          const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
          const data = imageData.data;

          // Color buckets grouped by 16 levels for quantization
          const colorCounts: Record<string, { count: number; r: number; g: number; b: number; saturation: number }> = {};

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Ignore transparent pixels
            if (a < 120) continue;

            // Ignore pure white, near-white backgrounds and near-black noise
            const isNearWhite = r > 240 && g > 240 && b > 240;
            const isNearBlack = r < 20 && g < 20 && b < 20;

            if (isNearWhite || isNearBlack) continue;

            // Quantize
            const qR = Math.floor(r / 24) * 24;
            const qG = Math.floor(g / 24) * 24;
            const qB = Math.floor(b / 24) * 24;
            const key = `${qR},${qG},${qB}`;

            const sat = getSaturation(r, g, b);

            if (!colorCounts[key]) {
              colorCounts[key] = { count: 1, r, g, b, saturation: sat };
            } else {
              colorCounts[key].count++;
            }
          }

          const buckets = Object.values(colorCounts);

          if (buckets.length === 0) {
            // Fallback for monochrome images (e.g., solid white/black logos)
            resolve({
              logoUrl: dataUrl,
              dominantColor: '#3b82f6', // Premium corporate blue
              palette: ['#3b82f6', '#60a5fa', '#1e3a8a']
            });
            return;
          }

          // Sort by combined score of frequency and saturation to pick the most vibrant branding color
          buckets.sort((a, b) => {
            const scoreA = a.count * (1 + a.saturation * 1.5);
            const scoreB = b.count * (1 + b.saturation * 1.5);
            return scoreB - scoreA;
          });

          const dominant = rgbToHex(buckets[0].r, buckets[0].g, buckets[0].b);

          // Get top 4 unique palette colors
          const palette: string[] = [dominant];
          for (let i = 1; i < buckets.length && palette.length < 5; i++) {
            const hex = rgbToHex(buckets[i].r, buckets[i].g, buckets[i].b);
            if (!palette.includes(hex)) {
              palette.push(hex);
            }
          }

          resolve({
            logoUrl: dataUrl,
            dominantColor: dominant,
            palette
          });
        } catch (err) {
          console.warn('Canvas pixel analysis error', err);
          resolve({
            logoUrl: dataUrl,
            dominantColor: '#3b82f6',
            palette: ['#3b82f6', '#10b981', '#f59e0b']
          });
        }
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
