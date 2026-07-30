import React, { useState } from 'react';

interface Breakpoint {
  id: string;
  file: string;
  line: number;
  enabled: boolean;
}

interface DebuggerUIProps {
  breakpoints: Breakpoint[];
  onToggleBreakpoint: (id: string) => void;
  onStep: () => void;
  onContinue: () => void;
  onPause: () => void;
}

export const DebuggerUI: React.FC<DebuggerUIProps> = ({
  breakpoints,
  onToggleBreakpoint,
  onStep,
  onContinue,
  onPause,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const handleContinue = () => {
    setIsPaused(false);
    onContinue();
  };

  const handlePause = () => {
    setIsPaused(true);
    onPause();
  };

  return (
    <div className="debugger-ui">
      <div className="controls">
        <button onClick={handleContinue} disabled={!isPaused}>
          ▶ Continue
        </button>
        <button onClick={onStep} disabled={!isPaused}>
          ⏭ Step Over
        </button>
        <button onClick={onStep} disabled={!isPaused}>
          ⏩ Step Into
        </button>
        <button onClick={handlePause} disabled={isPaused}>
          ⏸ Pause
        </button>
      </div>
      <div className="breakpoints">
        <h3>Breakpoints</h3>
        {breakpoints.map(bp => (
          <div key={bp.id} className="breakpoint">
            <input
              type="checkbox"
              checked={bp.enabled}
              onChange={() => onToggleBreakpoint(bp.id)}
            />
            <span>{bp.file}:{bp.line}</span>
          </div>
        ))}
      </div>
      <div className="status">
        <span className={isPaused ? 'paused' : 'running'}>
          {isPaused ? '⏸ Paused' : '▶ Running'}
        </span>
      </div>
    </div>
  );
};
