import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import { getStandings, getMatches } from "../api/footballApi";
import Skeleton from "../components/Skeleton";
import "../styles/Table.css";

import { PriorityQueue } from "../utils/priorityQueue";

function TablePage() {
  
  const navigate = useNavigate();
  const [standings, setStandings] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "points", direction: "desc" });

  const [topMatches, setTopMatches] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [standingsData, matchesData] = await Promise.all([
        getStandings(),
        getMatches()
      ]);
      
      setStandings(standingsData || []);
      setAllMatches(matchesData || []);

      // ============================================================
      // START: LAB 4
      // ============================================================
      const queue = new PriorityQueue();

      (matchesData || []).forEach((match) => {
        const homeGoals = match.goals.home ?? 0;
        const awayGoals = match.goals.away ?? 0;
        const totalGoals = homeGoals + awayGoals;
        
        queue.enqueue(match, totalGoals);
      });

      const top = [];
      for (let i = 0; i < 3 && queue.size > 0; i++) {
        top.push(queue.dequeue("highest"));
      }
      setTopMatches(top);
      // END: LAB 4

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

  const getTeamRecentMatches = (teamId) => {
    return allMatches
      .filter(m => m.teams.home.id === teamId || m.teams.away.id === teamId)
      .sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date))
      .slice(0, 5);
  };

  const renderForm = (teamId) => {
    const recentMatches = getTeamRecentMatches(teamId);
    
    if (recentMatches.length === 0) return null;
    
    return (
      <div className="form-container">
        {recentMatches.reverse().map((match) => {
          const isHome = match.teams.home.id === teamId;
          const goalsHome = match.goals.home;
          const goalsAway = match.goals.away;
          
          let result = "D";
          if (isHome) {
            if (goalsHome > goalsAway) result = "W";
            if (goalsHome < goalsAway) result = "L";
          } else {
            if (goalsAway > goalsHome) result = "W";
            if (goalsAway < goalsHome) result = "L";
          }

          return (
            <span 
              key={match.fixture.id} 
              className={`form-badge form-${result.toLowerCase()} clickable-match-badge`}
              onClick={() => navigate(`/match/${match.fixture.id}`)}
              title={`${match.teams.home.name} ${goalsHome}-${goalsAway} ${match.teams.away.name}`}
            >
              {result}
            </span>
          );
        })}
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
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >

      <h1>Premier League Table</h1>

      {topMatches.length > 0 && (
        <div className="exciting-matches-container">
          <h3>🔥 The best Matches of a season</h3>
          {topMatches.map((match, i) => {
            const homeGoals = match.goals.home ?? 0;
            const awayGoals = match.goals.away ?? 0;
            const totalGoals = homeGoals + awayGoals;

            return (
              <div
                key={match.fixture.id}
                className="exciting-match-card"
                onClick={() => {
                  return navigate(`/match/${match.fixture.id}`);
                }}
              >
                <span className="match-rank">#{i + 1}</span>
                <img src={match.teams.home.logo} alt="logo" className="match-mini-logo" />
                <span className="match-team-name">{match.teams.home.name}</span>
                <strong className="match-score-badge">{match.goals.home} - {match.goals.away}</strong>
                <img src={match.teams.away.logo} alt="logo" className="match-mini-logo" />
                <span className="match-team-name">{match.teams.away.name}</span>
                <span className="match-goals-count">
                  {totalGoals} goals
                </span>
              </div>
            );
          })}
        </div>
      )}

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
              <td className="form-col-data">{renderForm(row.team.id)}</td>
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

    </motion.div>
  );
}

export default TablePage;