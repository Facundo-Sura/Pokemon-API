import { useState, useEffect } from 'react';
import {
  getPokemonById,
  getPokemonByName,
  getPokemonList,
  getPokemonSpecies,
  getPokemonBatch,
  getTypeByName,
} from '../services/pokeapi';

export function usePokemonList(offset, limit, filterType = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        if (filterType) {
          // Fetch ALL Pokémon of this type from the type endpoint
          const typeData = await getTypeByName(filterType);
          if (cancelled) return;

          // Extract ID + name from each type entry, filter out formes
          const allTypePokemon = typeData.pokemon
            .map((p) => {
              const id = parseInt(p.pokemon.url.split('/').slice(-2, -1)[0]);
              return { id, name: p.pokemon.name, url: p.pokemon.url };
            })
            // Keep only "default" forms (ids <= 1025 or no dash in name)
            .filter((p) => !p.name.includes('-') || p.id <= 1025);

          // Deduplicate by ID (some Pokémon appear twice with different slots)
          const seen = new Set();
          const unique = allTypePokemon.filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          });

          setTotal(unique.length);

          // Paginate the filtered list
          const page = unique.slice(offset, offset + limit);
          const batch = await getPokemonBatch(page.map((p) => p.id));
          if (cancelled) return;

          setData(batch);
        } else {
          // Normal paginated fetch — no filter
          const list = await getPokemonList(offset, limit);
          if (cancelled) return;

          const ids = list.results.map((r) => parseInt(r.url.split('/').slice(-2, -1)[0]));
          const batch = await getPokemonBatch(ids);
          if (cancelled) return;

          setData(batch);
          setTotal(list.count);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [offset, limit, filterType]);

  return { data, loading, error, total };
}

export function usePokemon(idOrName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    async function fetchData() {
      try {
        const isId = /^\d+$/.test(idOrName);
        const pokemon = isId
          ? await getPokemonById(parseInt(idOrName))
          : await getPokemonByName(idOrName);
        if (cancelled) return;

        const species = await getPokemonSpecies(pokemon.id);
        if (cancelled) return;

        setData({ ...pokemon, species });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (idOrName) fetchData();
    else setLoading(false);

    return () => { cancelled = true; };
  }, [idOrName]);

  return { data, loading, error };
}
