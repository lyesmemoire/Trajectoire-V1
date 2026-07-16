"use client";

import { useEffect, useState, useCallback } from "react";

interface FraudUser {
  user_id: string;
  risk_score: number;
  fraud_flag: boolean;
  flags: string[];
  updated_at: string;
  profiles: {
    credits: number;
    plan: string;
    banned: boolean;
    organization_id: string | null;
  } | null;
}

export default function FraudCenter() {
  const [users, setUsers] = useState<FraudUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [restoreUserId, setRestoreUserId] = useState<string | null>(null);
  const [restoreAmount, setRestoreAmount] = useState(5);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/fraud-users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function adminAction(endpoint: string, body: Record<string, any>) {
    setActionLoading(body.user_id);
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      await fetchUsers();
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">🚨 Fraud Control Center</h1>
            <p className="text-gray-400 mt-1">
              {users.length} utilisateur{users.length !== 1 ? "s" : ""} à risque
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            ↻ Rafraîchir
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            ✅ Aucun utilisateur à risque détecté
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    User ID
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Risk
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Fraud Flag
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    Flags
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Credits
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Plan
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Banned
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Org
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => {
                  const isLoading = actionLoading === user.user_id;
                  const isBanned = user.profiles?.banned;
                  const riskColor =
                    user.risk_score >= 80
                      ? "text-red-400"
                      : user.risk_score >= 50
                        ? "text-orange-400"
                        : user.risk_score >= 20
                          ? "text-yellow-400"
                          : "text-green-400";

                  return (
                    <tr
                      key={user.user_id}
                      className={`hover:bg-gray-900/50 transition-colors ${
                        isBanned ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-300">
                        {user.user_id.slice(0, 8)}…
                      </td>
                      <td
                        className={`px-4 py-3 text-center font-bold ${riskColor}`}
                      >
                        {user.risk_score}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.fraud_flag ? (
                          <span className="px-2 py-0.5 bg-red-900/50 text-red-300 rounded text-xs">
                            FLAGGED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">
                            CLEAN
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px] truncate">
                        {user.flags?.length > 0 ? user.flags.join(", ") : "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {user.profiles?.credits ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">
                          {user.profiles?.plan ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isBanned ? (
                          <span className="text-red-400 text-xs font-bold">
                            BANNED
                          </span>
                        ) : (
                          <span className="text-green-400 text-xs">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-400">
                        {user.profiles?.organization_id
                          ? user.profiles.organization_id.slice(0, 8) + "…"
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {!isBanned && (
                          <button
                            disabled={isLoading}
                            onClick={() =>
                              adminAction("/api/admin/ban-user", {
                                user_id: user.user_id,
                              })
                            }
                            className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs rounded transition-colors"
                          >
                            Ban
                          </button>
                        )}
                        {user.fraud_flag && (
                          <button
                            disabled={isLoading}
                            onClick={() =>
                              adminAction("/api/admin/unflag-user", {
                                user_id: user.user_id,
                              })
                            }
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs rounded transition-colors"
                          >
                            Unflag
                          </button>
                        )}
                        <button
                          disabled={isLoading}
                          onClick={() =>
                            setRestoreUserId(
                              restoreUserId === user.user_id
                                ? null
                                : user.user_id,
                            )
                          }
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs rounded transition-colors"
                        >
                          Restore
                        </button>

                        {restoreUserId === user.user_id && (
                          <div className="inline-flex items-center gap-2 ml-2">
                            <input
                              type="number"
                              min={1}
                              value={restoreAmount}
                              onChange={(e) =>
                                setRestoreAmount(Number(e.target.value))
                              }
                              className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                            />
                            <button
                              disabled={isLoading}
                              onClick={() =>
                                adminAction("/api/admin/restore-credits", {
                                  user_id: user.user_id,
                                  amount: restoreAmount,
                                })
                              }
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs rounded transition-colors"
                            >
                              ✓
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
