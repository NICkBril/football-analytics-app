import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getMatches } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import "../styles/Matches.css";

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [openRound, setOpenRound] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMatches() {
      const data = await getMatches();
      setMatches(data);
      setLoading(false);
    }

    loadMatches();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <Skeleton type="title" />
        <div style={{ marginBottom: "20px" }}>
           <Skeleton type="text" /> {/* Імітація інпуту пошуку */}
        </div>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} type="card" />
        ))}
      </div>
    );
  }

  const filteredMatches = matches.filter(
    (m) =>
      m.teams.home.name.toLowerCase().includes(search.toLowerCase()) ||
      m.teams.away.name.toLowerCase().includes(search.toLowerCase())
  );

  const matchesByRound = filteredMatches.reduce((acc, match) => {
    const roundParts = match.league.round.split("-");
    const roundNumber = roundParts[1] ? roundParts[1].trim() : "0";
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
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
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
                    <div 
                      key={match.fixture.id} 
                      className="match-card clickable-match"
                      onClick={() => navigate(`/match/${match.fixture.id}`)}
                    >

                      <div className="match-row">

                        <div
                          className="team-home clickable-team"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/team/${match.teams.home.id}`);
                          }}
                        >
                          <span>{match.teams.home.name}</span>
                          <img
                            src={match.teams.home.logo}
                            className="match-logo"
                            alt="logo"
                          />
                        </div>

                        <div className="match-score">
                          {match.goals.home} - {match.goals.away}
                        </div>

                        <div
                          className="team-away clickable-team"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/team/${match.teams.away.id}`);
                          }}
                        >
                          <img
                            src={match.teams.away.logo}
                            className="match-logo"
                            alt="logo"
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
    </motion.div>
  );
}

export default MatchesPage;