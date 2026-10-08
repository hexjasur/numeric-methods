"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Menu, Sigma, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/methods/bisection", label: "Bisection Method", icon: Sigma },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span>[</span><b>∑</b><span>]</span></span>;
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", mobileOpen);
    return () => document.body.classList.remove("nav-open");
  }, [mobileOpen]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`} aria-label="Asosiy navigatsiya">
        <div className="sidebar-head">
          <Link href="/" className="brand" aria-label="Numeric Methods bosh sahifasi">
            <BrandMark />
            <span><strong>NUMERIC</strong><small>METHODS / 3.0</small></span>
          </Link>
          <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Menyuni yopish"><X size={18} /></button>
        </div>
        <div className="nav-section-label">LABORATORIYA</div>
        <nav className="nav-list">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
              <span className="nav-icon"><item.icon size={18} strokeWidth={active ? 2.5 : 2} /></span><span>{item.label}</span>
            </Link>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="status-card"><span className="status-dot" /><div><strong>Hisoblash muhiti</strong><small>Math.js + KaTeX tayyor</small></div></div>
          <p className="sidebar-note">Sonli masalalarni bosqichma-bosqich yeching.</p>
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="Menyuni yopish" />}
      <div className="main-frame">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Menyuni ochish"><Menu size={18} /></button>
          <div className="breadcrumb"><span>Numeric Methods</span><b>/</b><strong>{pathname === "/" ? "Dashboard" : "Bisection Method"}</strong></div>
          <div className="topbar-actions"><span className="topbar-status"><i /> Online</span><ThemeToggle /></div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
