import { useState } from "react";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";
import HomePage from "./pages/HomePage";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      <nav style={{ padding: "20px" }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("teams")}>Teams</button>
        <button onClick={() => setPage("matches")}>Matches</button>
      </nav>

      {page === "home" && <HomePage />}
      {page === "teams" && <TeamsPage />}
      {page === "matches" && <MatchesPage />}
    </div>
  );
}

export default App;