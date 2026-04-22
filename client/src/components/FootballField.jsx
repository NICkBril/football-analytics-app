import React, { useEffect, useState } from "react";
import "../styles/FootballField.css";

const FootballField = ({ lineup, teamType, events = [], onPlayerClick }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (!lineup) return null;

  const eventMap = {};
  events.forEach((ev) => {
    const pid = ev.player?.id;
    if (pid) {
      if (!eventMap[pid]) eventMap[pid] = [];
      eventMap[pid].push(ev);
    }
    const aid = ev.assist?.id;
    if (aid && ev.type === "Goal") {
      if (!eventMap[aid]) eventMap[aid] = [];
      eventMap[aid].push({ ...ev, _isAssist: true });
    }
  });

  const buildPositionsDesktop = (players) => {
    const lines = {};
    players.forEach((p) => {
      if (!p.player.grid) return;
      const [col] = p.player.grid.split(":").map(Number);
      if (!lines[col]) lines[col] = [];
      lines[col].push(p);
    });

    const sortedCols = Object.keys(lines).map(Number).sort((a, b) => a - b);
    const totalCols = sortedCols.length;
    const result = {};

    sortedCols.forEach((col, colIndex) => {
      const playersInLine = lines[col];
      const count = playersInLine.length;

      let leftPercent =
        totalCols === 1 ? 50 : 10 + (colIndex / (totalCols - 1)) * 80;
      if (teamType === "away") leftPercent = 100 - leftPercent;

      const verticalSqueeze = colIndex === 0 ? 0 : colIndex === 1 ? 85 : 65;

      playersInLine.forEach((p, playerIndex) => {
        let topPercent;
        if (count === 1) {
          topPercent = 50;
        } else {
          const margin = (100 - verticalSqueeze) / 2;
          const spacing = verticalSqueeze / (count - 1);
          topPercent = margin + playerIndex * spacing;
        }

        result[p.player.id] = {
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
        };
      });
    });

    return result;
  };

  const buildPositionsMobile = (players) => {
    const lines = {};
    players.forEach((p) => {
      if (!p.player.grid) return;
      const [col] = p.player.grid.split(":").map(Number);
      if (!lines[col]) lines[col] = [];
      lines[col].push(p);
    });

    const sortedCols = Object.keys(lines).map(Number).sort((a, b) => a - b);
    const totalCols = sortedCols.length;
    const result = {};

    sortedCols.forEach((col, colIndex) => {
      const playersInLine = lines[col];
      const count = playersInLine.length;

      let topPercent =
        totalCols === 1 ? 50 : 8 + (colIndex / (totalCols - 1)) * 84;

      if (teamType === "away") topPercent = 100 - topPercent;

      const horizontalSqueeze = 70;

      playersInLine.forEach((p, playerIndex) => {
        let leftPercent;
        if (count === 1) {
          leftPercent = 50;
        } else {
          const margin = (100 - horizontalSqueeze) / 2;
          const spacing = horizontalSqueeze / (count - 1);
          leftPercent = margin + playerIndex * spacing;
        }

        result[p.player.id] = {
          top: `${topPercent}%`,
          left: `${leftPercent}%`,
        };
      });
    });

    return result;
  };

  const positions = isMobile
    ? buildPositionsMobile(lineup.startXI)
    : buildPositionsDesktop(lineup.startXI);

  const getEvs = (id) => eventMap[id] || [];

  const getCard = (evs) => {
    if (evs.some((e) => !e._isAssist && e.type === "Card" &&
        (e.detail === "Red Card" || e.detail === "Yellow Red Card"))) return "red";
    if (evs.some((e) => !e._isAssist && e.type === "Card" && e.detail === "Yellow Card")) return "yellow";
    return null;
  };

  const getSubst = (evs) => {
    const s = evs.find((e) => !e._isAssist && e.type === "subst");
    return s ? s.time.elapsed : null;
  };

  const getGoals = (evs) =>
    evs.filter((e) => !e._isAssist && e.type === "Goal" && e.detail !== "Missed Penalty");

  const getAssists = (evs) => evs.filter((e) => e._isAssist);

  return (
    <div className="field-half">
      {lineup.startXI.map((p, index) => {
        const pos = positions[p.player.id] || { top: "50%", left: "50%" };
        const evs = getEvs(p.player.id);
        const card = getCard(evs);
        const substTime = getSubst(evs);
        const goals = getGoals(evs);
        const assists = getAssists(evs);

        return (
          <div
            key={p.player.id}
            className="player-on-field"
            style={{ 
              ...pos, 
              "--delay": `${index * 0.06}s` 
            }}
            onClick={() => onPlayerClick(p.player.id)}
          >
            <div className="player-top-row">
              {substTime !== null && (
                <span className="player-event-subst">
                  <span className="subst-icon">←</span>
                  {substTime}'
                </span>
              )}
            </div>

            <div className="player-photo-area">
              {card && (
                <span className={`player-card-badge ${card === "red" ? "card-red" : "card-yellow"}`} />
              )}
              
              <div className="player-photo-wrapper">
                <img
                  src={`https://media.api-sports.io/football/players/${p.player.id}.png`}
                  alt={p.player.name}
                  onError={(e) => {
                    e.target.src = "https://cdn.sofifa.net/player_0.png";
                  }}
                />
              </div>

              {goals.length > 0 && (
                <div className="player-events-stack goals">
                  {goals.map((_, i) => (
                    <span key={i} className="player-event-icon ball stacked">⚽</span>
                  ))}
                </div>
              )}

              {assists.length > 0 && (
                <div className="player-events-stack assists">
                  {assists.map((_, i) => (
                    <span key={i} className="player-event-icon boot stacked">👟</span>
                  ))}
                </div>
              )}
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