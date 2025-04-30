import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-700 text-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8">🏎️ Pinewood Derby</h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/" className="hover:underline">Dashboard</Link>
        <Link href="/cars" className="hover:underline">Cars</Link>
        <Link href="/racers" className="hover:underline">Racers</Link>
        <Link href="/heats" className="hover:underline">Heats</Link>
      </nav>
    </div>
  );
}
