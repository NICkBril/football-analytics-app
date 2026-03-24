import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import MatchesPage from "./pages/MatchesPage";
import TablePage from "./pages/TablePage";
import TeamDetailsPage from "./pages/TeamDetailsPage";

import Footer from "./components/Footer";

import "./index.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        
        <nav>
          <a href="/">Home</a>
          <a href="/teams">Teams</a>
          <a href="/matches">Matches</a>
          <a href="/table">Table</a>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/table" element={<TablePage />} />

            {/* нова сторінка */}
            <Route path="/team/:id" element={<TeamDetailsPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;