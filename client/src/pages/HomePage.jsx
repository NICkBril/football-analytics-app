import { motion } from "framer-motion";
import "../styles/layout.css";

function HomePage() {
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