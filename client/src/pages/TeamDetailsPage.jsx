import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTeams, getMatches, getStandings } from "../api/footballApi";
import "../index.css";

function TeamDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (teamName) => {
    setFavorites((prev) =>
      prev.includes(teamName)
        ? prev.filter((t) => t !== teamName)
        : [...prev, teamName]
    );
  };

  const isFavorite = team && favorites.includes(team.name);

  useEffect(() => {

    setActiveTab("overview");

    async function loadData() {

      const teamsData = await getTeams();
      const foundTeam = teamsData.find(
        (item) => item.team.id.toString() === id
      );

      setTeam(foundTeam?.team);

      const matchesData = await getMatches();
      setMatches(matchesData);

      const standingsData = await getStandings();
      setStandings(standingsData);

    }

    loadData();

  }, [id]);

  if (!team) {
    return <p className="page-container">Loading team data...</p>;
  }

  function getMatchResult(match) {

    const isHome =
      match.teams.home.id.toString() === id;

    const teamGoals = isHome
      ? match.goals.home
      : match.goals.away;

    const opponentGoals = isHome
      ? match.goals.away
      : match.goals.home;

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
  .sort(
    (a, b) =>
      new Date(b.fixture.date) -
      new Date(a.fixture.date)
  )
  .slice(0, 10);

  const formatDate = (dateString) => {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  };

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
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          className={activeTab === "matches" ? "tab active" : "tab"}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>

        <button
          className={activeTab === "standings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("standings")}
        >
          Standings
        </button>

        <button
          className={activeTab === "squad" ? "tab active" : "tab"}
          onClick={() => setActiveTab("squad")}
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
                      className={`form-badge ${result}`}
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

              <div key={match.fixture.id} className="match-card">

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
                      onClick={() => navigate(`/team/${match.teams.home.id}`)}
                    >
                      {match.teams.home.name}
                    </span>

                    <img
                      src={match.teams.home.logo}
                      className="match-logo"
                    />
                  </div>

                  <div className="match-score">
                    {match.goals.home} - {match.goals.away}
                  </div>

                  <div className="team-away">
                    <img
                      src={match.teams.away.logo}
                      className="match-logo"
                    />

                    <span
                      className="clickable-team"
                      onClick={() => navigate(`/team/${match.teams.away.id}`)}
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
            <p>Player list will be added later.</p>
          </div>

        )}

      </div>

    </div>
  );
}

export default TeamDetailsPage;