import { useState, useEffect } from "react";
import teams from "../data/teams.json";
import "../index.css";

function TeamsPage() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTeam, setSearchTeam] = useState("");

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

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTeam.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Teams</h1>

      <input
        type="text"
        placeholder="Search teams..."
        value={searchTeam}
        onChange={(e) => setSearchTeam(e.target.value)}
        style={{ marginBottom: "15px", padding: "5px", width: "200px" }}
      />

      <h2>⭐ Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorite teams yet</p>
      ) : (
        <ul>
          {favorites.map((teamName) => (
            <li key={teamName}>
              {teamName}
              <button onClick={() => toggleFavorite(teamName)}>❌</button>
            </li>
          ))}
        </ul>
      )}

      <h2>All Teams</h2>
      {filteredTeams.map((team) => (
        <div
          key={team.id}
          className={`match-card ${favorites.includes(team.name) ? "favorite" : ""}`}
        >
          <strong>{team.name}</strong> - {team.stadium}
          <div>
            <button onClick={() => toggleFavorite(team.name)}>
              {favorites.includes(team.name) ? "Remove from favorites" : "Add to favorites"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamsPage;