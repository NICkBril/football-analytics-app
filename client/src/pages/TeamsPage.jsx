import { useState, useEffect } from "react";
import teams from "../data/teams.json";
import "../index.css";

function TeamsPage() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

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

  return (
    <div className="page-container">
      <h1>Teams</h1>

      {/* favorites */}
      <h2>⭐ Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorite teams yet</p>
      ) : (
        favorites.map((teamName) => (
          <div key={teamName}>{teamName}</div>
        ))
      )}

      <h2>All Teams</h2>

      {teams.map((team) => (
        <div key={team.id} className="match-card">
          <strong>{team.name}</strong> - {team.stadium}

          <div>
            <button onClick={() => toggleFavorite(team.name)}>
              {favorites.includes(team.name)
                ? "Remove from favorites"
                : "Add to favorites"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamsPage;