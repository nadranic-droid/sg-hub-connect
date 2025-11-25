import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  placeholderColor?: string;
  blurHash?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  threshold?: number;
  rootMargin?: string;
}

const DEFAULT_FALLBACK = "/placeholder.svg";
const PLACEHOLDER_COLOR = "#e5e7eb"; // gray-200

export function LazyImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  placeholderColor = PLACEHOLDER_COLOR,
  aspectRatio,
  objectFit = "cover",
  threshold = 0.1,
  rootMargin = "50px",
  className,
  style,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const imgRef = useRef<HTMLDivElement>(null);

  // Use Intersection Observer to detect when image is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Load image when in view
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      setHasError(false);
    };

    img.onerror = () => {
      setHasError(true);
      if (fallbackSrc && fallbackSrc !== src) {
        setCurrentSrc(fallbackSrc);
        setIsLoaded(true);
      }
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, src, fallbackSrc]);

  // Generate optimized Cloudinary URL if applicable
  const getOptimizedSrc = (originalSrc: string): string => {
    if (!originalSrc) return "";

    // If it's a Cloudinary URL, add optimization parameters
    if (originalSrc.includes("cloudinary.com")) {
      // Add auto format and quality parameters
      if (originalSrc.includes("/upload/")) {
        return originalSrc.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_800/"
        );
      }
    }

    return originalSrc;
  };

  const displaySrc = hasError ? fallbackSrc : getOptimizedSrc(currentSrc);

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        className
      )}
      style={{
        backgroundColor: !isLoaded ? placeholderColor : undefined,
        aspectRatio,
        ...style,
      }}
    >
      {/* Placeholder shimmer effect */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}

      {/* Actual image */}
      {isInView && displaySrc && (
        <img
          src={displaySrc}
          alt={alt}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            objectFit,
          }}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (!hasError) {
              setHasError(true);
              setCurrentSrc(fallbackSrc);
            }
          }}
          {...props}
        />
      )}
    </div>
  );
}

// Simple hook for lazy loading any element
export function useLazyLoad(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

// Progressive image loading with blur effect
export function ProgressiveImage({
  src,
  alt,
  lowQualitySrc,
  className,
  ...props
}: {
  src: string;
  alt: string;
  lowQualitySrc?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);
  const [showHighQuality, setShowHighQuality] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsHighQualityLoaded(true);
      // Small delay for smooth transition
      setTimeout(() => setShowHighQuality(true), 50);
    };

    return () => {
      img.onload = null;
    };
  }, [src]);

  // Generate low quality placeholder from Cloudinary
  const getLowQualitySrc = (originalSrc: string): string => {
    if (lowQualitySrc) return lowQualitySrc;

    if (originalSrc.includes("cloudinary.com") && originalSrc.includes("/upload/")) {
      return originalSrc.replace(
        "/upload/",
        "/upload/e_blur:1000,q_10,w_50/"
      );
    }

    return originalSrc;
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Low quality blurred placeholder */}
      <img
        src={getLowQualitySrc(src)}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
          showHighQuality ? "opacity-0" : "opacity-100",
          "blur-lg scale-105"
        )}
      />

      {/* High quality image */}
      {isHighQualityLoaded && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            showHighQuality ? "opacity-100" : "opacity-0"
          )}
          {...props}
        />
      )}
    </div>
  );
}
