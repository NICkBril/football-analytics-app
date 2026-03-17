import { useState } from "react";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";

function App() {
  const [page, setPage] = useState("teams");

  return (
    <div>
      <nav style={{ padding: "20px" }}>
        <button onClick={() => setPage("teams")}>Teams</button>
        <button onClick={() => setPage("matches")}>Matches</button>
      </nav>

      {page === "teams" && <TeamsPage />}
      {page === "matches" && <MatchesPage />}
    </div>
  );
}

export default App;