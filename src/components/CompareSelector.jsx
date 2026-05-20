import { useState } from 'react';

export default function CompareSelector({ selectedPokemon, onSelect, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSelect(inputValue.trim().toLowerCase());
    setInputValue('');
  }

  function handleClear() {
    onSelect(null);
    setInputValue('');
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder={placeholder || 'Enter Pokémon name or ID...'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn btn-sm btn-outline-primary">
          +
        </button>
      </form>
      {selectedPokemon && (
        <div className="d-flex align-items-center gap-1">
          <span className="text-capitalize small fw-semibold">{selectedPokemon}</span>
          <button className="btn-close btn-close-sm" onClick={handleClear} aria-label="Clear" />
        </div>
      )}
    </div>
  );
}
