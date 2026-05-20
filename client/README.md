# ⚽ Football Analytics App

A full-featured web application for exploring English Premier League data — teams, matches, player stats, and standings — built with React and powered by a real football API.

## 📋 Overview

Football Analytics App lets you dive deep into the 2023/24 Premier League season. Browse every team's squad, explore match details with tactical lineups and statistics, track the league table, and save your favorite clubs. The app is fully responsive and works on both desktop and mobile.

## ✨ Features

### 🏠 Home Page
- Live notification when you add or remove a team from favorites (powered by a custom EventEmitter)

### 🏆 League Table
- Full Premier League standings with wins, draws, losses, goal difference and points
- Clickable column headers for sorting by any stat
- Recent form badges (W/D/L) for each team with links to match details
- Color-coded zones: Champions League, Europa League, Conference League, Relegation
- **The Best Matches** section — top 3 highest-scoring games ranked by a priority queue

### ⚽ Matches
- All 380 season fixtures grouped by round, expandable on click
- Search matches by team name
- Click any match to open a detailed view

### 📊 Match Details
- Full match statistics with visual progress bars (possession, shots, passes, etc.)
- Match timeline with goals, cards and substitutions
- Tactical lineups displayed on an interactive football pitch
- Click any player on the pitch or in the substitutes list to open their match stats
- Injured and suspended players section
- Mobile-friendly tab layout (Overview / Stats / Lineups)

### 🏟️ Teams
- All 20 Premier League clubs with search
- Add/remove teams from favorites (persisted across sessions)
- **Featured Team** widget — cycles through all clubs using a round-robin generator
- **Async filter** — find your favorite teams using a Promise-based filter function

### 👤 Player Profiles
- Personal info: nationality, age, date of birth, height, weight
- Season statistics across all competitions (selectable via dropdown)
- Trophy cabinet with competition names and winning seasons
- In-match performance modal with detailed stats per game

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Framer Motion | Page transition animations |
| Vite | Build tool and dev server |
| JavaScript (ES2022) | Application logic |
| CSS | Styling and responsive layout |
| API-Football (v3) | Football data source |

## 📁 Project Structure

```
src/
├── api/
│   └── footballApi.js       # API calls with caching (Lab 3) and auth proxy (Lab 8)
│
├── components/
│   ├── FootballField.jsx    # Interactive pitch with player positions
│   ├── Footer.jsx
│   ├── PlayerMatchStatsModal.jsx
│   └── Skeleton.jsx         # Loading skeletons
│
├── context/
│   └── FavoritesContext.jsx # Global favorites state
├── pages/
│   ├── HomePage.jsx
│   ├── MatchDetailsPage.jsx
│   ├── MatchesPage.jsx
│   ├── PlayerDetailsPage.jsx
│   ├── TablePage.jsx
│   ├── TeamDetailsPage.jsx
│   └── TeamsPage.jsx
│
├── styles/
│   ├── FootballField.css
│   ├── index.css
│   ├── layout.css
│   ├── MatchDetails.css
│   ├── Matches.css
│   ├── PlayerDetails.css
│   ├── PlayerMatchStats.css
│   ├── Skeleton.css
│   ├── Table.css
│   ├── TeamDetails.css
│   └── Teams.css
│
├── utils/
│   ├── generators.js        # LAB 1: Round Robin generator + timeout iterator
│   ├── priorityQueue.js     # LAB 4: Bi-directional priority queue
│   ├── asyncFilter.js       # LAB 5: Callback, Promise and abortable filter
│   ├── matchStream.js       # LAB 6: Async iterator for large datasets
│   ├── eventEmitter.js      # LAB 7: Custom EventEmitter class
│   └── logger.js            # LAB 9: Logging decorator with log levels
│
├── App.jsx                  # Main application component & routing config
└── main.jsx                 # Application entry point

```

## 🔬 Lab Implementations

This project was developed as university coursework. Each utility module demonstrates a specific programming concept:

| Module | Concept |
|---|---|
| `generators.js` | Infinite generators, iterator protocol, timeout consumption |
| `priorityQueue.js` | Bi-directional priority queue with FIFO/LIFO and priority modes |
| `asyncFilter.js` | Async array functions: callback-based, Promise-based, abortable |
| `matchStream.js` | Large data processing via async iterators and chunked streaming |
| `eventEmitter.js` | Reactive pub/sub communication between independent components |
| `footballApi.js` | Memoization with time-based expiry + authentication proxy pattern |
| `logger.js` | Configurable logging decorator for sync and async functions |

## 🌐 API

Data is fetched from [API-Football](https://www.api-football.com/) (v3). The API key is stored in a `.env` file and injected automatically into every request via an authentication proxy pattern.

Endpoints used:
- `/teams` — club info and logos
- `/fixtures` — match results and details
- `/standings` — league table
- `/fixtures/statistics` — match stats
- `/fixtures/events` — goals, cards, substitutions
- `/fixtures/lineups` — tactical formations
- `/players/squads` — team rosters
- `/players` — individual player stats
- `/trophies` — player trophy history

All responses are cached in `localStorage` with a 24-hour TTL to minimize API usage.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Create .env file and add your API key
echo "VITE_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

Get a free API key at [api-football.com](https://www.api-football.com/).

## 👨‍💻 Author

**Mykola Bril**  
Kyiv Polytechnic Institute · Group IM-52  
[NickBril.ua@gmail.com](mailto:NickBril.ua@gmail.com) · Telegram: [@NickBril](https://t.me/barankaY)