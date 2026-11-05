import type { ImgHTMLAttributes } from 'react';

type Variant = {
  widths: number[];
  fullWidth: number;
  sizes: string;
};

const VARIANTS: Record<string, Variant> = {
  '/dance.png': { widths: [320, 640], fullWidth: 1536, sizes: '128px' },
  '/combo.png': { widths: [320, 640], fullWidth: 1536, sizes: '128px' },
  '/onlineclass.png': { widths: [320, 640], fullWidth: 1536, sizes: '128px' },
  '/svc-hiphop.png': { widths: [480, 768], fullWidth: 1024, sizes: '33vw' },
  '/svc-stage.png': { widths: [480, 768], fullWidth: 1024, sizes: '33vw' },
  '/anubhav.png': { widths: [480, 768], fullWidth: 1122, sizes: '(max-width: 768px) 90vw, 520px' },
};

function srcSet(base: string, ext: 'avif' | 'webp', variant: Variant): string {
  const parts = variant.widths.map((width) => `${base}-${width}.${ext} ${width}w`);
  parts.push(`${base}.${ext} ${variant.fullWidth}w`);
  return parts.join(', ');
}

function localPath(src: string): string {
  if (src.startsWith('/')) return src.split('?')[0];
  try {
    return new URL(src).pathname;
  } catch {
    return src.split('?')[0];
  }
}

function responsiveSources(src: string): { avif: string; webp: string; sizes: string } | null {
  const path = localPath(src);
  const variant = VARIANTS[path];
  if (!variant) return null;
  const base = path.replace(/\.png$/i, '');
  return {
    avif: srcSet(base, 'avif', variant),
    webp: srcSet(base, 'webp', variant),
    sizes: variant.sizes,
  };
}

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fill?: boolean;
  sizes?: string;
};

const ResponsiveImage = ({ src, alt = '', fill = false, sizes, style, ...rest }: Props) => {
  const sources = responsiveSources(src);
  const sizesAttr = sizes || sources?.sizes;
  const fillStyle = fill
    ? { width: '100%', height: '100%', objectFit: 'cover' as const, display: 'block' as const }
    : undefined;

  if (!sources) {
    return <img src={src} alt={alt} style={{ ...fillStyle, ...style }} {...rest} />;
  }

  return (
    <picture style={fill ? { display: 'block', width: '100%', height: '100%' } : undefined}>
      <source type="image/avif" srcSet={sources.avif} sizes={sizesAttr} />
      <source type="image/webp" srcSet={sources.webp} sizes={sizesAttr} />
      <img src={src} alt={alt} style={{ ...fillStyle, ...style }} {...rest} />
    </picture>
  );
};

export default ResponsiveImage;
