interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: '🏠', label: 'BOSH SAHIFA', href: '#', active: true },
  { icon: '📐', label: 'FUNKSIYA KESISHISH', href: '#funksiya' },
  { icon: '✂️', label: 'BISECTION USULI', href: '#bisection' },
  { icon: '🔄', label: 'ITERATSIYA USULI', href: '#iteratsiya' },
  { icon: '📈', label: 'VATAR USULI', href: '#vatar' },
  { icon: '🎯', label: 'URINMA USULI', href: '#urinma' },
  { icon: '🧮', label: 'ZEYDEL USULI', href: '#zeydel' },
  { icon: '🚗', label: 'HAYDASH USULI', href: '#haydash' },
  { icon: '🔢', label: 'KRYLOV USULI', href: '#krylov' },
  { icon: '📊', label: 'INTERPOLATSIYA', href: '#interpolatsiya' },
  { icon: '∫', label: 'INTEGRATSIYA', href: '#integral' },
  { icon: 'ℹ️', label: 'NAZARIYA', href: '#nazariya' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay fixed inset-0 bg-black/45 z-90 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div
          className="border-b-2 border-black px-5 py-5 bg-[#f8fafc] flex-shrink-0"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)',
          }}
        >
          <div className="text-[1.15rem] font-black tracking-[0.08em] text-[#0f172a]">
            SONLI USULLAR
          </div>
          <div className="mt-1 text-[0.68rem] font-[JetBrains_Mono,monospace] text-[#64748b] tracking-[0.05em]">
            QarDU · Amaliy Matematika · 2026
          </div>
        </div>

        {/* Nav */}
        <nav className="px-4 py-3 flex-1">
          <div className="text-[0.6rem] font-bold tracking-[0.18em] text-[#94a3b8] uppercase px-2 pb-2 pt-1">
            NAVIGATSIYA
          </div>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`sidebar-item ${item.active ? 'active' : ''}`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#e2e8f0] text-[0.62rem] text-[#94a3b8] tracking-[0.04em] flex-shrink-0">
          © 2026 Haydarov Jasurbek · QarDU
        </div>
      </aside>
    </>
  );
}
