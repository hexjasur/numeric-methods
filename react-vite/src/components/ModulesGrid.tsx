export interface Module {
  href: string;
  badge: string;
  title: string;
  desc: string;
  linkText: string;
}

export const modules: Module[] = [
  { href: '#', badge: '01 / ANIQLIK', title: "FUNKSIYA KESISHISH NUQTA", desc: "Grafik usulda kesishish nuqtalarini aniqlash. Zoom & Pan qo'llab-quvvatlash.", linkText: 'BATAFSIL →' },
  { href: '#', badge: '02 / USUL', title: "KESMANI TENG IKKIGA BO'LISH", desc: "Ildiz joylashgan oraliqni har safar teng ikkiga bo'lish orqali aniqlikni oshirish.", linkText: 'BATAFSIL →' },
  { href: '#', badge: '03 / USUL', title: 'ITERATSIYA USULI', desc: 'Takroriy jarayon orqali ildizni topish. M konstantasi va yaqinlashish sharti.', linkText: 'BATAFSIL →' },
  { href: '#', badge: '04 / USUL', title: 'ODDIY ITERATSIYA USULI', desc: 'Takroriy jarayon orqali ildizni topish. M konstantasi va yaqinlashish sharti.', linkText: 'BATAFSIL →' },
  { href: '#', badge: '05 / USUL', title: 'VATAR USULI', desc: "Funksiya grafigidagi ikki nuqtadan o'tuvchi vatar orqali ildizni yaqinlashtirish (Secant Method).", linkText: 'BATAFSIL →' },
  { href: '#', badge: '06 / USUL', title: 'URINMA USULI', desc: "Nyuton usuli: Funksiya hosilasi yordamida urinmalar o'tkazib ildizni topish.", linkText: 'BATAFSIL →' },
  { href: '#', badge: '07 / USUL', title: 'ODDIY NYUTON USULI', desc: "Nyuton usuli: Funksiya hosilasi yordamida urinmalar o'tkazib ildizni topish.", linkText: 'BATAFSIL →' },
  { href: '#', badge: '08 / USUL', title: 'ZEYDEL USULI', desc: "Chiziqli tenglamalar sistemasini (SLAU) iterativ yechish usuli.", linkText: 'BATAFSIL →' },
  { href: '#', badge: '09 / ANIQLIK', title: 'HAYDASH USULI', desc: 'Tridiagonal chiziqli tenglamalar sistemasini ketma-ket hisoblash orqali yechish usuli.', linkText: 'BATAFSIL →' },
  { href: '#', badge: '10 / USUL', title: 'KRYLOV USULI', desc: "Matritsa-vektor usuli: Matritsaning o'zi bilan emas, balki uning matritsa-vektor ko'paytmasi bilan ishlashga asoslangan iterativ usul.", linkText: 'BATAFSIL →' },
  { href: '#', badge: '11 / USUL', title: "NO-CHIZIQLI ITERATSIYA USULI", desc: "No-chiziqli tenglamalar sistemasi uchun iteratsiya usuli.", linkText: "KO'RISH →" },
  { href: '#', badge: '12 / USUL', title: "CHIZIQLI ITERATSIYA USULI", desc: "No Chiziqli tenglamalar sistemasi uchun iteratsiya usuli. M1 M2", linkText: "KO'RISH →" },
  { href: '#', badge: '13 / USUL', title: "LAGRANJ INTERPOLATSIYASI USULI", desc: "Lagranj Interpolatsion ko'phadi", linkText: "KO'RISH →" },
  { href: '#', badge: '14 / USUL', title: "NYUTON INTERPOLATSIYA USULI", desc: "Nyuton Interpolatsion ko'phadi", linkText: "KO'RISH →" },
  { href: '#', badge: '15 / USUL', title: "KVADRATIK SPLINE INTERPOLYATSIYASI USULI", desc: "Kvadratik Spline Interpolatsiya usuli", linkText: "KO'RISH →" },
  { href: '#', badge: '16 / USUL', title: "TOG'RI TO'RTBURCHAK USULI", desc: '', linkText: "KO'RISH →" },
  { href: '#', badge: '17 / USUL', title: "TRAPETSIYA USULI", desc: '', linkText: "KO'RISH →" },
  { href: '#', badge: '18 / USUL', title: "SIMPSON USULI", desc: "Integralni Simpson formulasi yordamida taqribiy hisoblash usuli.", linkText: "KO'RISH →" },
  { href: '#', badge: 'ℹ️ / NAZARIYA', title: "NAZARIYA", desc: "Sonli usullar faniga oid nazariy materiallar.", linkText: "KO'RISH →" },
];

interface ModulesGridProps {
  onCountChange?: (count: number) => void;
}

export default function ModulesGrid(_props: ModulesGridProps) {
  return (
    <section>
      <h2
        className="text-xl font-black mb-6 tracking-wider"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        📦 MODULLAR
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {modules.map((mod) => (
          <a key={mod.badge} href={mod.href} className="module-card">
            <div className="badge">{mod.badge}</div>
            <h4
              className="mb-2 text-lg font-black"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {mod.title}
            </h4>
            {mod.desc && <p className="text-sm text-gray-600">{mod.desc}</p>}
            <div className="mt-4 text-xs font-bold text-cyan-600">{mod.linkText}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
