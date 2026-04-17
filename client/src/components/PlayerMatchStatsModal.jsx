import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlayerMatchStats } from "../api/footballApi";
import "../styles/PlayerMatchStatsModal.css";

function PlayerMatchStatsModal({ playerId, fixtureId, onClose }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId || !fixtureId) return;
    setLoading(true);
    setData(null);
    getPlayerMatchStats(fixtureId, playerId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [playerId, fixtureId]);

  useEffect(() => {
    if (playerId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [playerId]);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const s = data?.statistics?.[0];
  const player = data?.player;
  const isGoalkeeper = s?.games?.position === "G";

  const rating = parseFloat(s?.games?.rating);
  const ratingColor =
    rating >= 8 ? "#27ae60" :
    rating >= 6.5 ? "#f39c12" :
    rating >= 5 ? "#e67e22" : "#e74c3c";

  const statRow = (label, value) => {
    if (value === null || value === undefined) return null;
    return (
      <div className="pmm-stat-row" key={label}>
        <span className="pmm-stat-label">{label}</span>
        <span className="pmm-stat-value">{value}</span>
      </div>
    );
  };

  return (
    <div className="pmm-backdrop" onClick={handleBackdrop}>
      <div className="pmm-modal">

        <div className="pmm-header">
          <div className="pmm-photo-wrap">
            <img
              src={`https://media.api-sports.io/football/players/${playerId}.png`}
              alt={player?.name}
              onError={(e) => { e.target.src = "https://cdn.sofifa.net/player_0.png"; }}
            />
            {!loading && rating > 0 && (
              <span className="pmm-rating" style={{ background: ratingColor }}>
                {rating.toFixed(1)}
              </span>
            )}
          </div>
          <button className="pmm-close-btn" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className="pmm-loading">
            <div className="pmm-spinner" />
            <span>Loading stats...</span>
          </div>
        ) : !s ? (
          <div className="pmm-no-data">No stats available for this player.</div>
        ) : (
          <>
            <div
              className="pmm-player-name clickable-name"
              onClick={() => { onClose(); navigate(`/player/${playerId}`); }}
              title="Go to profile"
            >
              {player?.name}
            </div>

            <div className="pmm-meta">
              <div className="pmm-meta-item">
                <span className="pmm-meta-val">{s.games?.position || "—"}</span>
                <span className="pmm-meta-label">Position</span>
              </div>
              <div className="pmm-meta-item">
                <span className="pmm-meta-val">{player?.nationality || "—"}</span>
                <span className="pmm-meta-label">Country</span>
              </div>
              <div className="pmm-meta-item">
                <span className="pmm-meta-val">{player?.age ?? "—"}</span>
                <span className="pmm-meta-label">Age</span>
              </div>
            </div>

            <div className="pmm-body">

              <div className="pmm-section-title">⭐ Top stats</div>
              {statRow("Minutes played", s.games?.minutes)}
              {statRow("Goals", s.goals?.total ?? 0)}
              {statRow("Assists", s.goals?.assists ?? 0)}
              {s.passes?.total != null && statRow(
                "Accurate passes",
                `${s.passes?.accuracy ?? "?"}/${s.passes?.total} (${Math.round(((s.passes?.accuracy ?? 0) / s.passes?.total) * 100)}%)`
              )}
              {statRow("Shots on target", s.shots?.on ?? 0)}
              {statRow("Key passes", s.passes?.key ?? 0)}

              {!isGoalkeeper && (
                <>
                  <div className="pmm-section-title">⚔️ Attack</div>
                  {statRow("Shots total", s.shots?.total ?? 0)}
                  {statRow("Shots on target", s.shots?.on ?? 0)}
                  {statRow("Dribbles attempted", s.dribbles?.attempts ?? 0)}
                  {statRow("Dribbles success", s.dribbles?.success ?? 0)}
                  {statRow("Touches", s.tackles?.total ?? "—")}
                  {statRow("Fouls drawn", s.fouls?.drawn ?? 0)}
                </>
              )}

              <div className="pmm-section-title">🎯 Passes</div>
              {statRow("Total passes", s.passes?.total ?? 0)}
              {statRow("Accurate passes", s.passes?.accuracy ?? 0)}
              {statRow("Key passes", s.passes?.key ?? 0)}

              {!isGoalkeeper && (
                <>
                  <div className="pmm-section-title">🛡️ Defence</div>
                  {statRow("Tackles", s.tackles?.total ?? 0)}
                  {statRow("Interceptions", s.tackles?.interceptions ?? 0)}
                  {statRow("Clearances", s.tackles?.blocks ?? 0)}
                  {statRow("Duels total", s.duels?.total ?? 0)}
                  {statRow("Duels won", s.duels?.won ?? 0)}
                  {statRow("Fouls committed", s.fouls?.committed ?? 0)}
                </>
              )}

              {isGoalkeeper && (
                <>
                  <div className="pmm-section-title">🧤 Goalkeeper</div>
                  {statRow("Saves", s.goals?.saves ?? 0)}
                  {statRow("Goals conceded", s.goals?.conceded ?? 0)}
                  {statRow("Penalties saved", s.penalty?.saved ?? 0)}
                  {statRow("Penalties missed", s.penalty?.missed ?? 0)}
                </>
              )}

              {(s.cards?.yellow > 0 || s.cards?.red > 0) && (
                <>
                  <div className="pmm-section-title">🃏 Disciplinary</div>
                  {s.cards?.yellow > 0 && statRow("Yellow cards", s.cards.yellow)}
                  {s.cards?.red > 0 && statRow("Red cards", s.cards.red)}
                </>
              )}

            </div>

            <div className="pmm-footer">
              <button
                className="pmm-profile-btn"
                onClick={() => { onClose(); navigate(`/player/${playerId}`); }}
              >
                👤 Player profile
              </button>
              <button className="pmm-done-btn" onClick={onClose}>Done</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default PlayerMatchStatsModal;