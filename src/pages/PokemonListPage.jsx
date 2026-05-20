import { useState, useCallback } from 'react';
import { usePokemonList } from '../hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import TypeFilter from '../components/TypeFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';

const PAGE_SIZE = 20;

export default function PokemonListPage() {
  const [offset, setOffset] = useState(0);
  const [filterType, setFilterType] = useState(null);
  const { data, loading, error, total } = usePokemonList(offset, PAGE_SIZE, filterType);

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleNext = useCallback(() => {
    setOffset((prev) => Math.min(prev + PAGE_SIZE, (totalPages - 1) * PAGE_SIZE));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setOffset((prev) => Math.max(prev - PAGE_SIZE, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTypeSelect = useCallback((type) => {
    setFilterType(type);
    setOffset(0);
  }, []);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
        <h4 className="fw-bold mb-0" style={{ color: 'var(--text-primary, #212529)' }}>
          Pokédex
          <small className="text-muted fw-normal ms-2" style={{ fontSize: '0.85rem' }}>
            {total} Pokémon
          </small>
        </h4>
      </div>

      <TypeFilter selectedType={filterType} onSelect={handleTypeSelect} />

      {loading && <LoadingSpinner text="Catching Pokémon..." />}
      {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}

      {!loading && !error && (
        <>
          {data.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No Pokémon found.</p>
            </div>
          ) : (
            <div className="row g-2">
              {data.map((p) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>
          )}

          <nav className="d-flex justify-content-center mt-4" aria-label="Pagination">
            <ul className="pagination pagination-sm">
              <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handlePrev} disabled={currentPage <= 1}>
                  ← Prev
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">
                  {currentPage} / {totalPages}
                </span>
              </li>
              <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handleNext} disabled={currentPage >= totalPages}>
                  Next →
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
