const STAT_NAMES = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe',
};

const MAX_STAT = 255;

export default function StatsChart({ stats, compareStats = null }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="stats-chart">
      <h6 className="fw-bold mb-2">Base Stats</h6>
      {stats.map((s) => {
        const statName = s.stat.name;
        const label = STAT_NAMES[statName] || statName;
        const value = s.base_stat;
        const compareValue = compareStats
          ? compareStats.find((cs) => cs.stat.name === statName)?.base_stat || 0
          : null;
        const percentage = (value / MAX_STAT) * 100;
        const comparePercentage = compareValue ? (compareValue / MAX_STAT) * 100 : 0;

        return (
          <div key={statName} className="mb-1">
            <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
              <span className="fw-semibold" style={{ minWidth: '35px', color: 'var(--text-secondary, #6c757d)' }}>
                {label}
              </span>
              <span className="fw-bold">{value}</span>
            </div>
            <div className="progress" style={{ height: '8px', backgroundColor: 'var(--bg-secondary, #e9ecef)' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: value > 100 ? '#4CAF50' : value > 60 ? '#FFC107' : '#F44336',
                  transition: 'width 0.3s ease',
                }}
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={MAX_STAT}
              />
              {compareValue !== null && (
                <div
                  className="progress-bar bg-info"
                  role="progressbar"
                  style={{
                    width: `${comparePercentage}%`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    opacity: 0.6,
                  }}
                  aria-valuenow={compareValue}
                  aria-valuemin={0}
                  aria-valuemax={MAX_STAT}
                />
              )}
            </div>
          </div>
        );
      })}
      <small className="d-block mt-1 text-muted">
        Total:{' '}
        <strong>{stats.reduce((sum, s) => sum + s.base_stat, 0)}</strong>
        {compareStats && (
          <span className="ms-2">
            vs <strong>{compareStats.reduce((sum, s) => sum + s.base_stat, 0)}</strong>
          </span>
        )}
      </small>
    </div>
  );
}

export function StatsChartSimple({ stats }) {
  return <StatsChart stats={stats} />;
}
