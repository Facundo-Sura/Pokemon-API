import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav
      className="navbar navbar-expand-lg mb-3"
      style={{
        backgroundColor: 'var(--bg-secondary, #f8f9fa)',
        borderBottom: '2px solid var(--accent, #ffcb05)',
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
          style={{ color: 'var(--text-primary, #212529)' }}
        >
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <span>PokéWeb</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active fw-semibold' : ''}`}
                to="/"
                style={{ color: 'var(--text-primary, #212529)' }}
              >
                Pokédex
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/compare' ? 'active fw-semibold' : ''}`}
                to="/compare"
                style={{ color: 'var(--text-primary, #212529)' }}
              >
                Compare
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <SearchBar />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
