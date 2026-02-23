const badges = [
  {
    icon: '🔒',
    title: 'Pago seguro',
    desc: 'Procesado por Wompi / Bancolombia',
  },
  {
    icon: '🚚',
    title: 'Envío a todo Colombia',
    desc: 'Despachamos en 24-48 horas',
  },
  {
    icon: '✅',
    title: 'Calidad garantizada',
    desc: 'Productos verificados al 100%',
  },
  {
    icon: '🤝',
    title: 'Atención personalizada',
    desc: 'Soporte por WhatsApp directo',
  },
];

interface TrustBadgesProps {
  variant?: 'row' | 'grid';
}

export function TrustBadges({ variant = 'row' }: TrustBadgesProps) {
  const isGrid = variant === 'grid';

  return (
    <div
      className={[
        'w-full',
        isGrid
          ? 'grid grid-cols-2 gap-4 sm:grid-cols-4'
          : 'flex flex-wrap justify-center gap-4 sm:gap-8',
      ].join(' ')}
    >
      {badges.map((badge) => (
        <div
          key={badge.title}
          className={[
            'flex items-center gap-3',
            isGrid
              ? 'border-border bg-surface rounded-xl border p-4'
              : 'flex-col items-center text-center sm:flex-row sm:text-left',
          ].join(' ')}
        >
          <span className="shrink-0 text-3xl" aria-hidden>
            {badge.icon}
          </span>
          <div>
            <p className="text-text text-sm font-semibold">{badge.title}</p>
            <p className="text-text-muted text-xs">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
