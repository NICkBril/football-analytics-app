import { useState, useEffect } from "react";
import { getMatches } from "../api/footballApi";
import "../index.css";

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [search, setSearch] = useState("");
  const [openRound, setOpenRound] = useState(null);

  useEffect(() => {
    async function loadMatches() {
      const data = await getMatches();
      setMatches(data);
    }

    loadMatches();
  }, []);

  const filteredMatches = matches.filter(
    (m) =>
      m.teams.home.name.toLowerCase().includes(search.toLowerCase()) ||
      m.teams.away.name.toLowerCase().includes(search.toLowerCase())
  );

  const matchesByRound = filteredMatches.reduce((acc, match) => {
    const roundNumber = match.league.round.split("-")[1].trim();
    const round = `Round ${roundNumber}`;

    if (!acc[round]) {
      acc[round] = [];
    }

    acc[round].push(match);

    return acc;
  }, {});

  const toggleRound = (round) => {
    setOpenRound(openRound === round ? null : round);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="page-container">
      <h1>Matches</h1>

      <input
        type="text"
        placeholder="Search by team..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {Object.entries(matchesByRound).map(([round, matches]) => {
        const matchesByDate = matches.reduce((acc, match) => {
          const date = formatDate(match.fixture.date);

          if (!acc[date]) {
            acc[date] = [];
          }

          acc[date].push(match);

          return acc;
        }, {});

        return (
          <div key={round}>
            <div
              className="round-header"
              onClick={() => toggleRound(round)}
            >
              {round} {openRound === round ? "▲" : "▼"}
            </div>

            {openRound === round &&
              Object.entries(matchesByDate).map(([date, dateMatches]) => (
                <div key={date} className="date-group">

                  <div className="date-header">
                    {date}
                  </div>

                  {dateMatches.map((match) => (
                    <div key={match.fixture.id} className="match-card">

                      <div className="match-row">

                        <div className="team-home">
                          <span>{match.teams.home.name}</span>
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
                          <span>{match.teams.away.name}</span>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}

export default MatchesPage;