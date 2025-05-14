export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  processSteps?: ProcessStep[];
  category?: {
    title: string;
    description: string;
    processSteps?: ProcessStep[];
  }[];
}
