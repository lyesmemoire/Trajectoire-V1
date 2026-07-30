import React from 'react';
import { CodeEditor } from '@monaco-editor/react';

interface BytecodeViewerProps {
  bytecode: Uint8Array;
}

export const BytecodeViewer: React.FC<BytecodeViewerProps> = ({ bytecode }) => {
  const hexString = Array.from(bytecode)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');

  const disassembled = hexString
    .split(' ')
    .map((hex, i) => `0x${i.toString(16).padStart(4, '0')}: 0x${hex}`)
    .join('\n');

  return (
    <div className="bytecode-viewer">
      <CodeEditor
        height="600px"
        defaultLanguage="asm"
        value={disassembled}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};
