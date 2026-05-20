import { Link } from 'react-router-dom';
import TypeBadge from './TypeBadge';

export default function PokemonCard({ pokemon }) {
  const id = pokemon.id;
  const paddedId = String(id).padStart(3, '0');
  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    'https://via.placeholder.com/150?text=No+Image';

  return (
    <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3">
      <Link to={`/pokemon/${id}`} className="text-decoration-none">
        <div className="card h-100 shadow-sm border-0 text-center pokemon-card">
          <div className="card-img-top p-2 d-flex align-items-center justify-content-center" style={{ minHeight: '120px', backgroundColor: 'var(--card-bg, #f8f9fa)' }}>
            <img
              src={sprite}
              alt={pokemon.name}
              className="img-fluid"
              style={{ maxHeight: '96px', objectFit: 'contain' }}
              loading="lazy"
            />
          </div>
          <div className="card-body p-2">
            <small className="text-muted">#{paddedId}</small>
            <h6 className="card-title text-capitalize mb-1" style={{ fontSize: '0.85rem', color: 'var(--text-primary, #212529)' }}>
              {pokemon.name}
            </h6>
            <div className="d-flex flex-wrap justify-content-center gap-1 mt-1">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.slot} type={t.type.name} />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
