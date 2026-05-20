const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export default function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || '#999';
  return (
    <span
      className="badge me-1 text-white fw-normal"
      style={{
        backgroundColor: color,
        textTransform: 'capitalize',
        fontSize: '0.75rem',
        padding: '0.25em 0.6em',
      }}
    >
      {type}
    </span>
  );
}
