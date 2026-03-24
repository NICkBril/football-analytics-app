import { useEffect, useState } from "react";
import { getStandings } from "../api/footballApi";
import "../index.css";

function TablePage() {

  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTable() {
      const data = await getStandings();
      setTable(data);
      setLoading(false);
    }

    loadTable();
  }, []);

  if (loading) {
    return <p className="page-container">Loading table...</p>;
  }

  return (
    <div className="page-container">

      <h1>Premier League Table</h1>

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

          {table.map((team) => (
            <tr key={team.team.id}>

              <td>{team.rank}</td>

              <td className="table-team">
                <img src={team.team.logo} className="table-logo"/>
                {team.team.name}
              </td>

              <td>{team.all.played}</td>
              <td>{team.all.win}</td>
              <td>{team.all.draw}</td>
              <td>{team.all.lose}</td>
              <td>{team.goalsDiff}</td>
              <td>{team.points}</td>

            </tr>
          ))}

        </tbody>

      </table>

      <div style={{ marginTop: "30px", fontSize: "14px" }}>
        <div>🟢 Champions League</div>
        <div>🟡 Europa League</div>
        <div>🟠 Conference League</div>
        <div>🔴 Relegation</div>
      </div>

    </div>
  );
}

export default TablePage;