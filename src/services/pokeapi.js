const BASE_URL = 'https://pokeapi.co/api/v2';

const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

async function fetchJson(url) {
  const cached = getCached(url);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokeAPI error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  setCache(url, data);
  return data;
}

export async function getPokemonList(offset = 0, limit = 20) {
  return fetchJson(`${BASE_URL}/pokemon/?offset=${offset}&limit=${limit}`);
}

export async function getPokemonById(id) {
  return fetchJson(`${BASE_URL}/pokemon/${id}/`);
}

export async function getPokemonByName(name) {
  return fetchJson(`${BASE_URL}/pokemon/${name.toLowerCase()}/`);
}

export async function getPokemonSpecies(id) {
  return fetchJson(`${BASE_URL}/pokemon-species/${id}/`);
}

export async function getEvolutionChain(url) {
  return fetchJson(url);
}

export async function getTypeList() {
  return fetchJson(`${BASE_URL}/type/?limit=100`);
}

export async function getTypeByName(name) {
  return fetchJson(`${BASE_URL}/type/${name}/`);
}

export async function getResource(url) {
  return fetchJson(url);
}

/**
 * Fetch multiple Pokémon in parallel, used for the list view.
 * @param {number[]} ids
 * @returns {Promise<Array>}
 */
export async function getPokemonBatch(ids) {
  const promises = ids.map((id) => getPokemonById(id));
  return Promise.all(promises);
}
