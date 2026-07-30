import React from 'react';
import { Tree } from 'react-arborist';

interface ASTNode {
  id: string;
  type: string;
  value?: unknown;
  children?: ASTNode[];
}

interface ASTViewerProps {
  ast: ASTNode;
}

export const ASTViewer: React.FC<ASTViewerProps> = ({ ast }) => {
  const treeData = {
    id: 'root',
    name: ast.type,
    data: ast,
    children: ast.children?.map((child, i) => ({
      id: `${ast.id}-${i}`,
      name: child.type,
      data: child,
      children: child.children?.map((grandchild, j) => ({
        id: `${ast.id}-${i}-${j}`,
        name: grandchild.type,
        data: grandchild,
      })),
    })),
  };

  return (
    <div className="ast-viewer">
      <Tree data={treeData} />
    </div>
  );
};
