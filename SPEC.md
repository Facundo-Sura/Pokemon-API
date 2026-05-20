# PokéWeb — Especificación Técnica

## 1. Descripción General

Aplicación web SPA (Single Page Application) para explorar el mundo Pokémon usando la PokéAPI v2. Permite navegar, buscar, filtrar, detallar y comparar Pokémon con una interfaz responsive y dos modos de tema.

## 2. Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Bundler | Vite | 8.x |
| UI Library | React | 19.x |
| Estilos | Bootstrap 5 | 5.3.x |
| Routing | React Router DOM | 7.x |
| Runtime | Bun | 1.3.x |
| API | PokéAPI v2 | REST |
| Deploy | Vercel | — |

## 3. Arquitectura

### 3.1 Patrón

La app sigue un patrón **Container-Presentational** simplificado:

- **Pages** (containers): manejan estado, lógica y data fetching
- **Components** (presentational): reciben props y renderizan UI
- **Services**: capa de acceso a datos (API + caché)
- **Hooks**: encapsulan lógica de fetching reusable
- **Context**: estado global mínimo (tema)

### 3.2 Flujo de Datos

```
PokéAPI ──GET──→ pokeapi.js ──→ Custom Hooks ──→ Pages ──→ Components
                  (fetch +         (useState +              (render)
                   Map cache        useEffect)
                   TTL: 5min)
```

### 3.3 Árbol de Componentes

```
<ThemeProvider>
  <BrowserRouter>
    <Navbar>
      ├── <SearchBar />          ← Búsqueda con debounce + sugerencias
      └── <ThemeToggle />        ← Normal ↔ Pokémon Mode
    <Routes>
      "/" → <PokemonListPage>
        ├── <TypeFilter />       ← 18 tipos + clear
        ├── <PokemonCard /> ×N   ← Grid responsive
        └── Pagination
      "/pokemon/:id" → <PokemonDetailPage>
        ├── <TypeBadge /> ×N
        ├── <StatsChart />
        └── <EvolutionChain />   ← Árbol recursivo
      "/compare" → <PokemonComparePage>
        ├── <CompareSelector /> ×2
        ├── <StatsChart /> ×2
        └── <TypeBadge /> ×N
    </Routes>
  </BrowserRouter>
</ThemeProvider>
```

## 4. Cache Strategy

- **Caché en memoria** (`Map<string, {data, ts}>`) en el API service
- **TTL**: 5 minutos
- Se limpia automáticamente al expirar (lazy eviction on read)
- **localStorage**: solo para persistencia del tema seleccionado

## 5. PokéAPI — Endpoints Utilizados

| Endpoint | Propósito | Cache |
|----------|-----------|-------|
| `GET /pokemon/?offset={n}&limit={n}` | Lista paginada de Pokémon | ✅ |
| `GET /pokemon/{id}/` | Datos individuales (stats, types, sprites, abilities) | ✅ |
| `GET /pokemon-species/{id}/` | Lore, flavor text, evolution chain URL, genus | ✅ |
| `GET /evolution-chain/{id}/` | Árbol evolutivo completo | ✅ |
| `GET /type/{name}/` | Pokémon por tipo (para filtro) | ✅ |

### Consideraciones

- **Height**: viene en decímetros → convertir ÷10 para metros
- **Weight**: viene en hectogramos → convertir ÷10 para kilogramos
- **Sprites**: usar `sprites.other.official-artwork.front_default` para mejor calidad (PNG 475x475)
- **Flavor text**: contiene caracteres especiales (`\f`, `\n`) → sanitizar
- **Evolution Chain**: endpoint UNNAMED (sin campo `name`, solo `url`)
- **Sin autenticación ni rate limiting** (desde migración a hosting estático en 2018)

## 6. Sistema de Temas

### 6.1 Implementación

CSS Custom Properties + atributo `data-theme` en `<body>`. El `ThemeContext` maneja el toggle y persiste en `localStorage`.

```css
body[data-theme="normal"] { /* Bootstrap default */ }
body[data-theme="pokemon"] { /* Game Boy palette */ }
```

### 6.2 Normal Mode

Paleta Bootstrap estándar con acento amarillo Pokémon.

### 6.3 Pokémon Mode

Inspirado en Game Boy original (1989):

| Rol | Color | Hex |
|-----|-------|-----|
| Fondo oscuro | Verde oscuro | `#0f380f` |
| Superficie media | Verde medio | `#306230` / `#1a4a1a` |
| Texto principal | Verde neón | `#9bbc0f` |
| Texto secundario | Verde claro | `#8bac0f` |
| Acento | Rojo Pokéball | `#ef5350` |

Tipografía: `'Courier New', 'Consolas', monospace`. Cards con bordes pixel-perfect.

## 7. Routing

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | PokemonListPage | Lista paginada con filtros |
| `/pokemon/:id` | PokemonDetailPage | Detalle completo |
| `/compare` | PokemonComparePage | Comparador |

## 8. Responsive Design

| Breakpoint | Columnas | Target |
|------------|----------|--------|
| <576px | 2 columnas | Mobile |
| ≥576px | 3 columnas | Tablet vertical |
| ≥768px | 4 columnas | Tablet horizontal |
| ≥992px | 6 columnas | Desktop |

## 9. Limitaciones Conocidas

- **Filtro por tipo**: la PokéAPI no tiene un endpoint que combine tipo + paginación. El filtro se resuelve trayendo todos los Pokémon del tipo y paginando client-side. Para tipos muy poblados (Water: ~150 Pokémon), la primera carga puede ser lenta.
- **Type defenses**: en la detail page hay un placeholder. Requiere cargar datos de daño de cada tipo del Pokémon.
- **Sin test suite**: proyecto new sin test runner configurado.

## 10. Dependencias

```json
{
  "bootstrap": "^5.3.8",
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-router-dom": "^7.15.1"
}
```
