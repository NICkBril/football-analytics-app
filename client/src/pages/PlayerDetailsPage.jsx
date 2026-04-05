import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPlayerDetails } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import "../styles/PlayerDetails.css";

function PlayerDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadPlayer() {
      setLoading(true);
      const playerInfo = await getPlayerDetails(id);
      setData(playerInfo);
      setLoading(false);
    }

    loadPlayer();

  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="player-profile-header" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Skeleton type="avatar" />
          <div style={{ flex: 1 }}>
            <Skeleton type="title" />
            <Skeleton type="text" />
          </div>
        </div>
        <div className="player-details-grid">
          <Skeleton type="card" />
          <Skeleton type="card" />
        </div>
      </div>
    );
  }

  if (!data) return <p className="page-container">Player not found.</p>;

  const { player, statistics } = data;
  const stats = statistics[0]; 

  return (

    <div className="page-container">

      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="player-profile-header">
        
        <div className="player-info-main">
          <img src={player.photo} alt={player.name} className="player-photo-large" />
          <div className="player-text">
            <h1>{player.name}</h1>
            <div 
              className="player-team-info clickable-team"
              onClick={() => navigate(`/team/${stats.team.id}`)}
            >
              <img src={stats.team.logo} alt="team-logo" />
              <span>{stats.team.name}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="player-details-grid">

        <div className="player-bio-card">
          <h3>Personal Information</h3>
          
          <div className="bio-item">
            <span className="bio-label">Nationality</span>
            <span className="bio-value">{player.nationality}</span>
          </div>

          <div className="bio-item">
            <span className="bio-label">Age</span>
            <span className="bio-value">{player.age} years</span>
          </div>

          <div className="bio-item">
            <span className="bio-label">Date of Birth</span>
            <span className="bio-value">{player.birth.date}</span>
          </div>

          <div className="bio-item">
            <span className="bio-label">Height</span>
            <span className="bio-value">{player.height || "N/A"}</span>
          </div>

          <div className="bio-item">
            <span className="bio-label">Weight</span>
            <span className="bio-value">{player.weight || "N/A"}</span>
          </div>

          <div className="bio-item">
            <span className="bio-label">Position</span>
            <span className="bio-value">{stats.games.position}</span>
          </div>

        </div>

        <div className="player-stats-card">
          <h3>Season Stats ({stats.league.name})</h3>
          
          <div className="player-stats-summary">
            
            <div className="stat-pill">
              <span className="stat-pill-label">Appearences</span>
              <span className="stat-pill-value">{stats.games.appearences || 0}</span>
            </div>

            <div className="stat-pill">
              <span className="stat-pill-label">Goals</span>
              <span className="stat-pill-value">{stats.goals.total || 0}</span>
            </div>

            <div className="stat-pill">
              <span className="stat-pill-label">Assists</span>
              <span className="stat-pill-value">{stats.goals.assists || 0}</span>
            </div>

            <div className="stat-pill">
              <span className="stat-pill-label">Rating</span>
              <span className="stat-pill-value">{stats.games.rating ? parseFloat(stats.games.rating).toFixed(1) : "N/A"}</span>
            </div>

          </div>

          <div className="more-stats">
            <div className="more-stat-row">
              <span>Shots on target</span>
              <span>{stats.shots.on || 0}</span>
            </div>
            <div className="more-stat-row">
              <span>Yellow Cards</span>
              <span>{stats.cards.yellow || 0}</span>
            </div>
            <div className="more-stat-row">
              <span>Red Cards</span>
              <span>{stats.cards.red || 0}</span>
            </div>
          </div>

        </div>

      </div>

    </div>

  );
}

export default PlayerDetailsPage;