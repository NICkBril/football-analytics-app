import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMatchStatistics, getMatchEvents, getMatches, getMatchLineups } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import FootballField from "../components/FootballField";
import PlayerMatchStatsModal from "../components/PlayerMatchStatsModal";
import "../styles/MatchDetails.css";
import "../styles/FootballField.css";

function MatchDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [events, setEvents] = useState([]);
  const [lineups, setLineups] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalPlayerId, setModalPlayerId] = useState(null);

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
    return (
      <div className="page-container">
        <Skeleton type="title" />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
          <Skeleton type="avatar" />
          <div style={{ width: '100px' }}><Skeleton type="title" /></div>
          <Skeleton type="avatar" />
        </div>
        <div className="match-details-grid">
          <Skeleton type="card" />
          <Skeleton type="card" />
        </div>
        <div style={{ marginTop: '20px' }}>
          <Skeleton type="card" />
        </div>
      </div>
    );
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

  const goalEvents = events.filter(ev => ev.type === "Goal" && ev.detail !== "Missed Penalty");
  const homeScorers = goalEvents.filter(ev => ev.team.id === team1.team.id);
  const awayScorers = goalEvents.filter(ev => ev.team.id === team2.team.id);

  function getStatValue(teamStats, type) {
    const stat = teamStats.statistics.find((s) => s.type === type);
    return stat ? stat.value : 0;
  }

  const allStatTypes = team1.statistics.map((s) => s.type);

  const buildEventMap = () => {
    const map = {};
    events.forEach((ev) => {
      const pid = ev.player?.id;
      if (pid) {
        if (!map[pid]) map[pid] = [];
        map[pid].push(ev);
      }
      const aid = ev.assist?.id;
      if (aid && ev.type === "Goal") {
        if (!map[aid]) map[aid] = [];
        map[aid].push({ ...ev, _isAssist: true });
      }
    });
    return map;
  };

  const eventMap = buildEventMap();

  const getPlayerEvs = (pid) => eventMap[pid] || [];

  const getSubstTime = (pid) => {
    const ev = events.find(
      (e) => e.type === "subst" && e.assist?.id === pid
    );
    return ev ? ev.time.elapsed : null;
  };

  const getCard = (evs) => {
    if (evs.some(e => !e._isAssist && e.type === "Card" &&
        (e.detail === "Red Card" || e.detail === "Yellow Red Card"))) return "red";
    if (evs.some(e => !e._isAssist && e.type === "Card" && e.detail === "Yellow Card")) return "yellow";
    return null;
  };

  const getGoalCount = (evs) =>
    evs.filter(e => !e._isAssist && e.type === "Goal" && e.detail !== "Missed Penalty").length;

  const getAssistCount = (evs) =>
    evs.filter(e => e._isAssist).length;

  const getPositionLabel = (pos) => {
    if (!pos) return "";
    const map = {
      G: "Goalkeeper", D: "Defender",
      M: "Midfielder", F: "Attacker",
    };
    return map[pos] || pos;
  };

  return (

    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Matches
      </button>

      <div className="match-stats-header">

        <div className="header-team-section left">
          <div 
            className="stat-team clickable-team"
            onClick={() => navigate(`/team/${team1.team.id}`)}
          >
            <img src={team1.team.logo} alt={team1.team.name} />
            <h2>{team1.team.name}</h2>
          </div>
          <div className="scorers-list left">
            {homeScorers.map((s, i) => (
              <div key={i} className="scorer-item">
                {s.player.name} {s.time.elapsed}'{s.detail === "Penalty" && " (P)"}
              </div>
            ))}
          </div>
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

        <div className="header-team-section right">
          <div 
            className="stat-team clickable-team"
            onClick={() => navigate(`/team/${team2.team.id}`)}
          >
            <img src={team2.team.logo} alt={team2.team.name} />
            <h2>{team2.team.name}</h2>
          </div>
          <div className="scorers-list right">
            {awayScorers.map((s, i) => (
              <div key={i} className="scorer-item">
                {s.player.name} {s.time.elapsed}'{s.detail === "Penalty" && " (P)"}
              </div>
            ))}
          </div>
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
                      onClick={() => setModalPlayerId(event.player.id)}
                    >
                      {event.player.name}
                    </div>

                    <div className="event-detail">
                      {event.detail}

                      {event.assist?.name && (
                        <span
                          className="assist-name clickable-player"
                          onClick={() => setModalPlayerId(event.assist.id)}
                        >
                          {" "}
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

        <h3>Tactical Lineups</h3>

        {lineups && lineups.length >= 2 ? (
          <div className="lineups-visual">
            <div className="formation-header">
              <div className="team-form-info">
                <img src={lineups[0].team.logo} alt="logo" />
                <span>{lineups[0].formation}</span>
              </div>
              <div className="team-form-info text-right">
                <span>{lineups[1].formation}</span>
                <img src={lineups[1].team.logo} alt="logo" />
              </div>
            </div>

            <div className="pitch-container-mobile-wrap">

              <div className="mobile-team-label home-label">
                <img src={lineups[0].team.logo} alt={lineups[0].team.name} />
                <span>{lineups[0].team.name}</span>
                <span className="formation-badge">{lineups[0].formation}</span>
              </div>

              <div className="pitch-container">
                <FootballField
                  lineup={lineups[0]}
                  teamType="home"
                  events={events}
                  onPlayerClick={(pid) => setModalPlayerId(pid)}
                />
                <FootballField
                  lineup={lineups[1]}
                  teamType="away"
                  events={events}
                  onPlayerClick={(pid) => setModalPlayerId(pid)}
                />
              </div>

              <div className="mobile-team-label away-label">
                <img src={lineups[1].team.logo} alt={lineups[1].team.name} />
                <span>{lineups[1].team.name}</span>
                <span className="formation-badge">{lineups[1].formation}</span>
              </div>

            </div>

            <div className="coach-section">
              <div className="coach-card left">
                <img 
                  src={`https://media.api-sports.io/football/coachs/${lineups[0].coach.id}.png`} 
                  alt={lineups[0].coach.name}
                  className="coach-photo"
                  onError={(e) => { e.target.src = "https://cdn.sofifa.net/player_0.png"; }}
                />
                <span className="coach-name">{lineups[0].coach.name}</span>
              </div>
              
              <div className="coach-label">Coach</div>

              <div className="coach-card right">
                <span className="coach-name">{lineups[1].coach.name}</span>
                <img 
                  src={`https://media.api-sports.io/football/coachs/${lineups[1].coach.id}.png`} 
                  alt={lineups[1].coach.name}
                  className="coach-photo"
                  onError={(e) => { e.target.src = "https://cdn.sofifa.net/player_0.png"; }}
                />
              </div>
            </div>

            <div className="substitutes-section">
              <h3>Substitutes</h3>
              <div className="subs-columns">
                {lineups.map((lineup, idx) => (
                  <div key={idx} className="subs-column">

                    <div className="subs-team-header">
                      <img src={lineup.team.logo} alt={lineup.team.name} />
                      <span>{lineup.team.name}</span>
                    </div>

                    {lineup.substitutes.map((p) => {
                      const evs = getPlayerEvs(p.player.id);
                      const substTime = getSubstTime(p.player.id);
                      const card = getCard(evs);
                      const goalCount = getGoalCount(evs);
                      const assistCount = getAssistCount(evs);
                      const didPlay = substTime !== null;

                      return (
                        <div
                          key={p.player.id}
                          className={`sub-player-row ${didPlay ? "sub-played" : ""}`}
                          onClick={() => setModalPlayerId(p.player.id)}
                        >
                          <div className="sub-photo-wrap">
                            <img
                              src={`https://media.api-sports.io/football/players/${p.player.id}.png`}
                              alt={p.player.name}
                              onError={(e) => { e.target.src = "https://cdn.sofifa.net/player_0.png"; }}
                            />
                          </div>

                          <span className="sub-number">{p.player.number}</span>

                          <div className="sub-info">
                            <span className="sub-name">{p.player.name}</span>
                            <span className="sub-pos">
                              {getPositionLabel(p.player.pos)}
                            </span>
                          </div>

                          <div className="sub-events">
                            {card === "yellow" && <span className="sub-card sub-card-yellow" />}
                            {card === "red" && <span className="sub-card sub-card-red" />}
                            {assistCount > 0 && (
                              <span className="sub-event-icon">👟</span>
                            )}
                            {goalCount > 0 && (
                              <span className="sub-event-icon">
                                ⚽{goalCount > 1 ? `×${goalCount}` : ""}
                              </span>
                            )}
                          </div>

                          {didPlay ? (
                            <div className="sub-time-block">
                              <span className="sub-time">{substTime}'</span>
                              <span className="sub-arrow-in">→</span>
                            </div>
                          ) : (
                            <div className="sub-time-block sub-did-not-play">
                              <span className="sub-dnp">—</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>Tactical lineups are not available for this match.</p>
        )}

      </div>

      {modalPlayerId && (
        <PlayerMatchStatsModal
          playerId={modalPlayerId}
          fixtureId={id}
          onClose={() => setModalPlayerId(null)}
        />
      )}

    </motion.div>

  );
}

export default MatchDetailsPage;