"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Bell, Search, User, Settings } from "lucide-react";
import { Button } from "@/components/design-system";

export function Topbar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notificationCount] = React.useState(3);

  return (
    <header className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-text-secondary hover:text-text transition-colors">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-text-secondary hover:text-text transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            JD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-text">Jean Dupont</p>
            <p className="text-xs text-text-muted">Plan Pro</p>
          </div>
        </div>
      </div>
    </header>
  );
}
