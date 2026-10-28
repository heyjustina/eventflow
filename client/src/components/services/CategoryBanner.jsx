const LOOKS = {
  Venue: { bg: '#2b1b6b', accent: '#f5a524' },
  Catering: { bg: '#f4506e', accent: '#ffd27a' },
  Photography: { bg: '#14b8a6', accent: '#2b1b6b' },
  Entertainment: { bg: '#7c3aed', accent: '#f5a524' },
  'AV & Production': { bg: '#1e3a8a', accent: '#14b8a6' },
  Decor: { bg: '#ec4899', accent: '#ffe08a' },
  Staffing: { bg: '#475569', accent: '#f5a524' },
  Rentals: { bg: '#0f766e', accent: '#ffd27a' },
  Wellness: { bg: '#0e7490', accent: '#a7f3d0' },
};

function Art({ category, accent }) {
  const soft = 'rgba(255,255,255,0.25)';

  switch (category) {
    case 'Venue':
      return (
        <>
          {[70, 175, 280].map((x) => (
            <g key={x}>
              <rect x={x} y="55" width="50" height="70" fill={accent} />
              <circle cx={x + 25} cy="55" r="25" fill={accent} />
              <rect x={x + 15} y="75" width="20" height="50" fill={soft} />
            </g>
          ))}
        </>
      );
    case 'Catering':
      return (
        <>
          {[110, 200, 290].map((x) => (
            <g key={x}>
              <circle cx={x} cy="60" r="38" fill={accent} />
              <circle cx={x} cy="60" r="22" fill={soft} />
            </g>
          ))}
        </>
      );
    case 'Photography':
      return (
        <>
          <circle cx="200" cy="60" r="52" fill={accent} />
          <circle cx="200" cy="60" r="36" fill={soft} />
          <circle cx="200" cy="60" r="20" fill={accent} />
          <rect x="60" y="25" width="40" height="22" rx="4" fill={soft} />
          <circle cx="330" cy="30" r="8" fill={accent} />
        </>
      );
    case 'Entertainment':
      return (
        <>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const heights = [40, 75, 55, 95, 65, 85, 50, 70, 35];
            return (
              <rect key={i} x={90 + i * 27} y={115 - heights[i]} width="16" height={heights[i]} rx="3" fill={i % 2 ? accent : soft} />
            );
          })}
        </>
      );
    case 'AV & Production':
      return (
        <>
          {[28, 60, 92].map((y, i) => (
            <g key={y}>
              <rect x="80" y={y} width="240" height="6" rx="3" fill={soft} />
              <circle cx={140 + i * 70} cy={y + 3} r="11" fill={accent} />
            </g>
          ))}
        </>
      );
    case 'Decor':
      return (
        <>
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle key={angle} cx={200 + Math.cos(rad) * 28} cy={60 + Math.sin(rad) * 28} r="22" fill={accent} />
            );
          })}
          <circle cx="200" cy="60" r="14" fill={soft} />
        </>
      );
    case 'Staffing':
      return (
        <>
          {[110, 200, 290].map((x) => (
            <g key={x}>
              <circle cx={x} cy="42" r="16" fill={accent} />
              <rect x={x - 24} y="64" width="48" height="60" rx="22" fill={soft} />
            </g>
          ))}
        </>
      );
    case 'Rentals':
      return (
        <>
          {[90, 200, 310].map((x) => (
            <g key={x}>
              <rect x={x - 40} y="48" width="80" height="12" rx="4" fill={accent} />
              <rect x={x - 28} y="60" width="8" height="46" fill={soft} />
              <rect x={x + 20} y="60" width="8" height="46" fill={soft} />
            </g>
          ))}
        </>
      );
    case 'Wellness':
      return (
        <>
          {[90, 62, 34].map((r, i) => (
            <circle key={r} cx="200" cy="120" r={r} fill="none" stroke={i % 2 ? soft : accent} strokeWidth="10" />
          ))}
        </>
      );
    default:
      return <circle cx="200" cy="60" r="40" fill={accent} />;
  }
}

function CategoryBanner({ category }) {
  const look = LOOKS[category] || { bg: '#2b1b6b', accent: '#f5a524' };

  return (
    <div className="category-banner" aria-hidden="true">
      <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="120" fill={look.bg} />
        <Art category={category} accent={look.accent} />
      </svg>
    </div>
  );
}

export default CategoryBanner;