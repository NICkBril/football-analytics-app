import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMatchStatistics } from "../api/footballApi";
import "../styles/MatchDetails.css";

function MatchDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadStats() {
      setLoading(true);
      const data = await getMatchStatistics(id);
      setStats(data);
      setLoading(false);
    }

    loadStats();

  }, [id]);

  if (loading) {
    return <p className="page-container">Loading match statistics...</p>;
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="page-container">
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>
        <p>No detailed statistics available for this match.</p>
      </div>
    );
  }

  const team1 = stats[0];
  const team2 = stats[1];

  function getStatValue(teamStats, type) {
    const stat = teamStats.statistics.find((s) => s.type === type);
    return stat ? stat.value : 0;
  }

  const allStatTypes = team1.statistics.map((s) => s.type);

  return (

    <div className="page-container">

      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Matches
      </button>

      <div className="match-stats-header">

        <div className="stat-team">
          <img src={team1.team.logo} alt={team1.team.name} />
          <h2>{team1.team.name}</h2>
        </div>

        <div className="vs-badge">VS</div>

        <div className="stat-team">
          <img src={team2.team.logo} alt={team2.team.name} />
          <h2>{team2.team.name}</h2>
        </div>

      </div>

      <div className="stats-container">

        {allStatTypes.map((type) => {

          const val1 = getStatValue(team1, type) || 0;
          const val2 = getStatValue(team2, type) || 0;

          const num1 = parseFloat(val1);
          const num2 = parseFloat(val2);
          const total = num1 + num2;
          const percentage = total === 0 ? 50 : (num1 / total) * 100;

          return (

            <div key={type} className="stat-item">

              <div className="stat-info">
                <span>{val1}</span>
                <span className="stat-name">{type}</span>
                <span>{val2}</span>
              </div>

              <div className="stat-bar-bg">
                <div 
                  className="stat-bar-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

            </div>

          );

        })}

      </div>

    </div>

  );
}

export default MatchDetailsPage;