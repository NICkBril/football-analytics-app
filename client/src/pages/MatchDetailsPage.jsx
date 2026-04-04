import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMatchStatistics, getMatchEvents, getMatches, getMatchLineups } from "../api/footballApi";
import "../styles/MatchDetails.css";

function MatchDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [events, setEvents] = useState([]);
  const [lineups, setLineups] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadData() {
      setLoading(true);
      
      const statsData = await getMatchStatistics(id);
      const eventsData = await getMatchEvents(id);
      const lineupsData = await getMatchLineups(id);
      
      const allMatches = await getMatches();
      const currentMatch = allMatches.find(m => m.fixture.id.toString() === id);
      
      setStats(statsData);
      setEvents(eventsData);
      setLineups(lineupsData);
      setMatchInfo(currentMatch);
      
      setLoading(false);
    }

    loadData();

  }, [id]);

  if (loading) {
    return <p className="page-container">Loading match details...</p>;
  }

  if (!stats || stats.length === 0 || !matchInfo) {
    return (
      <div className="page-container">
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>
        <p>No detailed statistics available for this match.</p>
      </div>
    );
  }

  const team1 = stats[0];
  const team2 = stats[1];

  function getStatValue(teamStats, type) {
    const stat = teamStats.statistics.find((s) => s.type === type);
    return stat ? stat.value : 0;
  }

  const allStatTypes = team1.statistics.map((s) => s.type);

  return (

    <div className="page-container">

      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Matches
      </button>

      <div className="match-stats-header">

        <div 
          className="stat-team clickable-team"
          onClick={() => navigate(`/team/${team1.team.id}`)}
        >
          <img src={team1.team.logo} alt={team1.team.name} />
          <h2>{team1.team.name}</h2>
        </div>

        <div className="score-container">
          <div className="main-score">
            <span>{matchInfo.goals.home}</span>
            <span className="score-divider">-</span>
            <span>{matchInfo.goals.away}</span>
          </div>
          <div className="match-status-badge">
            {matchInfo.fixture.status.long === "Match Finished" ? "Full Time" : matchInfo.fixture.status.long}
          </div>
        </div>

        <div 
          className="stat-team clickable-team"
          onClick={() => navigate(`/team/${team2.team.id}`)}
        >
          <img src={team2.team.logo} alt={team2.team.name} />
          <h2>{team2.team.name}</h2>
        </div>

      </div>

      <div className="match-details-grid">

        <div className="stats-container">

          <h3>Match Statistics</h3>

          {allStatTypes.map((type) => {

            const val1 = getStatValue(team1, type) || 0;
            const val2 = getStatValue(team2, type) || 0;

            const num1 = parseFloat(val1);
            const num2 = parseFloat(val2);
            const total = num1 + num2;
            const percentage = total === 0 ? 50 : (num1 / total) * 100;

            return (

              <div key={type} className="stat-item">

                <div className="stat-info">
                  <span>{val1}</span>
                  <span className="stat-name">{type}</span>
                  <span>{val2}</span>
                </div>

                <div className="stat-bar-bg">
                  <div 
                    className="stat-bar-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

              </div>

            );

          })}

        </div>

        <div className="events-container">

          <h3>Match Timeline</h3>

          <div className="events-list">

            {events.map((event, index) => {
              
              const isTeam1 = event.team.id === team1.team.id;

              return (
                <div 
                  key={index} 
                  className={`event-item ${isTeam1 ? "left" : "right"}`}
                >
                  
                  <div className="event-time">{event.time.elapsed}'</div>
                  
                  <div className="event-icon">
                    {event.type === "Goal" && "⚽"}
                    {event.type === "Card" && (event.detail === "Yellow Card" ? "🟨" : "🟥")}
                    {event.type === "subst" && "🔄"}
                  </div>

                  <div className="event-content">
                    <div 
                      className="event-player clickable-player"
                      onClick={() => navigate(`/player/${event.player.id}`)}
                    >
                      {event.player.name}
                    </div>
                    <div className="event-detail">
                      {event.detail} 
                      {event.assist.name && (
                        <span 
                          className="assist-name clickable-player"
                          onClick={() => navigate(`/player/${event.assist.id}`)}
                        > 
                          (Assist: {event.assist.name})
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

      <div className="lineups-section">

        <h3>Lineups</h3>

        <div className="lineups-container">

          {lineups.map((lineup, index) => (

            <div key={index} className="team-lineup">

              <div 
                className="lineup-team-header clickable-team"
                onClick={() => navigate(`/team/${lineup.team.id}`)}
              >
                <img src={lineup.team.logo} alt="logo" />
                <h4>Formation: {lineup.formation}</h4>
              </div>

              <h5>Starting XI</h5>

              <ul className="player-list">
                {lineup.startXI.map((p) => (
                  <li 
                    key={p.player.id} 
                    className="clickable-player-row"
                    onClick={() => navigate(`/player/${p.player.id}`)}
                  >
                    <span className="player-number">{p.player.number}</span>
                    <span className="player-name">{p.player.name}</span>
                    <span className="player-pos">{p.player.pos}</span>
                  </li>
                ))}
              </ul>

              <h5>Substitutes</h5>

              <ul className="player-list subs">
                {lineup.substitutes.map((p) => (
                  <li 
                    key={p.player.id}
                    className="clickable-player-row"
                    onClick={() => navigate(`/player/${p.player.id}`)}
                  >
                    <span className="player-number">{p.player.number}</span>
                    <span className="player-name">{p.player.name}</span>
                  </li>
                ))}
              </ul>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default MatchDetailsPage;