import { useState } from "react";
import matches from "../data/matches.json";
import "../index.css";

function MatchesPage() {
  const [search, setSearch] = useState("");

  const filteredMatches = matches
    .filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
        m.awayTeam.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const matchOfTheWeek = matches.reduce((best, current) => {
    const bestGoals = best.homeScore + best.awayScore;
    const currentGoals = current.homeScore + current.awayScore;
    return currentGoals > bestGoals ? current : best;
  });

  return (
    <div className="page-container">
      <h1>Matches</h1>

      <h2>🔥 Match of the Week</h2>
      <div className="match-of-week">
        <strong>
          {matchOfTheWeek.homeTeam} vs {matchOfTheWeek.awayTeam}
        </strong>
        <div>
          Score: {matchOfTheWeek.homeScore} - {matchOfTheWeek.awayScore}
        </div>
        <div>Date: {matchOfTheWeek.date}</div>
      </div>

      <h2>Search Matches</h2>
      <input
        type="text"
        placeholder="Search by team..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "15px", padding: "5px", width: "200px" }}
      />

      <h2>All Matches</h2>
      {filteredMatches.map((match) => (
        <div key={match.id} className="match-card">
          <strong>
            {match.homeTeam} vs {match.awayTeam}
          </strong>
          <div>
            Score: {match.homeScore} - {match.awayScore}
          </div>
          <div>Date: {match.date}</div>
        </div>
      ))}
    </div>
  );
}

export default MatchesPage;