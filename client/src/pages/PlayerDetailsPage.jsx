import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPlayerDetails, getPlayerTrophies } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import "../styles/PlayerDetails.css";

function PlayerDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0);

  useEffect(() => {

    async function loadPlayerData() {
      setLoading(true);

      const [playerInfo, trophiesData] = await Promise.all([
        getPlayerDetails(id),
        getPlayerTrophies(id)
      ]);

      setData(playerInfo);
      setTrophies(trophiesData);
      setLoading(false);
    }

    loadPlayerData();

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
  
  const stats = statistics[selectedLeagueIndex]; 

  function getCountryCode(country) {

    const map = {
      England: "gb",
      Spain: "es",
      Germany: "de",
      Italy: "it",
      France: "fr",
      Ukraine: "ua",
      Brazil: "br",
      Argentina: "ar",
      Portugal: "pt",
      Poland: "pl",
      Netherlands: "nl"
    };

    return map[country] || "";
  }

  const trophiesSummary = trophies
    .filter(t => t.place === "Winner" || t.place === "1st Place")
    .reduce((acc, t) => {
      const name = t.league;
      if (!acc[name]) {
        acc[name] = { count: 0, seasons: [] };
      }
      acc[name].count += 1;
      acc[name].seasons.push(t.season);
      return acc;
    }, {});

  const trophyNames = Object.keys(trophiesSummary);

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
            <span className="bio-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {getCountryCode(player.nationality) && (
                <img 
                  src={`https://flagcdn.com/w20/${getCountryCode(player.nationality)}.png`} 
                  alt="flag" 
                  style={{ borderRadius: '2px' }}
                />
              )}
              {player.nationality}
            </span>
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
          
          <div className="stats-header-row">
            <h3>Season Stats</h3>
            <select 
              className="league-select"
              value={selectedLeagueIndex}
              onChange={(e) => setSelectedLeagueIndex(parseInt(e.target.value))}
            >
              {statistics.map((s, index) => (
                <option key={index} value={index}>
                  {s.league.name}
                </option>
              ))}
            </select>
          </div>

          <div className="player-stats-horizontal">
            
            <div className="stat-block">
              <span className="stat-number">{stats.goals.total || 0}</span>
              <span className="stat-label">Goals</span>
            </div>

            <div className="stat-block">
              <span className="stat-number">{stats.goals.assists || 0}</span>
              <span className="stat-label">Assists</span>
            </div>

            <div className="stat-block">
              <div className="rating-badge" style={{ 
                backgroundColor: stats.games.rating >= 7.5 ? '#2ecc71' : 
                                stats.games.rating >= 6.5 ? '#f1c40f' : '#e67e22' 
              }}>
                {stats.games.rating ? parseFloat(stats.games.rating).toFixed(2) : "N/A"}
              </div>
              <span className="stat-label">Rating</span>
            </div>

          </div>

          <div className="secondary-stats-grid">
            
            <div className="stat-block-mini">
              <span className="stat-number-small">{stats.games.appearences || 0}</span>
              <span className="stat-label">Matches</span>
            </div>

            <div className="stat-block-mini">
              <span className="stat-number-small">{stats.games.lineups || 0}</span>
              <span className="stat-label">Started</span>
            </div>

            <div className="stat-block-mini">
              <span className="stat-number-small">{stats.games.minutes || 0}</span>
              <span className="stat-label">Minutes played</span>
            </div>

          </div>

          <div className="more-stats-footer">
            <div className="footer-stat">
              <span>Shots on target: <strong>{stats.shots.on || 0}</strong></span>
            </div>
            <div className="footer-stat">
              <span className="card-yellow">🟨 {stats.cards.yellow || 0}</span>
              <span className="card-red">🟥 {stats.cards.red || 0}</span>
            </div>
          </div>

        </div>

      </div>

      {trophyNames.length > 0 && (
        <div className="trophies-compact-card">
          <h3>Trophies</h3>
          <div className="trophy-rows-container">
            {trophyNames.map((name) => (
              <div key={name} className="trophy-row-compact">
                <div className="trophy-count-badge">{trophiesSummary[name].count}</div>
                <div className="trophy-main-info">
                  <span className="trophy-icon-mini">🏆</span>
                  <span className="trophy-league-name">{name}</span>
                  <span className="trophy-seasons-list">
                    ({trophiesSummary[name].seasons.join(' · ')})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>

  );
}

export default PlayerDetailsPage;