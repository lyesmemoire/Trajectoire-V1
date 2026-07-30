import React from 'react';
import { CodeEditor } from '@monaco-editor/react';

interface IRViewerProps {
  ir: string;
}

export const IRViewer: React.FC<IRViewerProps> = ({ ir }) => {
  return (
    <div className="ir-viewer">
      <CodeEditor
        height="600px"
        defaultLanguage="llvm"
        value={ir}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};
