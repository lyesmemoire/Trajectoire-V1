import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E5E7EB] font-sans text-sm">
      <div className="max-w-6xl mx-auto p-8">
        <header className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-8">
          <div>
            <h1 className="font-serif text-xl tracking-wide text-[#E5E7EB]">TRAJECTOIRE // COCKPIT</h1>
            <p className="font-mono text-[#9CA3AF] text-xs mt-1 uppercase tracking-widest">Strategic Engine Control Panel</p>
          </div>
          <nav className="flex space-x-8 font-mono text-xs uppercase tracking-widest text-[#9CA3AF]">
            <Link href="/admin/system" className="hover:text-white transition-none border-b border-transparent hover:border-[#4F46E5] pb-1">System</Link>
            <Link href="/admin/engine" className="hover:text-white transition-none border-b border-transparent hover:border-[#4F46E5] pb-1">Engine</Link>
            <Link href="/admin/usage" className="hover:text-white transition-none border-b border-transparent hover:border-[#4F46E5] pb-1">Usage</Link>
            <Link href="/admin/users" className="hover:text-white transition-none border-b border-transparent hover:border-[#4F46E5] pb-1">Users</Link>
            <Link href="/admin/config" className="hover:text-white transition-none border-b border-transparent hover:border-[#4F46E5] pb-1">Config</Link>
          </nav>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
