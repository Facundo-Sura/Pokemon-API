<div align="center">
  <img src="public/favicon.svg" width="80" alt="PokéWeb logo" />
  <h1>PokéWeb</h1>
  <p><strong>Pokémon Explorer — SPA</strong></p>
  <p>
    <a href="https://poke-web-theta.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/demo-vercel-000?style=flat-square&logo=vercel" alt="Vercel deploy" />
    </a>
    <img src="https://img.shields.io/badge/vite-8.x-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/react-19.x-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap" alt="Bootstrap" />
    <img src="https://img.shields.io/badge/bun-1.3-F9F9F9?style=flat-square&logo=bun" alt="Bun" />
  </p>
  <p>
    Explorá, buscá, filtrá y compará Pokémon con una interfaz responsive
    y un modo retro Game Boy 🎮
  </p>
</div>

---

## ✨ Features

| Feature | Descripción |
|---------|-------------|
| 🏠 **Pokédex** | Lista paginada con sprite, nombre, #ID y badges de tipo |
| 🔍 **Búsqueda** | Autocomplete con debounce de 300ms, busca por nombre o ID |
| 🎯 **Filtro por tipo** | Los 18 tipos con colores oficiales, paginación sobre resultados |
| 📊 **Detalle** | Sprite oficial + shiny, stats (barras), habilidades, altura/peso |
| 🐛➡️🦋 **Cadena evolutiva** | Árbol visual con condiciones (nivel, objeto, intercambio, etc.) |
| ⚔️ **Comparador** | Dos Pokémon lado a lado con stats comparativos |
| 🎮 **Pokémon Mode** | Tema retro Game Boy (paleta 4 verdes + rojo Pokéball) |
| 📱 **Responsive** | Mobile-first con grid adaptativo (2 → 6 columnas) |

## 🛠️ Stack

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| [Vite](https://vite.dev/) | 8.x | Bundler + dev server |
| [React](https://react.dev/) | 19.x | UI library |
| [Bootstrap 5](https://getbootstrap.com/) | 5.3.x | CSS framework + responsive grid |
| [React Router](https://reactrouter.com/) | 7.x | SPA routing |
| [Bun](https://bun.sh/) | 1.3.x | Package manager + runtime |
| [PokéAPI](https://pokeapi.co/) | v2 | API de datos Pokémon |

## 🚀 Desarrollo local

```bash
# clonar
git clone https://github.com/tuusuario/poke-web.git
cd poke-web

# instalar dependencias
bun install

# servidor de desarrollo (HMR)
bun run dev

# build producción
bun run build

# vista previa del build
bun run preview
```

## ☁️ Deploy

El proyecto está configurado para **Vercel** con detección automática de Vite. El `vercel.json` incluye rewrites necesarias para SPA routing con React Router.

```bash
vercel --prod
```

O conectá el repo desde el [dashboard de Vercel](https://vercel.com/new).

## 🎨 Sistema de Temas

### Normal Mode
Tema claro Bootstrap con acento amarillo Pokémon (`#ffcb05`).

### Pokémon Mode (Game Boy Retro)
Inspirado en la paleta de 4 tonos de verde de la Game Boy original (1989):

| Rol | Color | Hex |
|-----|-------|-----|
| Fondo oscuro | Verde oscuro | `#0f380f` |
| Superficie | Verde medio | `#306230` |
| Texto | Verde neón | `#9bbc0f` |
| Acento | Rojo Pokéball | `#ef5350` |

**Cómo funciona**: CSS Custom Properties en `body[data-theme]`. El `ThemeContext` cambia el atributo y CSS se encarga de todo. La preferencia persiste en `localStorage`.

## 📁 Estructura del proyecto

```
src/
├── services/pokeapi.js         # API client con fetch + Map cache (5min TTL)
├── context/ThemeContext.jsx     # Toggle de tema + localStorage
├── hooks/
│   ├── usePokemon.js            # usePokemonList + usePokemon
│   └── useEvolutionChain.js     # Fetch + flatten de cadena evolutiva
├── components/                  # 10 componentes presentacionales
│   ├── PokemonCard.jsx          # Card con sprite + tipos + #ID
│   ├── TypeBadge.jsx            # Badge coloreado por tipo (18 tipos)
│   ├── StatsChart.jsx           # Barras de estadísticas base (HP/Spe)
│   ├── EvolutionChain.jsx       # Árbol evolutivo recursivo con condiciones
│   ├── SearchBar.jsx            # Búsqueda con autocomplete + debounce
│   ├── TypeFilter.jsx           # Filtro por tipo con botones
│   ├── CompareSelector.jsx      # Selector para página de comparación
│   ├── ThemeToggle.jsx          # Botón sol/rayo ⚡☀️
│   ├── Navbar.jsx               # Navegación principal + search + theme
│   ├── LoadingSpinner.jsx       # Spinner Bootstrap
│   └── ErrorMessage.jsx         # Alert con retry + go back
└── pages/
    ├── PokemonListPage.jsx      # Lista + paginación + filtro + búsqueda
    ├── PokemonDetailPage.jsx    # Detalle completo + stats + evolución
    └── PokemonComparePage.jsx   # Comparador lado a lado
```

## 📡 API Endpoints utilizados

| Endpoint | Uso |
|----------|-----|
| `GET /pokemon/?offset=&limit=` | Lista paginada |
| `GET /pokemon/{id}/` | Datos de batalla (stats, types, sprites) |
| `GET /pokemon-species/{id}/` | Lore, cadena evolutiva, género |
| `GET /evolution-chain/{id}/` | Árbol evolutivo |
| `GET /type/{name}/` | Pokémon por tipo (para filtro) |

> **Nota**: Height viene en decímetros (÷10 = metros), weight en hectogramos (÷10 = kg). Usar `sprites.other.official-artwork.front_default` para la mejor calidad de imagen.

## 📄 Licencia

MIT — hecho con ❤️ para la comunidad Pokémon.
