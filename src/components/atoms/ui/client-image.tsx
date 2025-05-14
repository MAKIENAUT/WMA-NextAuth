"use client";

import { useState } from "react";
import Image from "next/image";

interface ClientImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
}

export default function ClientImage({
  src,
  alt,
  width,
  height,
  priority,
  className,
  fallbackSrc = "/images/placeholder.png", // Default fallback image
  ...rest
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${src}`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
}