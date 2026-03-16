import teams from "../data/teams.json";

function TeamsPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>EPL Teams</h1>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <strong>{team.name}</strong> - {team.stadium}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamsPage;