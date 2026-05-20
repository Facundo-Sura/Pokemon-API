import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonList } from '../services/pokeapi';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allPokemon, setAllPokemon] = useState([]);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Load all Pokémon names once for client-side filtering
  useEffect(() => {
    async function loadAll() {
      try {
        const data = await getPokemonList(0, 1302);
        setAllPokemon(data.results);
      } catch {
        // fail silently — suggestions just won't show
      }
    }
    loadAll();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const q = query.toLowerCase();
      const matches = allPokemon
        .filter((p) => p.name.includes(q))
        .slice(0, 10);
      setSuggestions(matches);
      setShowDropdown(matches.length > 0);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, allPokemon]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    const isId = /^\d+$/.test(query.trim());
    const searchTerm = isId ? query.trim() : query.trim().toLowerCase();
    navigate(`/pokemon/${searchTerm}`);
    setQuery('');
    setShowDropdown(false);
  }

  function handleSelect(name) {
    navigate(`/pokemon/${name}`);
    setQuery('');
    setShowDropdown(false);
  }

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <div ref={wrapperRef} className="position-relative" style={{ maxWidth: '320px', width: '100%' }}>
      <form onSubmit={handleSubmit} className="d-flex" role="search">
        <div className="input-group input-group-sm">
          <input
            className="form-control"
            type="search"
            placeholder="Search Pokémon..."
            aria-label="Search"
            value={query}
            onChange={handleChange}
          />
          <button className="btn btn-outline-secondary" type="submit">
            🔍
          </button>
        </div>
      </form>
      {showDropdown && (
        <ul
          className="list-group position-absolute w-100 shadow-sm"
          style={{ zIndex: 1000, top: '100%', maxHeight: '300px', overflowY: 'auto' }}
        >
          {suggestions.map((p) => {
            const id = parseInt(p.url.split('/').slice(-2, -1)[0]);
            return (
              <button
                key={p.name}
                className="list-group-item list-group-item-action text-capitalize py-1 px-3"
                onClick={() => handleSelect(p.name)}
                type="button"
              >
                <small className="text-muted me-2">#{String(id).padStart(3, '0')}</small>
                {p.name}
              </button>
            );
          })}
        </ul>
      )}
    </div>
  );
}
