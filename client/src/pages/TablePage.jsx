import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStandings } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import "../styles/Table.css";

function TablePage() {
  
  const navigate = useNavigate();
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "points", direction: "desc" });

  useEffect(() => {
    async function loadData() {
      const data = await getStandings();
      setStandings(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const requestSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedStandings = () => {
    const sortableItems = [...standings];
    return sortableItems.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "win": aValue = a.all.win; bValue = b.all.win; break;
        case "draw": aValue = a.all.draw; bValue = b.all.draw; break;
        case "lose": aValue = a.all.lose; bValue = b.all.lose; break;
        case "goalsDiff": aValue = a.goalsDiff; bValue = b.goalsDiff; break;
        case "points":
        default: aValue = a.points; bValue = b.points;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const getClassByRank = (rank) => {
    if (rank <= 4) return "cl-zone";
    if (rank === 5) return "el-zone";
    if (rank === 6) return "conf-zone";
    if (rank >= 18) return "rel-zone";
    return "";
  };

  const renderForm = (formString) => {
    if (!formString) return null;
    return (
      <div className="form-container">
        {formString.split('').reverse().map((char, index) => (
          <span key={index} className={`form-badge form-${char.toLowerCase()}`}>
            {char}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <Skeleton type="title" />
        <div style={{ marginTop: '20px' }}>
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} type="text" /> 
          ))}
        </div>
      </div>
    );
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
            <th onClick={() => requestSort("win")} className="sortable-header">
              W {sortConfig.key === "win" && (sortConfig.direction === "desc" ? "▼" : "▲")}
            </th>
            <th onClick={() => requestSort("draw")} className="sortable-header">
              D {sortConfig.key === "draw" && (sortConfig.direction === "desc" ? "▼" : "▲")}
            </th>
            <th onClick={() => requestSort("lose")} className="sortable-header">
              L {sortConfig.key === "lose" && (sortConfig.direction === "desc" ? "▼" : "▲")}
            </th>
            <th onClick={() => requestSort("goalsDiff")} className="sortable-header">
              GD {sortConfig.key === "goalsDiff" && (sortConfig.direction === "desc" ? "▼" : "▲")}
            </th>
            <th onClick={() => requestSort("points")} className="sortable-header">
              Pts {sortConfig.key === "points" && (sortConfig.direction === "desc" ? "▼" : "▲")}
            </th>
            <th className="form-col-header">Form</th>
          </tr>
        </thead>

        <tbody>
          {getSortedStandings().map((row) => (
            <tr 
              key={row.team.id} 
              className={`table-row ${getClassByRank(row.rank)}`}
            >
              <td>{row.rank}</td>
              <td className="table-team clickable-team" onClick={() => navigate(`/team/${row.team.id}`)}>
                <img src={row.team.logo} className="table-logo" alt="logo" />
                {row.team.name}
              </td>
              <td>{row.all.played}</td>
              <td>{row.all.win}</td>
              <td>{row.all.draw}</td>
              <td>{row.all.lose}</td>
              <td>{row.goalsDiff}</td>
              <td>{row.points}</td>
              <td className="form-col-data">{renderForm(row.form)}</td>
            </tr>
          ))}

        </tbody>

      </table>

      <div className="legend-container">
        <div className="legend-item"><span className="dot cl"></span> Champions League</div>
        <div className="legend-item"><span className="dot el"></span> Europa League</div>
        <div className="legend-item"><span className="dot conf"></span> Conference League</div>
        <div className="legend-item"><span className="dot rel"></span> Relegation</div>
      </div>

    </div>
  );
}

export default TablePage;