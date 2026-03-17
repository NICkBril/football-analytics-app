import matches from "../data/matches.json";

function MatchesPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Matches</h1>

      {matches.map((match) => (
        <div key={match.id} style={{ marginBottom: "15px" }}>
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