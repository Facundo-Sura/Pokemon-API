import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvolutionChain, flattenEvolutionChain } from '../hooks/useEvolutionChain';
import { getResource } from '../services/pokeapi';
import LoadingSpinner from './LoadingSpinner';

function EvolutionCondition({ details }) {
  if (!details || details.length === 0) return null;
  const d = details[0];
  const conditions = [];

  if (d.min_level) conditions.push(`Lv.${d.min_level}`);
  if (d.item) conditions.push(`Use ${d.item.name.replace('-', ' ')}`);
  if (d.trigger?.name === 'trade') conditions.push('Trade');
  if (d.trigger?.name === 'use-item') conditions.push('Use item');
  if (d.held_item) conditions.push(`Hold ${d.held_item.name.replace('-', ' ')}`);
  if (d.known_move) conditions.push(`Know ${d.known_move.name.replace('-', ' ')}`);
  if (d.min_happiness) conditions.push(`Happiness ≥${d.min_happiness}`);
  if (d.time_of_day === 'day') conditions.push('Daytime');
  if (d.time_of_day === 'night') conditions.push('Nighttime');
  if (d.gender === 1) conditions.push('♀ only');
  if (d.gender === 2) conditions.push('♂ only');
  if (d.location) conditions.push(`At ${d.location.name.replace('-', ' ')}`);

  return conditions.length > 0 ? (
    <small className="text-muted d-block" style={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
      {conditions.join(', ')}
    </small>
  ) : null;
}

function EvolutionSprite({ id, name }) {
  const [sprite, setSprite] = useState(null);

  useEffect(() => {
    getResource(`https://pokeapi.co/api/v2/pokemon/${id}/`)
      .then((p) => {
        setSprite(
          p.sprites?.other?.['official-artwork']?.front_default ||
            p.sprites?.front_default
        );
      })
      .catch(() => {});
  }, [id]);

  return sprite ? (
    <img src={sprite} alt={name} className="img-fluid" style={{ maxHeight: '80px' }} />
  ) : (
    <div style={{ width: '80px', height: '80px' }} className="d-flex align-items-center justify-content-center">
      <div className="spinner-grow spinner-grow-sm text-secondary" />
    </div>
  );
}

export default function EvolutionChain({ evolutionChainUrl }) {
  const { data, loading, error } = useEvolutionChain(evolutionChainUrl);

  if (loading) return <LoadingSpinner text="Loading evolution chain..." />;
  if (error) return <div className="text-danger small">Failed to load evolution chain.</div>;
  if (!data) return null;

  const stages = flattenEvolutionChain(data);

  if (stages.length <= 1) {
    return (
      <div className="mt-3">
        <h6 className="fw-bold mb-2">Evolution Chain</h6>
        <p className="text-muted small mb-0">This Pokémon does not evolve.</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h6 className="fw-bold mb-2">Evolution Chain</h6>
      <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
        {stages.map((stage, stageIdx) => (
          <div key={stageIdx} className="d-flex align-items-center flex-wrap">
            {stageIdx > 0 && (
              <div className="text-muted mx-2" style={{ fontSize: '1.5rem' }}>
                →
              </div>
            )}
            <div className="d-flex gap-2">
              {stage.map((species) => (
                <Link
                  key={species.id}
                  to={`/pokemon/${species.id}`}
                  className="text-decoration-none text-center"
                >
                  <div
                    className="card border-0 p-2 shadow-sm"
                    style={{
                      minWidth: '80px',
                      backgroundColor: 'var(--card-bg, #fff)',
                    }}
                  >
                    <EvolutionSprite id={species.id} name={species.name} />
                    <small className="text-capitalize fw-semibold d-block mt-1" style={{ fontSize: '0.75rem', color: 'var(--text-primary, #212529)' }}>
                      {species.name}
                    </small>
                    {species.details && <EvolutionCondition details={species.details} />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
