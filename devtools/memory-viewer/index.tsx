import React, { useState } from 'react';

interface MemoryViewerProps {
  memory: Uint8Array;
}

export const MemoryViewer: React.FC<MemoryViewerProps> = ({ memory }) => {
  const [viewOffset, setViewOffset] = useState(0);
  const bytesPerRow = 16;
  const rows = 32;

  const visibleMemory = memory.slice(viewOffset, viewOffset + rows * bytesPerRow);

  return (
    <div className="memory-viewer">
      <div className="controls">
        <button onClick={() => setViewOffset(Math.max(0, viewOffset - rows * bytesPerRow))}>
          Previous
        </button>
        <span>Offset: 0x{viewOffset.toString(16)}</span>
        <button onClick={() => setViewOffset(viewOffset + rows * bytesPerRow)}>
          Next
        </button>
      </div>
      <div className="memory-grid">
        {Array.from({ length: rows }).map((_, row) => {
          const rowOffset = row * bytesPerRow;
          const rowBytes = visibleMemory.slice(rowOffset, rowOffset + bytesPerRow);
          const address = viewOffset + rowOffset;
          
          return (
            <div key={row} className="memory-row">
              <span className="address">0x{address.toString(16).padStart(8, '0')}:</span>
              {Array.from({ length: bytesPerRow }).map((_, col) => {
                const byte = rowBytes[col];
                return (
                  <span key={col} className="byte">
                    {byte !== undefined ? byte.toString(16).padStart(2, '0') : '  '}
                  </span>
                );
              })}
              <span className="ascii">
                {rowBytes.map(b => (b >= 32 && b < 127 ? String.fromCharCode(b) : '.')).join('')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
