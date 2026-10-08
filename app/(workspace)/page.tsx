import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  ['01', 'Faol metod', 'Bisection Method', 'A'],
  ['02', 'Hisoblash turi', 'Interaktiv', 'B'],
  ['03', 'Formula engine', 'Math.js', 'C'],
];

export default function Home() {
  return (
    <div className="dashboard-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">SONLI USULLAR / LABORATORIYA</span>
          <h1>
            Matematikani <em>hisoblab</em>,<br />
            har qadamni tushuning.
          </h1>
          <p>
            Sonli usullarni nazariya bilan emas, real interaktiv hisoblash
            orqali o‘rganing.
          </p>
          <Link href="/methods/bisection" className="primary-button">
            Bisection Methodni ochish{' '}
            <span>
              <ArrowUpRight size={18} strokeWidth={2} />
            </span>
          </Link>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="formula-card">
            <span>f(x) = x³ + x − 1</span>
            <b>c = (a + b) / 2</b>
            <small>precision / 0.01</small>
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-symbol">∫</div>
        </div>
      </section>
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / OVERVIEW</span>
          <h2>Workspace holati</h2>
        </div>
        <span className="muted-label">LIVE ENVIRONMENT</span>
      </div>
      <section className="stats-grid">
        {stats.map(([number, label, value, mark]) => (
          <article className="stat-card" key={label}>
            <span className="stat-number">{number}</span>
            <span className="stat-mark">{mark}</span>
            <small>{label}</small>
            <strong>{value}</strong>
            <span className="stat-arrow">↗</span>
          </article>
        ))}
      </section>
      <section className="next-card">
        <div>
          <span className="eyebrow">KEYingi qadam</span>
          <h2>Birinchi usulni sinab ko‘ring</h2>
          <p>
            Funksiya, oraliq va aniqlikni kiriting. Tizim ildizga
            yaqinlashishning har bir qadamini ko‘rsatadi.
          </p>
        </div>
        <Link href="/methods/bisection" className="outline-button">
          Laboratoriyani boshlash <span>→</span>
        </Link>
      </section>
    </div>
  );
}
