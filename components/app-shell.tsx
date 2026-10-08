'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, LayoutDashboard, Menu, Sigma, X } from 'lucide-react';
import logo from '@/public/logo.png';
import { ThemeToggle } from '@/components/theme-toggle';

/* ──────────────────────────────────────────────────────────────
   APP SHELL  ·  single-file layout
   Dizayn: "Print Stream" — bisection-method.tsx bilan bir xil tizim.
   Dark/Light: tizim rejimi yoki <html class="dark|light"> /
   data-theme="dark|light". Tailwind tokenlariga bog'liq emas.
   ────────────────────────────────────────────────────────────── */

const navigation = [
  { href: '/', label: 'Dashboard', code: '00', icon: LayoutDashboard },
  {
    href: '/methods/bisection',
    label: 'Bisection Method',
    code: '01',
    icon: Sigma,
  },
  {
    href: '/methods/euler',
    label: 'Euler Methods',
    code: '02',
    icon: Activity,
  },
];

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const pageTitle =
    pathname === '/'
      ? 'Dashboard'
      : pathname.startsWith('/methods/euler')
        ? 'Euler Methods'
        : 'Bisection Method';

  return (
    <div className="as">
      <style>{CSS}</style>

      {/* ───────── SIDEBAR ───────── */}
      <aside
        className={`as-side ${mobileOpen ? 'is-open' : ''}`}
        aria-label="Asosiy navigatsiya"
      >
        <div className="as-side-top">
          <Link
            href="/"
            className="as-brand"
            aria-label="Numeric Methods bosh sahifasi"
          >
            <span className="as-logo">
              <Image src={logo} width={40} height={40} alt="Numeric Methods" />
            </span>
            <span className="as-brand-txt">
              <strong>NUMERIC</strong>
              <small>METHODS / 3.0</small>
            </span>
          </Link>
          <button
            className="as-icon-btn as-only-mobile"
            onClick={() => setMobileOpen(false)}
            aria-label="Menyuni yopish"
          >
            <X size={20} />
          </button>
        </div>

        <div className="as-section">
          <span>Laboratoriya</span>
          <i aria-hidden />
        </div>

        <nav className="as-nav">
          {navigation.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`as-link ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon size={20} strokeWidth={active ? 2.4 : 2} />
                <span className="as-link-label">{item.label}</span>
                <em>{item.code}</em>
              </Link>
            );
          })}
        </nav>

        <div className="as-side-bottom">
          <div className="as-status">
            <span className="as-dot" />
            <div>
              <strong>Hisoblash muhiti</strong>
              <small>Math.js + KaTeX</small>
            </div>
          </div>
          <div className="as-serial" aria-hidden>
            <span>SN-3.0</span>
            <i />
            <span>MK-1</span>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="as-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Menyuni yopish"
        />
      )}

      {/* ───────── CONTENT ───────── */}
      <div className="as-body">
        <header className="as-head">
          <div className="as-head-left">
            <button
              className="as-icon-btn as-only-mobile"
              onClick={() => setMobileOpen(true)}
              aria-label="Menyuni ochish"
            >
              <Menu size={20} />
            </button>
            <div className="as-crumbs">
              <span className="as-crumb-root">Numeric Methods</span>
              <b className="as-crumb-sep">/</b>
              <strong>{pageTitle}</strong>
            </div>
          </div>

          <div className="as-head-right">
            {/* <span className="as-online">
              <i className="as-dot" /> Online
            </span> */}
            <ThemeToggle />
          </div>
        </header>

        <main className="as-main">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;

/* ───────────────────────── STYLES ───────────────────────── */
const DARK_VARS = `
  --bg:#0a0b0d; --bg-2:#0f1114; --panel:#14161a; --panel-2:#1a1d22;
  --ink:#eef0f2; --ink-2:#c3c8cf; --muted:#8d949d;
  --line:#272b32; --line-2:#363b44;
  --cyan:#22d3ee; --cyan-soft:rgba(34,211,238,.1);
  --brand:#ff6a2b; --brand-ink:#0a0b0d; --brand-soft:rgba(255,106,43,.12);
  --ok:#34d399;
  --shadow:0 1px 0 rgba(255,255,255,.04) inset, 0 20px 40px -24px rgba(0,0,0,.8);
  --stripe: repeating-linear-gradient(135deg, transparent 0 7px, rgba(255,255,255,.035) 7px 8px);
  --page-glow: radial-gradient(900px 400px at 85% -10%, rgba(34,211,238,.08), transparent 60%);
  --head-bg: rgba(10,11,13,.82);
`;

const CSS = `
.as{
  --bg:#eceef0; --bg-2:#f6f7f8; --panel:#fbfbfc; --panel-2:#f1f2f4;
  --ink:#0d0f12; --ink-2:#2a2e35; --muted:#5d646e;
  --line:#d5d9de; --line-2:#b9bfc7;
  --cyan:#0891b2; --cyan-soft:rgba(8,145,178,.09);
  --brand:#e8480c; --brand-ink:#ffffff; --brand-soft:rgba(232,72,12,.09);
  --ok:#0f9d6b;
  --shadow:0 1px 0 #fff inset, 0 1px 2px rgba(13,15,18,.06), 0 18px 36px -26px rgba(13,15,18,.35);
  --stripe: repeating-linear-gradient(135deg, transparent 0 7px, rgba(13,15,18,.04) 7px 8px);
  --page-glow: radial-gradient(900px 400px at 85% -10%, rgba(8,145,178,.10), transparent 60%);
  --head-bg: rgba(236,238,240,.82);
  --mono: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
  --sans: ui-sans-serif, "Inter", "Geist", system-ui, -apple-system, "Segoe UI", sans-serif;
  --side-w: 272px;

  display:flex; min-height:100vh; color:var(--ink); font-family:var(--sans);
  background:var(--page-glow), var(--bg); font-size:15px; line-height:1.5;
}
:root.dark .as, [data-theme="dark"] .as { ${DARK_VARS} }
@media (prefers-color-scheme: dark){
  :root:not(.light):not([data-theme="light"]) .as { ${DARK_VARS} }
}
.as *{ box-sizing:border-box; }
.as a{ color:inherit; text-decoration:none; }
.as button{ font:inherit; color:inherit; }
.as a:focus-visible,.as button:focus-visible{ outline:3px solid var(--cyan); outline-offset:2px; }

/* ── sidebar ── */
.as-side{
  position:fixed; inset:0 auto 0 0; z-index:30; width:var(--side-w);
  display:flex; flex-direction:column; padding:26px 18px 18px;
  background:var(--panel); border-right:1px solid var(--line);
  transition:transform .22s ease; overflow:hidden;
}
.as-side::before{ content:""; position:absolute; top:0; left:0; width:54px; height:54px;
  background:linear-gradient(135deg,var(--ink) 0 50%,transparent 50%); pointer-events:none; }
.as-side::after{ content:""; position:absolute; right:0; bottom:0; width:100%; height:240px; background:var(--stripe); pointer-events:none;
  -webkit-mask:linear-gradient(0deg,#000,transparent); mask:linear-gradient(0deg,#000,transparent); }
.as-side > *{ position:relative; z-index:1; }

.as-side-top{ display:flex; align-items:center; justify-content:space-between; padding:6px 4px 30px 18px; }
.as-brand{ display:flex; align-items:center; gap:12px; }
.as-logo{ display:grid; place-items:center; width:46px; height:46px; border:1px solid var(--line-2); border-radius:10px; background:var(--bg-2); }
.as-logo img{ width:34px; height:34px; object-fit:contain; }
.as-brand-txt{ display:flex; flex-direction:column; line-height:1; }
.as-brand-txt strong{ font-size:15px; font-weight:700; letter-spacing:.16em; }
.as-brand-txt small{ margin-top:7px; font:600 11.5px var(--mono); letter-spacing:.08em; color:var(--muted); }

.as-section{ display:flex; align-items:center; gap:10px; padding:0 12px 12px; font:600 12px var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
.as-section i{ flex:1; height:1px; background:repeating-linear-gradient(90deg,var(--line-2) 0 4px,transparent 4px 8px); }

.as-nav{ display:grid; gap:6px; }
.as-link{
  position:relative; display:flex; align-items:center; gap:12px; min-height:48px; padding:0 14px;
  border:1px solid transparent; border-radius:9px; color:var(--muted);
  font-size:15px; font-weight:600; transition:background .15s, color .15s, border-color .15s, transform .15s;
}
.as-link-label{ flex:1; }
.as-link em{ font:600 12px var(--mono); font-style:normal; opacity:.6; }
.as-link:hover{ background:var(--bg-2); color:var(--ink); border-color:var(--line); transform:translateX(2px); }
.as-link.is-active{ background:var(--ink); color:var(--panel); border-color:var(--ink); font-weight:700; box-shadow:0 10px 22px -14px var(--ink); }
.as-link.is-active::before{ content:""; position:absolute; left:-18px; top:10px; bottom:10px; width:4px; border-radius:0 3px 3px 0; background:var(--brand); }
.as-link.is-active em{ color:var(--brand); opacity:1; }
.as-link.is-active svg{ color:var(--brand); }

.as-side-bottom{ margin-top:auto; display:grid; gap:14px; }
.as-status{ display:flex; align-items:center; gap:12px; padding:14px; border:1px solid var(--line); border-radius:9px; background:var(--bg-2); }
.as-status strong{ display:block; font-size:13.5px; }
.as-status small{ display:block; margin-top:3px; font:500 12px var(--mono); color:var(--muted); }
.as-dot{ display:inline-block; flex-shrink:0; width:9px; height:9px; border-radius:50%; background:var(--ok);
  box-shadow:0 0 0 4px color-mix(in srgb,var(--ok) 18%,transparent); animation:as-pulse 2.4s ease-in-out infinite; }
@keyframes as-pulse{ 50%{ box-shadow:0 0 0 7px color-mix(in srgb,var(--ok) 4%,transparent); } }
.as-serial{ display:flex; align-items:center; gap:10px; font:600 11.5px var(--mono); letter-spacing:.14em; color:var(--muted); }
.as-serial i{ flex:1; height:12px; opacity:.5;
  background:repeating-linear-gradient(90deg,var(--ink) 0 1px,transparent 1px 3px,var(--ink) 3px 5px,transparent 5px 6px,var(--ink) 6px 7px,transparent 7px 11px); }

/* ── body ── */
.as-body{ margin-left:var(--side-w); flex:1; min-width:0; width:calc(100% - var(--side-w)); display:flex; flex-direction:column; min-height:100vh; }
.as-head{
  position:sticky; top:0; z-index:20; display:flex; align-items:center; justify-content:space-between;
  height:76px; padding:0 clamp(22px,5vw,70px);
  background:var(--head-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid var(--line);
}
.as-head::after{ content:""; position:absolute; left:0; right:0; bottom:-1px; height:1px;
  background:linear-gradient(90deg,var(--brand) 0 64px,transparent 64px); }
.as-head-left,.as-head-right{ display:flex; align-items:center; gap:14px; }
.as-head-right{ gap:18px; }
.as-crumbs{ display:flex; align-items:center; gap:10px; font-size:14px; color:var(--muted); }
.as-crumbs strong{ color:var(--ink); font-weight:650; }
.as-crumb-sep{ color:var(--line-2); font-weight:400; }

.as-main{ width:100%; max-width:1420px; margin:0 auto; flex:1; padding:clamp(28px,5vw,68px) clamp(22px,5vw,70px); }

.as-icon-btn{ display:grid; place-items:center; width:42px; height:42px; cursor:pointer; border:1px solid var(--line-2); border-radius:9px;
  background:var(--panel); color:var(--ink); transition:all .15s; }
.as-icon-btn:hover{ border-color:var(--brand); color:var(--brand); background:var(--brand-soft); }
.as-only-mobile{ display:none; }
.as-backdrop{ position:fixed; inset:0; z-index:25; border:0; cursor:pointer; background:rgba(5,6,8,.55); backdrop-filter:blur(2px); }

/* ── responsive ── */
@media (max-width:900px){
  .as-side{ transform:translateX(-100%); box-shadow:var(--shadow); width:min(300px,86vw); }
  .as-side.is-open{ transform:translateX(0); }
  .as-body{ margin-left:0; width:100%; }
  .as-only-mobile{ display:grid; }
  .as-online{ display:none; }
}
@media (max-width:620px){
  .as-head{ height:66px; padding:0 16px; }
  .as-crumb-root,.as-crumb-sep{ display:none; }
  .as-main{ padding:24px 16px; }
}
@media (prefers-reduced-motion:reduce){ .as *{ animation:none !important; transition:none !important; } }
`;
