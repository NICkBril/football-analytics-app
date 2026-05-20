import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";
import TablePage from "./pages/TablePage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import MatchDetailsPage from "./pages/MatchDetailsPage";
import PlayerDetailsPage from "./pages/PlayerDetailsPage";
import { FavoritesContext, FavoritesProvider } from "./context/FavoritesContext";
import "./styles/index.css";
import "./styles/layout.css";

import Footer from "./components/Footer";
import { favoritesEmitter } from "./utils/eventEmitter";

function App() {
  // ============================================================
  // START: LAB 7 — navbar
  // ============================================================
  const [navNotif, setNavNotif] = useState(null);

  useEffect(() => {
    function handleGlobalFavoritesChange(data) {
      setNavNotif(data);

      setTimeout(() => {
        setNavNotif(null);
      }, 3000);
    }

    favoritesEmitter.on("favoritesChanged", handleGlobalFavoritesChange);

    return () => {
      favoritesEmitter.off("favoritesChanged", handleGlobalFavoritesChange);
    };
  }, []);
  // END: LAB 7

  return (
    <FavoritesProvider>
      <Router>
        <div className="app-container">
          <nav style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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


            {navNotif && (
              <span className="nav-notification-badge" style={{
                marginLeft: "15px",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "bold",
                backgroundColor: navNotif.action === "added" ? "#fffbe6" : "#fdf2f2",
                border: navNotif.action === "added" ? "1px solid gold" : "1px solid #f5c6cb",
                color: navNotif.action === "added" ? "#b78103" : "#a12229",
                transition: "all 0.3s ease"
              }}>
                {navNotif.action === "added" ? "⭐ Added " : "❌ Removed "} 
                {navNotif.team}
              </span>
            )}
          </nav>

          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/table" element={<TablePage />} />
              <Route path="/team/:id" element={<TeamDetailsPage />} />
              <Route path="/match/:id" element={<MatchDetailsPage />} />
              <Route path="/player/:id" element={<PlayerDetailsPage />} />.
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;