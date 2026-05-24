interface InfoCardsProps {
  onMenuClick: () => void;
}

export default function InfoCards({ onMenuClick }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 mb-10 lg:grid-cols-3">
      {/* Loyiha card */}
      <div className="p-6 cyber-card">
        <h3
          className="flex items-center mb-4 font-black border-b-2 border-black"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          <span className="mr-2">⚡</span> LOYIHA
        </h3>
        <div className="space-y-2 text-sm font-bold">
          <p className="flex justify-between">
            <span>Maqsad:</span>
            <span className="text-cyan-600">Sonli Usullarni o&apos;rganish</span>
          </p>
          <p className="flex justify-between">
            <span>Yaratuvchi:</span>
            <span style={{ color: '#ff00ea' }}>Haydarov Jasurbek</span>
          </p>
          <p className="flex justify-between">
            <span>Guruh:</span>
            <span className="text-cyan-600">023-40</span>
          </p>
          <p className="flex justify-between">
            <span>Yil:</span>
            <span style={{ color: '#ff00ea' }}>2026</span>
          </p>
        </div>
      </div>

      {/* Boshqaruv paneli card */}
      <div className="p-6 cyber-card lg:col-span-2">
        <h3
          className="flex items-center mb-4 font-black border-b-2 border-black"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          <span className="mr-2">👤</span> BOSHQARUV PANELI
        </h3>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-black text-black">JASURBEK HAYDAROV</p>
            <p className="text-sm font-bold text-gray-500">
              Sonli usullar faniga qo&apos;shgan hissasi
            </p>
            <p className="max-w-md mt-3 text-xs leading-relaxed">
              Ushbu loyiha QarDU talabasi tomonidan sonli usullar fanini o&apos;rganish va amaliyot
              qilish maqsadida yaratildi. Har bir usul alohida HTML faylda bajarilgan va interaktiv
              hisoblash imkoniyati mavjud.
            </p>
          </div>
          <button onClick={onMenuClick} className="cyber-button px-12 py-4 text-lg font-black">
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
