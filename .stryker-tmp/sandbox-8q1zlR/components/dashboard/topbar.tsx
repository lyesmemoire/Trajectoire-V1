// @ts-nocheck
"use client";

import * as React from "react";
import { Bell, Search, Settings, ChevronDown } from "lucide-react";

export function Topbar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notificationCount] = React.useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200/60 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 transition-all duration-200 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 group">
          <Bell className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 group">
          <Settings className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 pl-4 border-l border-gray-200/60 hover:bg-gray-50 rounded-lg pr-3 py-2 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-sm shadow-sm group-hover:shadow-md transition-shadow duration-200">
              JD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">Jean Dupont</p>
              <p className="text-xs text-gray-500">Plan Pro</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 hidden md:block" />
          </button>

          {/* User dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Mon profil
              </a>
              <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Paramètres
              </a>
              <hr className="my-2 border-gray-200" />
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
