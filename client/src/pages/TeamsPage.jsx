import { useState } from "react";
import teams from "../data/teams.json";
import "../index.css";

function TeamsPage() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (teamName) => {
    if (favorites.includes(teamName)) {
      setFavorites(favorites.filter((t) => t !== teamName));
    } else {
      setFavorites([...favorites, teamName]);
    }
  };

  return (
    <div className="page-container">
      <h1>Teams</h1>

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