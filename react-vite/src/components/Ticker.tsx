const tickerItems = [
  '⚡ SONLI USULLAR',
  '//',
  '🔄 ITERATSIYA USULI',
  '//',
  '✂️ BISECTION METHOD',
  '//',
  '📈 GRAFIK ENGINE v3.0',
  '//',
  '🧮 GAUSS-SEYDEL USULI',
  '//',
  '🚗 HAYDASH USULI',
  '//',
  'QarDU · Amaliy Matematika · 2026',
  '//',
  '⚡ SONLI USULLAR v2.9.11',
  '//',
  '🔄 ITERATSIYA USULI',
  '//',
  '✂️ BISECTION METHOD',
  '//',
  '📈 GRAFIK ENGINE v3.0',
  '//',
  '🧮 GAUSS-SEYDEL USULI',
  '//',
  'QarDU · Amaliy Matematika · 023-40 guruh · 2026',
  '//',
];

export default function Ticker() {
  return (
    <div className="ticker-wrap mb-6">
      <div className="ticker-inner">
        {tickerItems.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
