import { memo, useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';

const PizzaImage = memo(function PizzaImage({
  src,
  srcLarge,
  srcThumb,
  alt = 'Pizza',
  className = '',
  containerClassName = '',
  size,
  aspectRatio = '1/1',
  loading = 'lazy',
  objectFit = 'cover',
  rounded = false,
  fallbackSrc,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const fallbackGradient = (
    <div className={cn(
      'absolute inset-0 flex items-center justify-center',
      'bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-500/10 dark:to-brand-600/5',
    )}>
      <svg className="w-12 h-12 text-brand-300 dark:text-brand-500/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <circle cx="12" cy="12" r="5" opacity="0.3"/>
      </svg>
    </div>
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface-100 dark:bg-white/[0.03]',
        rounded && 'rounded-full',
        containerClassName
      )}
      style={size ? { width: size, height: size } : { aspectRatio }}
      {...props}
    >
      {/* Shimmer placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-surface-100 via-surface-50 to-surface-100 dark:from-white/[0.03] dark:via-white/[0.06] dark:to-white/[0.03]" />
      )}

      {/* Error fallback */}
      {error && fallbackGradient}

      {/* Actual image */}
      {!error && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'w-full h-full transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            className
          )}
          style={{ objectFit }}
        />
      )}
    </div>
  );
});

export default PizzaImage;
