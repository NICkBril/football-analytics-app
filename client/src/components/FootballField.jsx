import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FootballField.css";

const FootballField = ({ lineup, teamType }) => {
  const navigate = useNavigate();
  if (!lineup) return null;

  const buildPositions = (players) => {
    const lines = {};
    players.forEach((p) => {
      if (!p.player.grid) return;
      const [col] = p.player.grid.split(":").map(Number);
      if (!lines[col]) lines[col] = [];
      lines[col].push(p);
    });

    const sortedCols = Object.keys(lines)
      .map(Number)
      .sort((a, b) => a - b);

    const totalCols = sortedCols.length;

    const result = {};

    sortedCols.forEach((col, colIndex) => {
      const playersInLine = lines[col];
      const count = playersInLine.length;
      
      let leftPercent;
      if (totalCols === 1) {
        leftPercent = 50;
      } else {
        leftPercent = 10 + (colIndex / (totalCols - 1)) * 80;
      }

      if (teamType === "away") {
        leftPercent = 100 - leftPercent;
      }

      playersInLine.forEach((p, playerIndex) => {
        let topPercent;
        if (count === 1) {
          topPercent = 50;
        } else {
          const spacing = 80 / (count - 1);
          topPercent = 10 + playerIndex * spacing;
        }

        result[p.player.id] = {
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
        };
      });
    });

    return result;
  };

  const positions = buildPositions(lineup.startXI);

  return (
    <div className="field-half">
      {lineup.startXI.map((p) => {
        const pos = positions[p.player.id] || { top: "50%", left: "50%" };
        return (
          <div
            key={p.player.id}
            className="player-on-field"
            style={pos}
            onClick={() => navigate(`/player/${p.player.id}`)}
          >
            <div className="player-photo-wrapper">
              <img
                src={`https://media.api-sports.io/football/players/${p.player.id}.png`}
                alt={p.player.name}
                onError={(e) => {
                  e.target.src = "https://cdn.sofifa.net/player_0.png";
                }}
              />
            </div>
            <div className="player-badge">
              <span className="player-number-circle">{p.player.number}</span>
              <span className="player-name-field">
                {p.player.name.split(" ").pop()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FootballField;