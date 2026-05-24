const techs = [
  { label: 'HTML5', bg: 'bg-black text-white border-black' },
  { label: 'CSS3', bg: 'bg-cyan-100 text-black border-black' },
  { label: 'JavaScript', bg: 'bg-yellow-100 text-black border-black' },
  { label: 'Tailwind CSS', bg: 'bg-blue-100 text-black border-black' },
  { label: 'React', bg: 'bg-sky-100 text-black border-black' },
  { label: 'Vite', bg: 'bg-purple-100 text-black border-black' },
  { label: 'KaTeX', bg: 'bg-purple-100 text-black border-black' },
  { label: 'Math.js', bg: 'bg-green-100 text-black border-black' },
  { label: 'Canvas API', bg: 'bg-orange-100 text-black border-black' },
  { label: 'Orbitron Font', customStyle: { background: '#00f2ff', border: '1px solid #000' } },
  { label: 'JetBrains Mono', customStyle: { background: '#ff00ea', color: 'white', border: '1px solid #000' } },
];

export default function TechStack() {
  return (
    <div className="p-5 cyber-card mb-12">
      <h3
        className="font-black mb-3 text-sm tracking-wider"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        🔧 TEXNOLOGIYALAR
      </h3>
      <div className="flex flex-wrap gap-2">
        {techs.map((tech) =>
          tech.customStyle ? (
            <span
              key={tech.label}
              className="px-3 py-1 text-xs font-bold"
              style={tech.customStyle}
            >
              {tech.label}
            </span>
          ) : (
            <span
              key={tech.label}
              className={`px-3 py-1 text-xs font-bold border ${tech.bg}`}
            >
              {tech.label}
            </span>
          )
        )}
      </div>
    </div>
  );
}
