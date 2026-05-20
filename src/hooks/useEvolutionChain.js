import { useState, useEffect } from 'react';
import { getEvolutionChain } from '../services/pokeapi';

export function useEvolutionChain(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const chain = await getEvolutionChain(url);
        if (!cancelled) setData(chain);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

/**
 * Flatten the recursive ChainLink into an array of stages.
 * Each stage is an array of species at the same evolution level.
 */
export function flattenEvolutionChain(chainData) {
  if (!chainData || !chainData.chain) return [];

  const stages = [];

  function traverse(link, depth) {
    if (!stages[depth]) stages[depth] = [];
    const speciesName = link.species.name;
    const speciesUrl = link.species.url;
    const speciesId = parseInt(speciesUrl.split('/').slice(-2, -1)[0]);
    stages[depth].push({
      name: speciesName,
      id: speciesId,
      details: link.evolution_details || [],
    });

    if (link.evolves_to && link.evolves_to.length > 0) {
      link.evolves_to.forEach((next) => traverse(next, depth + 1));
    }
  }

  traverse(chainData.chain, 0);
  return stages;
}
