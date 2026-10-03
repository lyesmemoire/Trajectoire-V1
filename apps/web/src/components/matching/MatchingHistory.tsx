'use client';

import { useState, useEffect } from 'react';

export function MatchingHistory({ 
  onSelectMatch, 
  showHistory, 
  onToggleHistory 
}: { 
  onSelectMatch: (match: any) => void; 
  showHistory: boolean;
  onToggleHistory: () => void;
}) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/matching/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-calm-surface p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-sans text-xl font-semibold tracking-normal">Historique</h2>
        <button
          onClick={onToggleHistory}
          className="text-calm-accent-deep hover:text-calm-accent-deep text-sm"
        >
          {showHistory ? 'Masquer' : 'Afficher'}
        </button>
      </div>

      {showHistory ? (
        loading ? (
          <div className="text-sm text-calm-tertiary text-center py-4">
            Chargement...
          </div>
        ) : history.length === 0 ? (
          <div className="text-sm text-calm-tertiary text-center py-4">
            Aucun historique disponible
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectMatch(item)}
                className="p-3 border rounded-lg hover:bg-calm-accent-wash cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{item.job}</span>
                  <span className="text-calm-accent-deep font-bold">{item.score}%</span>
                </div>
                <div className="text-xs text-calm-tertiary">{item.date}</div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-sm text-calm-tertiary text-center py-4">
          Cliquez pour afficher l'historique
        </div>
      )}
    </div>
  );
}
