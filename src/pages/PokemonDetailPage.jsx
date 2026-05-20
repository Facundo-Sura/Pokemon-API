import { useParams, Link } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import TypeBadge from '../components/TypeBadge';
import StatsChart from '../components/StatsChart';
import EvolutionChain from '../components/EvolutionChain';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function PokemonDetailPage() {
  const { id } = useParams();
  const { data, loading, error } = usePokemon(id);

  if (loading) return <LoadingSpinner text="Loading Pokémon data..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <ErrorMessage message="Pokémon not found." />;

  const pokemon = data;
  const species = data.species;
  const paddedId = String(pokemon.id).padStart(3, '0');
  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default;
  const shinySprite = pokemon.sprites?.other?.['official-artwork']?.front_shiny;
  const genus = species.genera?.find((g) => g.language.name === 'en')?.genus || '';
  const flavorText = species.flavor_text_entries
    ?.filter((f) => f.language.name === 'en')
    ?.slice(-1)[0]?.flavor_text
    ?.replace(/[\f\n\r]/g, ' ');

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null;

  return (
    <div>
      {/* Navigation between Pokémon */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {prevId ? (
          <Link to={`/pokemon/${prevId}`} className="btn btn-outline-secondary btn-sm">
            ← #{String(prevId).padStart(3, '0')}
          </Link>
        ) : (
          <div />
        )}
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Back to Pokédex
        </Link>
        {nextId ? (
          <Link to={`/pokemon/${nextId}`} className="btn btn-outline-secondary btn-sm">
            #{String(nextId).padStart(3, '0')} →
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Main card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="row g-0">
          {/* Sprite section */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center justify-content-center p-3" style={{ backgroundColor: 'var(--bg-secondary, #f8f9fa)' }}>
            <img
              src={sprite}
              alt={pokemon.name}
              className="img-fluid"
              style={{ maxHeight: '250px', objectFit: 'contain' }}
            />
            {shinySprite && (
              <div className="mt-2 text-center">
                <small className="text-muted">✨ Shiny</small>
                <img
                  src={shinySprite}
                  alt={`${pokemon.name} shiny`}
                  className="d-block mt-1"
                  style={{ maxHeight: '80px', margin: '0 auto' }}
                />
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="col-12 col-md-8 p-4">
            <div className="d-flex align-items-center gap-2 mb-1">
              <small className="text-muted fw-semibold">#{paddedId}</small>
              {genus && (
                <small className="text-muted">— {genus}</small>
              )}
            </div>
            <h2 className="fw-bold text-capitalize mb-2" style={{ color: 'var(--text-primary, #212529)' }}>
              {pokemon.name}
            </h2>

            <div className="d-flex flex-wrap gap-1 mb-3">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.slot} type={t.type.name} />
              ))}
            </div>

            {flavorText && (
              <p className="text-muted small mb-3" style={{ fontStyle: 'italic' }}>
                "{flavorText}"
              </p>
            )}

            <div className="row mb-3">
              <div className="col-4">
                <small className="text-muted d-block">Height</small>
                <strong>{(pokemon.height / 10).toFixed(1)} m</strong>
              </div>
              <div className="col-4">
                <small className="text-muted d-block">Weight</small>
                <strong>{(pokemon.weight / 10).toFixed(1)} kg</strong>
              </div>
              <div className="col-4">
                <small className="text-muted d-block">Base Exp</small>
                <strong>{pokemon.base_experience || '—'}</strong>
              </div>
            </div>

            {/* Abilities */}
            <div className="mb-3">
              <small className="text-muted d-block fw-semibold mb-1">Abilities</small>
              <div className="d-flex flex-wrap gap-2">
                {pokemon.abilities.map((a) => (
                  <span
                    key={a.ability.name}
                    className="badge bg-light text-dark border"
                    style={{ fontSize: '0.8rem', fontWeight: 'normal' }}
                  >
                    {a.ability.name.replace('-', ' ')}
                    {a.is_hidden && (
                      <small className="ms-1 text-muted">(hidden)</small>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <StatsChart stats={pokemon.stats} />

            {/* Evolution Chain */}
            {species.evolution_chain?.url && (
              <EvolutionChain evolutionChainUrl={species.evolution_chain.url} />
            )}
          </div>
        </div>
      </div>

      {/* Types section */}
      <div className="card shadow-sm border-0 p-3 mb-4">
        <h6 className="fw-bold mb-2">Type Defenses</h6>
        <p className="text-muted small mb-0">
          Damage relations table coming soon — requires loading type data for each of {pokemon.types.length} type(s).
        </p>
      </div>
    </div>
  );
}
