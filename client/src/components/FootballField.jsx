import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FootballField.css";

const FootballField = ({ lineup, teamType }) => {
  const navigate = useNavigate();
  if (!lineup) return null;
  
  const getPosition = (gridPos) => {
    if (!gridPos) return { top: "50%", left: "50%" };
    const [y, x] = gridPos.split(":").map(Number);
    
    const top = (y / 9) * 90 + 5;
    let left = (x / 4) * 45;

    if (teamType === "away") {
      left = 100 - left - 10;
    } else {
      left = left + 5;
    }

    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="field-half">
      {lineup.startXI.map((p) => (
        <div
          key={p.player.id}
          className="player-on-field"
          style={getPosition(p.player.grid)}
          onClick={() => navigate(`/player/${p.player.id}`)}
        >
          <div className="player-photo-wrapper">
             <img 
               src={`https://media.api-sports.io/football/players/${p.player.id}.png`} 
               alt={p.player.name}
               onError={(e) => { e.target.src = "https://cdn.sofifa.net/player_0.png" }}
             />
          </div>
          <div className="player-badge">
            <span className="player-number-circle">{p.player.number}</span>
            <span className="player-name-field">{p.player.name.split(' ').pop()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FootballField;