import matches from "../data/matches.json";
import "../index.css"; // підключаємо CSS

function MatchesPage() {
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

      <h2>All Matches</h2>
      {matches.map((match) => (
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