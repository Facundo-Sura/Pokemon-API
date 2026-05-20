import { useState, useEffect } from 'react';
import { getTypeList } from '../services/pokeapi';
import TypeBadge from './TypeBadge';

export default function TypeFilter({ selectedType, onSelect }) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    getTypeList()
      .then((data) => {
        // Filter out "unknown" and "shadow" types, keep only the 18 real types
        const valid = data.results.filter(
          (t) => t.name !== 'unknown' && t.name !== 'shadow'
        );
        setTypes(valid);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mb-3">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <span className="fw-semibold me-1" style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #6c757d)' }}>
          Filter by type:
        </span>
        {selectedType && (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onSelect(null)}
          >
            ✕ Clear
          </button>
        )}
      </div>
      <div className="d-flex flex-wrap gap-1 mt-1">
        {types.map((t) => (
          <button
            key={t.name}
            className={`btn btn-sm ${selectedType === t.name ? 'active' : ''}`}
            onClick={() => onSelect(selectedType === t.name ? null : t.name)}
            style={{
              padding: 0,
              border: selectedType === t.name ? '2px solid var(--accent, #ffcb05)' : '2px solid transparent',
              borderRadius: '4px',
              background: 'none',
            }}
          >
            <div style={{ transform: 'scale(1.1)' }}>
              <TypeBadge type={t.name} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
