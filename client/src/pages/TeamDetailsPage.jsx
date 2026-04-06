import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { getTeams, getMatches, getStandings, getSquad } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import "../styles/TeamDetails.css";

function TeamDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [squad, setSquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSquad, setLoadingSquad] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All");

  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const isFavorite = team && favorites.includes(team.name);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName }, { replace: true });
  };

  useEffect(() => {

    async function loadData() {
      setLoading(true);

      const teamsData = await getTeams();

      const foundTeam = teamsData.find(
        (item) => item.team.id.toString() === id
      );

      setTeam(foundTeam?.team);

      const matchesData = await getMatches();
      setMatches(matchesData);

      const standingsData = await getStandings();
      setStandings(standingsData);

      setLoading(false);
    }

    loadData();

  }, [id]);

  useEffect(() => {

    if (activeTab === "squad" && id) {

      async function loadSquadData() {
        setLoadingSquad(true);
        const squadData = await getSquad(id);
        setSquad(squadData);
        setLoadingSquad(false);
      }

      loadSquadData();

    }

  }, [id, activeTab]);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <Skeleton type="avatar" />
          <div style={{ flex: 1 }}>
            <Skeleton type="title" />
            <Skeleton type="text" />
          </div>
        </div>
        <Skeleton type="card" />
        <Skeleton type="card" />
      </div>
    );
  }

  if (!team) {
    return <p className="page-container">Team not found.</p>;
  }

  const filteredSquad = squad.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition === "All" || player.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

  function getMatchResult(match) {

    const isHome = match.teams.home.id.toString() === id;

    const teamGoals = isHome ? match.goals.home : match.goals.away;
    const opponentGoals = isHome ? match.goals.away : match.goals.home;

    if (teamGoals > opponentGoals) return "W";
    if (teamGoals < opponentGoals) return "L";

    return "D";
  }

  const teamMatches = matches.filter(
    (m) =>
      m.teams.home.id.toString() === id ||
      m.teams.away.id.toString() === id
  );

  const lastMatches = [...teamMatches]
    .sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date))
    .slice(0, 10);

  function getCountryCode(country) {

    const map = {
      England: "gb",
      Spain: "es",
      Germany: "de",
      Italy: "it",
      France: "fr",
    };

    return map[country] || "gb";
  }

  const positions = [
    { key: "Goalkeeper", title: "Goalkeepers" },
    { key: "Defender", title: "Defenders" },
    { key: "Midfielder", title: "Midfielders" },
    { key: "Attacker", title: "Attackers" }
  ];

  return (

    <div className="page-container">

      <div className="team-header">

        <h1>{team.name}</h1>

        <button
          className={`team-fav-button ${isFavorite ? "remove" : "add"}`}
          onClick={() => toggleFavorite(team.name)}
        >
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </button>

      </div>

      <div className="team-details">

        <img
          src={team.logo}
          alt={team.name}
          className="team-details-logo"
        />

        <div className="team-details-info">
          <p className="team-country">

            <img
              src={`https://flagcdn.com/w40/${getCountryCode(team.country)}.png`}
              className="country-flag"
              alt="flag"
            />

            {team.country}

          </p>
          <p><strong>Founded:</strong> {team.founded}</p>
          <p><strong>Code:</strong> {team.code}</p>
        </div>
      </div>

      <div className="team-tabs">
        <button
          className={activeTab === "overview" ? "tab active" : "tab"}
          onClick={() => handleTabChange("overview")}
        >
          Overview
        </button>

        <button
          className={activeTab === "matches" ? "tab active" : "tab"}
          onClick={() => handleTabChange("matches")}
        >
          Matches
        </button>

        <button
          className={activeTab === "standings" ? "tab active" : "tab"}
          onClick={() => handleTabChange("standings")}
        >
          Standings
        </button>

        <button
          className={activeTab === "squad" ? "tab active" : "tab"}
          onClick={() => handleTabChange("squad")}
        >
          Squad
        </button>

      </div>

      <div className="team-tab-content">

        {activeTab === "overview" && (

          <div>

            <h2>Overview</h2>

            <p><strong>Country:</strong> {team.country}</p>
            <p><strong>Founded:</strong> {team.founded}</p>
            <p><strong>Code:</strong> {team.code}</p>
                        
            <h3>Team form</h3>
            <div className="team-form">
              {lastMatches.map((match) => {
                const result = getMatchResult(match);
                return (
                  <span
                    key={match.fixture.id}
                    className={`form-badge ${result} clickable-match`}
                    onClick={() => navigate(`/match/${match.fixture.id}`)}
                    title="View match details"
                  >
                    {result}
                  </span>
                );
              })}
            </div>

            <h3>Last lineup</h3>
            <p>...</p>

          </div>

        )}

        {activeTab === "matches" && (

          <div>
            <h2>Matches</h2>

            {teamMatches.map((match) => (

              <div 
                key={match.fixture.id} 
                className="match-card clickable-match"
                onClick={() => navigate(`/match/${match.fixture.id}`)}
              >

                <div className="match-header">
                  {new Date(match.fixture.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="match-row">

                  <div className="team-home">

                    <span
                      className="clickable-team"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/team/${match.teams.home.id}`);
                      }}
                    >
                      {match.teams.home.name}
                    </span>
                    <img src={match.teams.home.logo} className="match-logo" alt="logo" />
                  </div>

                  <div className="match-score">
                    {match.goals.home} - {match.goals.away}
                  </div>

                  <div className="team-away">
                    <img src={match.teams.away.logo} className="match-logo" alt="logo" />
                    <span
                      className="clickable-team"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/team/${match.teams.away.id}`);
                      }}
                    >
                      {match.teams.away.name}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {activeTab === "standings" && (

          <div>
            <h2>Standings</h2>

            <table className="league-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>

              <tbody>

                {standings.map((row) => (

                  <tr
                    key={row.team.id}
                    className={
                      row.team.id.toString() === id
                        ? "highlight-team"
                        : ""
                    }
                  >

                    <td>{row.rank}</td>

                    <td
                      className="table-team clickable-team"
                      onClick={() => navigate(`/team/${row.team.id}`)}
                    >

                      <img
                        src={row.team.logo}
                        className="table-logo"
                        alt="logo"
                      />

                      {row.team.name}
                    </td>

                    <td>{row.all.played}</td>
                    <td>{row.all.win}</td>
                    <td>{row.all.draw}</td>
                    <td>{row.all.lose}</td>
                    <td>{row.goalsDiff}</td>
                    <td>{row.points}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {activeTab === "squad" && (

          <div>
            <h2>Squad</h2>

            <div className="squad-filters" style={{ marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
              
              <input 
                type="text" 
                placeholder="Search player..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: "1", minWidth: "200px" }}
              />

              <select 
                value={selectedPosition} 
                onChange={(e) => setSelectedPosition(e.target.value)}
                style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ddd" }}
              >
                <option value="All">All Positions</option>
                <option value="Goalkeeper">Goalkeepers</option>
                <option value="Defender">Defenders</option>
                <option value="Midfielder">Midfielders</option>
                <option value="Attacker">Attackers</option>
              </select>

            </div>
            
            {loadingSquad ? (
              <div className="squad-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "20px" }}>
                {[...Array(8)].map((_, i) => <Skeleton key={i} type="card" />)}
              </div>
            ) : (
              <div className="squad-sections">
                
                {positions.map((pos) => {
                  const players = filteredSquad.filter(p => p.position === pos.key);
                  
                  if (players.length === 0) return null;

                  return (
                    <div key={pos.key} className="squad-category">
                      
                      <h3 className="position-title">{pos.title}</h3>
                      
                      <div className="squad-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                        
                        {players.map((player) => (
                          
                          <div 
                            key={player.id} 
                            className="player-card clickable-player" 
                            style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px", textAlign: "center", cursor: "pointer" }}
                            onClick={() => navigate(`/player/${player.id}`)}
                          >
                            
                            <img 
                              src={player.photo} 
                              alt={player.name} 
                              style={{ width: "100%", borderRadius: "8px" }}
                            />
                            
                            <div style={{ marginTop: "10px" }}>
                              <span style={{ fontSize: "12px", color: "#3498db", fontWeight: "bold" }}>#{player.number || "N/A"}</span>
                              <p style={{ margin: "5px 0", fontWeight: "600" }}>{player.name}</p>
                            </div>

                          </div>

                        ))}

                      </div>

                    </div>
                  );
                })}

                {filteredSquad.length === 0 && (
                  <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
                    No players found matching your criteria.
                  </p>
                )}

              </div>
            )}

          </div>

        )}

      </div>

    </div>

  );
}

export default TeamDetailsPage;