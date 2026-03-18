import { useState } from "react";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app-container">
      <nav style={{ padding: "20px" }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("teams")}>Teams</button>
        <button onClick={() => setPage("matches")}>Matches</button>
      </nav>

      <div className="content">
        {page === "home" && <HomePage />}
        {page === "teams" && <TeamsPage />}
        {page === "matches" && <MatchesPage />}
      </div>

      <Footer />
    </div>
  );
}

export default App;