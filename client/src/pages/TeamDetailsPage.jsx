import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTeams } from "../api/footballApi";
import "../index.css";

function TeamDetailsPage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    async function loadTeam() {
      const data = await getTeams();
      const foundTeam = data.find((item) => item.team.id.toString() === id);
      setTeam(foundTeam?.team);
    }

    loadTeam();
  }, [id]);

  if (!team) {
    return <p>Loading team data...</p>;
  }

  return (
    <div className="page-container">
      <h1>{team.name}</h1>

      <div className="team-details">
        <img src={team.logo} alt={team.name} className="team-details-logo" />

        <div className="team-details-info">
          <p><strong>Country:</strong> {team.country}</p>
          <p><strong>Founded:</strong> {team.founded}</p>
          <p><strong>Code:</strong> {team.code}</p>
        </div>
      </div>
    </div>
  );
}

export default TeamDetailsPage;