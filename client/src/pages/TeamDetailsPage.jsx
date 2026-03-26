import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTeams } from "../api/footballApi";
import "../index.css";

function TeamDetailsPage() {
  const { id } = useParams();

  const [team, setTeam] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  useEffect(() => {
    async function loadTeam() {
      const data = await getTeams();

      const foundTeam = data.find(
        (item) => item.team.id.toString() === id
      );

      setTeam(foundTeam?.team);
    }

    loadTeam();
  }, [id]);

  if (!team) {
    return <p className="page-container">Loading team data...</p>;
  }

  return (
    <div className="page-container">
      <h1>{team.name}</h1>

      <div className="team-details">

        <img
          src={team.logo}
          alt={team.name}
          className="team-details-logo"
        />

        <div className="team-details-info">
          <p><strong>Country:</strong> {team.country}</p>
          <p><strong>Founded:</strong> {team.founded}</p>
          <p><strong>Code:</strong> {team.code}</p>
        </div>
      </div>

      <div className="team-tabs">
        <button
          className={activeTab === "overview" ? "tab active" : "tab"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          className={activeTab === "matches" ? "tab active" : "tab"}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>

        <button
          className={activeTab === "standings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("standings")}
        >
          Standings
        </button>

        <button
          className={activeTab === "squad" ? "tab active" : "tab"}
          onClick={() => setActiveTab("squad")}
        >
          Squad
        </button>

      </div>

      <div className="team-tab-content">

        {activeTab === "overview" && (

          <div className="team-overview">

            <h2>Overview</h2>

            <p><strong>Country:</strong> {team.country}</p>
            <p><strong>Founded:</strong> {team.founded}</p>
            <p><strong>Code:</strong> {team.code}</p>

            <h3>Last lineup</h3>
            <p>...</p>

          </div>

        )}

        {activeTab === "matches" && (

          <div>
            <h2>Matches</h2>
            <p>...</p>
          </div>

        )}

        {activeTab === "standings" && (

          <div>
            <h2>Standings</h2>
            <p>...</p>
          </div>

        )}

        {activeTab === "squad" && (

          <div>
            <h2>Squad</h2>
            <p>...</p>
          </div>

        )}

      </div>

    </div>
  );
}

export default TeamDetailsPage;