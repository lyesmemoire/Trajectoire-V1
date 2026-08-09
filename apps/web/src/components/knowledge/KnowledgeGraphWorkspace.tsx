'use client';

import { useState, useEffect } from 'react';

export function KnowledgeGraphWorkspace() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/knowledge/nodes');
      if (response.ok) {
        const data = await response.json();
        setNodes(data.nodes || []);
      }
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNodes = nodes.filter(node =>
    node.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Graph</h1>
          <p className="text-gray-600 mt-2">Visualisez et explorez les relations entre compétences et métiers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Graphe de connaissances</h2>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un nœud..."
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p>Visualisation interactive du graphe</p>
                  <p className="text-sm mt-2">Sélectionnez un nœud pour voir ses détails</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Nœuds</h2>
              
              {loading ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  Chargement...
                </div>
              ) : nodes.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  Aucun nœud disponible
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredNodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedNode?.id === node.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{node.name}</div>
                      <div className="text-sm text-gray-500">
                        {node.type} • {node.connections} connexions
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedNode && (
              <div className="bg-white p-6 rounded-lg shadow mt-6">
                <h2 className="text-xl font-semibold mb-4">Détails</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Nom</div>
                    <div className="font-medium">{selectedNode.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Type</div>
                    <div className="font-medium">{selectedNode.type}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Connexions</div>
                    <div className="font-medium">{selectedNode.connections}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">Nœuds connectés</div>
                    <div className="flex flex-wrap gap-2">
                      {nodes.filter((n: any) => n.id !== selectedNode.id).slice(0, 3).map((node: any) => (
                        <span key={node.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {node.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
