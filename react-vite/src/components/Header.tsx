interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="cyber-header p-8 mb-10 text-center shadow-sm">
      <div>
        <img
          src="/logo-glass.png"
          alt="Sonli Usullar Logosi"
          className="mx-auto mb-4 w-24 h-24 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <h1
          className="text-4xl font-black tracking-widest text-black"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          SONLI USULLAR{' '}
          <span style={{ color: '#00f2ff' }}>v2.9.11</span>
        </h1>
      </div>
      <p className="mt-2 text-xs font-bold tracking-widest uppercase text-cyan-600">
        Qarshi Davlat Universiteti | Amaliy Matematika
      </p>

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="sidebar-toggle-btn lg:hidden fixed top-4 left-4 z-80 flex flex-col justify-center gap-[5px] w-11 h-11 bg-white border-2 border-black shadow-[3px_3px_0_#00f2ff] cursor-pointer p-2.5 transition-all hover:bg-[#00f2ff] hover:shadow-[4px_4px_0_#000]"
        aria-label="Menyuni ochish"
      >
        <span className="block h-0.5 bg-black rounded transition-all" />
        <span className="block h-0.5 bg-black rounded transition-all" />
        <span className="block h-0.5 bg-black rounded transition-all" />
      </button>
    </header>
  );
}
