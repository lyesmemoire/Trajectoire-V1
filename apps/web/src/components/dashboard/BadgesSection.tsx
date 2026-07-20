"use client";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface BadgesSectionProps {
  badges: Badge[];
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  if (badges.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Badges</h3>
        <p className="text-slate-600">Aucun badge disponible. Complétez des simulations pour débloquer des badges.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Badges</h3>
        <span className="text-sm text-slate-600">
          {unlockedBadges.length} / {badges.length}
        </span>
      </div>

      {unlockedBadges.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-700 mb-3">Débloqués</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200 text-center"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="text-sm font-medium text-slate-900">{badge.name}</p>
                <p className="text-xs text-slate-600 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">À débloquer</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center opacity-60"
              >
                <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                <p className="text-sm font-medium text-slate-700">{badge.name}</p>
                <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
