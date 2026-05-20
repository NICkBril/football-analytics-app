import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/layout.css";
import { favoritesEmitter } from "../utils/eventEmitter";

function HomePage() {
  // ============================================================
  // START: LAB 7
  // ============================================================
  const [lastFavAction, setLastFavAction] = useState(null);

  useEffect(() => {
    function handleFavoritesChanged(data) {
      setLastFavAction(data);
    }

    favoritesEmitter.on("favoritesChanged", handleFavoritesChanged);

    return () => {
      favoritesEmitter.off("favoritesChanged", handleFavoritesChanged);
    };
  }, []);
  // END: LAB 7

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>⚽ Football Analytics App</h1>

      <p>
        This application allows you to explore English Premier League teams,
        view match results, and analyze football statistics.
      </p>

      {lastFavAction && (
        <div style={{
          marginTop: "16px",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "14px",
          backgroundColor: lastFavAction.action === "added" ? "#fffbe6" : "#fdf2f2",
          borderColor: lastFavAction.action === "added" ? "gold" : "#f5c6cb"
        }}>
          {lastFavAction.action === "added" ? "⭐ Added:" : "❌ Removed:"}{" "}
          <strong>{lastFavAction.team}</strong>
          {" "}· Total favorites: {lastFavAction.all.length}
        </div>
      )}

      <h2>Features:</h2>
      <ul>
        <li>📊 View all EPL teams</li>
        <li>⭐ Add favorite teams</li>
        <li>🔥 Match of the week</li>
        <li>📅 Browse matches</li>
      </ul>

    </motion.div>
  );
}

export default HomePage;