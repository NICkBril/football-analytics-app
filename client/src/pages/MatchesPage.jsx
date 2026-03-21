import { useState, useEffect } from "react";
import { getMatches } from "../api/footballApi";
import "../index.css";

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [search, setSearch] = useState("");

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

  const matchOfTheWeek =
    matches.length > 0
      ? matches.reduce((best, current) => {
          const bestGoals = best.goals.home + best.goals.away;
          const currentGoals = current.goals.home + current.goals.away;
          return currentGoals > bestGoals ? current : best;
        })
      : null;

  return (
    <div className="page-container">
      <h1>Matches</h1>

      {matchOfTheWeek && (
        <>
          <h2>🔥 Match of the Week</h2>
          <div className="match-of-week">
            <strong>
              {matchOfTheWeek.teams.home.name} vs{" "}
              {matchOfTheWeek.teams.away.name}
            </strong>

            <div>
              Score: {matchOfTheWeek.goals.home} -{" "}
              {matchOfTheWeek.goals.away}
            </div>

            <div>Date: {matchOfTheWeek.fixture.date}</div>
          </div>
        </>
      )}

      <h2>Search Matches</h2>

      <input
        type="text"
        placeholder="Search by team..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>All Matches</h2>

      {filteredMatches.map((match) => (
        <div key={match.fixture.id} className="match-card">
          <strong>
            {match.teams.home.name} vs {match.teams.away.name}
          </strong>

          <div>
            Score: {match.goals.home} - {match.goals.away}
          </div>

          <div>Date: {match.fixture.date}</div>
        </div>
      ))}
    </div>
  );
}

export default MatchesPage;