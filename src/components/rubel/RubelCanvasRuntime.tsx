"use client";

import { RubelPlayCore } from "@/components/rubel/RubelPlayCore";
import type { Diagnosis } from "@/types/rubel";

interface RubelCanvasRuntimeProps {
  diagnosis: Diagnosis;
  onPlayComplete?: () => void;
}

const RubelCanvasRuntime = ({ diagnosis, onPlayComplete }: RubelCanvasRuntimeProps) => {
  return <RubelPlayCore diagnosis={diagnosis} onPlayComplete={onPlayComplete} />;
};

export { RubelCanvasRuntime };
