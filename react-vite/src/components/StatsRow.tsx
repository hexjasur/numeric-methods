interface StatItem {
  value: string;
  label: string;
}

interface StatsRowProps {
  moduleCount: number;
}

export default function StatsRow({ moduleCount }: StatsRowProps) {
  const stats: StatItem[] = [
    { value: String(moduleCount), label: 'Modullar' },
    { value: '∞', label: 'Hisoblar' },
    { value: '0.01', label: 'Aniqlik (ε)' },
    { value: '2026', label: 'Yil' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="hero-counter">{stat.value}</div>
          <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
