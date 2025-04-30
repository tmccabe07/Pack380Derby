import Link from "next/link";

interface DashboardCardProps {
  title: string;
  count: number;
  href: string;
}

export default function DashboardCard({ title, count, href }: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-4">{count}</p>
      <Link href={href} className="text-blue-600 hover:underline">
        View {title}
      </Link>
    </div>
  );
}
