import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";
import TablePage from "./pages/TablePage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import { FavoritesContext, FavoritesProvider } from "./context/FavoritesContext";

import Footer from "./components/Footer";

function App() {
  return (
    <FavoritesProvider>
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/">
            <button>Home</button>
          </Link>

          <Link to="/teams">
            <button>Teams</button>
          </Link>

          <Link to="/matches">
            <button>Matches</button>
          </Link>

          <Link to="/table">
            <button>Table</button>
          </Link>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/table" element={<TablePage />} />
            <Route path="/team/:id" element={<TeamDetailsPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
    </FavoritesProvider>
  );
}

export default App;