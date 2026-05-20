import { useState, useEffect, useContext, useRef } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getTeams } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import "../styles/Teams.css";

import { roundRobinGenerator, consumeWithTimeout } from "../utils/generators";
import { filterWithPromise } from "../utils/asyncFilter";

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTeam, setSearchTeam] = useState("");
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const navigate = useNavigate();

  const [featuredTeam, setFeaturedTeam] = useState(null);
  const generatorRef = useRef(null);

  const [asyncResults, setAsyncResults] = useState([]);
  const [asyncSearchDone, setAsyncSearchDone] = useState(false);

  useEffect(() => {
    async function loadTeams() {
      const data = await getTeams();
      setTeams(data);
      setLoading(false);
      // ============================================================
      // START: LAB 1 — ініціалізуємо генератор після завантаження
      // ============================================================
      const teamNames = data.map((t) => { return t.team.name; });
      generatorRef.current = roundRobinGenerator(teamNames);

      const first = generatorRef.current.next();
      if (!first.done) {
        setFeaturedTeam(first.value);
      }

      const testGen = roundRobinGenerator(teamNames);
      const testResult = consumeWithTimeout(testGen, 1);
      console.log("Lab 1 — consumeWithTimeout test execution:", testResult);
    }
    loadTeams();
  }, []);

  // LAB 1 — функція для "Next Team"
  function handleNextFeatured() {
    if (!generatorRef.current) {
      return;
    }
    const next = generatorRef.current.next();
    if (!next.done) {
      setFeaturedTeam(next.value);
    }
  }
  // END: LAB 1

  
  // ============================================================
  // START: LAB 5 — async filter через Promise-based
  // ============================================================
  function handleAsyncFilter() {
    const predicate = (item) => {
      return Promise.resolve(favorites.includes(item.team.name));
    };

    filterWithPromise(teams, predicate).then((result) => {
      setAsyncResults(result);
      setAsyncSearchDone(true);
    });
  }
  // END: LAB 5

  const filteredTeams = teams
    .filter((team) =>
      team.team.name.toLowerCase().includes(searchTeam.toLowerCase())
    )
    .sort((a, b) => a.team.name.localeCompare(b.team.name));

  if (loading) {
    return (
      <div className="page-container">
        <Skeleton type="title" />
        <div style={{ marginBottom: '20px' }}>
          <Skeleton type="text" />
        </div>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} type="card" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1>Teams</h1>

      {featuredTeam && (
        <div className="featured-team-banner">
          <span>⚡ Featured team: <strong>{featuredTeam}</strong></span>
          <button onClick={handleNextFeatured}>
            Next →
          </button>
        </div>
      )}

      <div className="async-filter-box">
        <button className="async-filter-btn" onClick={handleAsyncFilter}>
          🔍 Show my favorites (async filter)
        </button>
        {asyncSearchDone && (
          <p className="async-filter-results">
            Async filter found <strong>{asyncResults.length}</strong> favorite team(s):{" "}
            {asyncResults.map((t) => { return t.team.name; }).join(", ") || "none"}
          </p>
        )}
      </div>

      <input
        type="text"
        placeholder="Search teams..."
        value={searchTeam}
        onChange={(e) => setSearchTeam(e.target.value)}
      />

      <h2>⭐ Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorite teams yet</p>
      ) : (
        <ul>
          {favorites.map((teamName) => (
            <li key={teamName}>
              {teamName}
              <button
                className="favorite-remove-x"
                onClick={() => toggleFavorite(teamName)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>All Teams</h2>

      {filteredTeams.map((item) => {
        const team = item.team;

        return (
          <div
            key={team.id}
            className={`team-card ${favorites.includes(team.name) ? "favorite" : ""}`}
            onClick={() => { return navigate(`/team/${team.id}`); }}
          >
            <img src={team.logo} alt={team.name} className="team-logo" />

            <div className="team-info">
              <strong>{team.name}</strong>

              <button
                className={`team-fav-button ${favorites.includes(team.name) ? "remove" : "add"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(team.name);
                }}
              >
                {favorites.includes(team.name)
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </button>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

export default TeamsPage;