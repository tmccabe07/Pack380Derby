"use client";

import Link from "next/link";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";

export default function Sidebar() {
  const { isAdmin, withAdmin } = useAdmin();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-blue-700 text-white shadow-lg"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-blue-700 text-white flex flex-col p-6 z-40 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex`}
        style={{ boxShadow: open ? "2px 0 8px rgba(0,0,0,0.1)" : undefined }}
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 rounded bg-blue-800 text-white"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h2 className="text-2xl font-bold mb-8 mt-8 md:mt-0">🏎️ Pinewood Derby {isAdmin && <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">ADMIN</span>}</h2>
        <nav className="flex flex-col space-y-4">
          <Link href={withAdmin("/")} className="hover:underline">🧭 Dashboard</Link>
          <Link href={withAdmin("/cars")} className="hover:underline">🚗 Cars</Link>
          <Link href={withAdmin("/racers")} className="hover:underline">🧑‍🎤 Racers</Link>
          <Link href={withAdmin("/races")} className="hover:underline">🏁 Races</Link>
          <Link href={withAdmin("/voting")} className="hover:underline">🗳️ Voting</Link>
          <Link href={withAdmin("/results")} className="hover:underline">🏆 Results</Link>
          {isAdmin && (
            <Link href={withAdmin("/competition")} className="hover:underline">⚙️ Competition</Link>
          )}
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
}
