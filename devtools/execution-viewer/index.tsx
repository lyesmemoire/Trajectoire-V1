import React, { useEffect, useState } from 'react';

interface ExecutionStep {
  pc: number;
  instruction: string;
  stack: number[];
  registers: Record<string, number>;
}

interface ExecutionViewerProps {
  steps: ExecutionStep[];
}

export const ExecutionViewer: React.FC<ExecutionViewerProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep(s => s + 1), 100);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, steps.length]);

  const step = steps[currentStep] || steps[0];

  return (
    <div className="execution-viewer">
      <div className="controls">
        <button onClick={() => setCurrentStep(0)}>⏮</button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={() => setCurrentStep(s => Math.min(s + 1, steps.length - 1))}>
          ⏭
        </button>
        <span>Step {currentStep + 1} / {steps.length}</span>
      </div>
      <div className="step-info">
        <h3>PC: 0x{step.pc.toString(16)}</h3>
        <p>{step.instruction}</p>
        <div className="registers">
          <h4>Registers:</h4>
          {Object.entries(step.registers).map(([name, value]) => (
            <div key={name}>{name}: 0x{value.toString(16)}</div>
          ))}
        </div>
        <div className="stack">
          <h4>Stack:</h4>
          {step.stack.map((value, i) => (
            <div key={i}>0x{i.toString(16)}: 0x{value.toString(16)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
