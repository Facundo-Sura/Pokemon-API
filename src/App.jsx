import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PokemonListPage from './pages/PokemonListPage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import PokemonComparePage from './pages/PokemonComparePage';

function AppContent() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-primary, #fff)' }}>
        <Navbar />
        <main className="container flex-grow-1 pb-4">
          <Routes>
            <Route path="/" element={<PokemonListPage />} />
            <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
            <Route path="/compare" element={<PokemonComparePage />} />
          </Routes>
        </main>
        <footer
          className="text-center py-3 small"
          style={{
            color: 'var(--text-secondary, #6c757d)',
            borderTop: '1px solid var(--card-border, #dee2e6)',
            backgroundColor: 'var(--bg-secondary, #f8f9fa)',
          }}
        >
          Powered by{' '}
          <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
            PokéAPI
          </a>{' '}
          &middot; PokéWeb © {new Date().getFullYear()}
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
