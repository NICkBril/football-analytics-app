import { useState, useEffect } from "react";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import TablePage from "./pages/TablePage";

function App() {
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? savedPage : "home";
  });

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  return (
    <div className="app-container">
      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("teams")}>Teams</button>
        <button onClick={() => setPage("matches")}>Matches</button>
        <button onClick={() => setPage("table")}>Table</button>
      </nav>

      <div className="content">
        {page === "home" && <HomePage />}
        {page === "teams" && <TeamsPage />}
        {page === "matches" && <MatchesPage />}
        {page === "table" && <TablePage />}
      </div>

      <Footer />
    </div>
  );
}

export default App;