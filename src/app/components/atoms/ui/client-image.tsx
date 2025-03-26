"use client";

import Image from "next/image";

interface ClientImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export default function ClientImage(props: ClientImageProps) {
  return (
    <Image {...props} onError={() => console.error("Image failed to load")} />
  );
}
