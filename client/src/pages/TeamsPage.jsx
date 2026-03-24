import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams } from "../api/footballApi";
import "../index.css";

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTeam, setSearchTeam] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadTeams() {
      const data = await getTeams();
      setTeams(data);
    }

    loadTeams();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (teamName) => {
    setFavorites((prev) =>
      prev.includes(teamName)
        ? prev.filter((t) => t !== teamName)
        : [...prev, teamName]
    );
  };

  const filteredTeams = teams
    .filter((team) =>
      team.team.name.toLowerCase().includes(searchTeam.toLowerCase())
    )
    .sort((a, b) => a.team.name.localeCompare(b.team.name));

  return (
    <div className="page-container">
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
            <img
              src={team.logo}
              alt={team.name}
              className="team-logo"
            />

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
    </div>
  );
}

export default TeamsPage;