import { useEffect, useState } from "react";
import { getStandings } from "../api/footballApi";
import "../index.css";

function TablePage() {

  const [table, setTable] = useState([]);

  useEffect(() => {
    async function loadTable() {
      const data = await getStandings();
      setTable(data);
    }

    loadTable();
  }, []);

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

    </div>
  );
}

export default TablePage;