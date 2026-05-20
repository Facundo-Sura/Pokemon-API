import { useState } from 'react';
import { usePokemon } from '../hooks/usePokemon';
import CompareSelector from '../components/CompareSelector';
import TypeBadge from '../components/TypeBadge';
import StatsChart from '../components/StatsChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function PokemonComparePanel({ pokemonId }) {
  const { data, loading, error } = usePokemon(pokemonId);

  if (!pokemonId) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted" style={{ minHeight: '300px' }}>
        Select a Pokémon
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const pokemon = data;
  const paddedId = String(pokemon.id).padStart(3, '0');
  const sprite = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body text-center">
        <img
          src={sprite}
          alt={pokemon.name}
          className="img-fluid mb-2"
          style={{ maxHeight: '150px', objectFit: 'contain' }}
        />
        <h5 className="text-capitalize fw-bold mb-0">{pokemon.name}</h5>
        <small className="text-muted">#{paddedId}</small>

        <div className="d-flex flex-wrap justify-content-center gap-1 my-2">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.slot} type={t.type.name} />
          ))}
        </div>

        <div className="row small mb-2">
          <div className="col-6">
            <span className="text-muted">Height:</span> {(pokemon.height / 10).toFixed(1)} m
          </div>
          <div className="col-6">
            <span className="text-muted">Weight:</span> {(pokemon.weight / 10).toFixed(1)} kg
          </div>
        </div>

        <div className="mb-2">
          {pokemon.abilities.map((a) => (
            <span
              key={a.ability.name}
              className="badge bg-light text-dark border me-1 mb-1"
              style={{ fontSize: '0.75rem', fontWeight: 'normal' }}
            >
              {a.ability.name.replace('-', ' ')}
              {a.is_hidden && ' (hidden)'}
            </span>
          ))}
        </div>

        <StatsChart stats={pokemon.stats} />

        <div className="mt-2">
          <small className="text-muted">
            Base Stat Total:{' '}
            <strong>{pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}</strong>
          </small>
        </div>
      </div>
    </div>
  );
}

export default function PokemonComparePage() {
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);

  return (
    <div>
      <h4 className="fw-bold mb-3" style={{ color: 'var(--text-primary, #212529)' }}>
        Compare Pokémon
      </h4>

      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          <CompareSelector
            selectedPokemon={pokemon1}
            onSelect={setPokemon1}
            placeholder="First Pokémon..."
          />
        </div>
        <div className="col-12 col-md-6">
          <CompareSelector
            selectedPokemon={pokemon2}
            onSelect={setPokemon2}
            placeholder="Second Pokémon..."
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <PokemonComparePanel pokemonId={pokemon1} />
        </div>
        <div className="col-12 col-md-6">
          <PokemonComparePanel pokemonId={pokemon2} />
        </div>
      </div>
    </div>
  );
}
