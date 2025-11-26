"use client";
import Link from "next/link";
import { useAdmin } from "@/hooks/useAdmin";

export default function Sidebar() {
  const { isAdmin, withAdmin } = useAdmin();
  return (
    <div className="w-64 bg-blue-700 text-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8">🏎️ Pinewood Derby {isAdmin && <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">ADMIN</span>}</h2>
      <nav className="flex flex-col space-y-4">
        <Link href={withAdmin("/")} className="hover:underline">🧭 Dashboard</Link>
        <Link href={withAdmin("/cars")} className="hover:underline">🚗 Cars</Link>
        <Link href={withAdmin("/racers")} className="hover:underline">🧑‍🎤 Racers</Link>
        <Link href={withAdmin("/races")} className="hover:underline">🏁 Races</Link>
        <Link href={withAdmin("/voting")} className="hover:underline">🗳️ Voting</Link>
        {isAdmin && (
          <Link href={withAdmin("/competition")} className="hover:underline">🏆 Competition</Link>
        )}
      </nav>
    </div>
  );
}
