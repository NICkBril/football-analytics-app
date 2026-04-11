import { useState, useEffect, useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getTeams } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import "../styles/Teams.css";

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTeam, setSearchTeam] = useState("");
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadTeams() {
      const data = await getTeams();
      setTeams(data);
      setLoading(false);
    }

    loadTeams();
  }, []);

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
            className={`team-card ${
              favorites.includes(team.name) ? "favorite" : ""
            }`}
            onClick={() => navigate(`/team/${team.id}`)}
          >
            <img src={team.logo} alt={team.name} className="team-logo" />

            <div className="team-info">
              <strong>{team.name}</strong>

              <button
                className={`team-fav-button ${
                  favorites.includes(team.name) ? "remove" : "add"
                }`}
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