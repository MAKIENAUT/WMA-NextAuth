import { ReactNode } from "react";

export default function InputGroup({ 
  children, 
  className = "" 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return <div className={`flex flex-col gap-2 mb-2 ${className}`}>{children}</div>;
}