import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/layout.css";
import { favoritesEmitter } from "../utils/eventEmitter";

function HomePage() {
  const navigate = useNavigate();

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
      style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }}
    >
      
      <div style={{ 
        textAlign: "center", 
        marginBottom: "40px", 
        marginTop: "20px",
        background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
        padding: "40px 20px",
        borderRadius: "16px",
        color: "#fff",
        boxShadow: "0 4px 15px rgba(44, 62, 80, 0.15)"
      }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "12px", color: "#fff", margin: 0 }}>
          ⚽ Football Analytics App
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "650px", margin: "12px auto 0", lineHeight: "1.6" }}>
          Explore the English Premier League season — teams, matches,
          player stats, and live standings all in one comprehensive analytical platform.
        </p>
      </div>

      {/* LAB 7 Notification */}
      {lastFavAction && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginBottom: "32px",
            padding: "14px 20px",
            borderRadius: "10px",
            border: "1px solid",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            backgroundColor: lastFavAction.action === "added" ? "#fffbe6" : "#fdf2f2",
            borderColor: lastFavAction.action === "added" ? "#ffe58f" : "#f5c6cb",
            color: lastFavAction.action === "added" ? "#b78103" : "#9c2424"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>
              {lastFavAction.action === "added" ? "⭐" : "❌"}
            </span>
            <span>
              <strong>System Broadcast (Lab 7):</strong>{" "}
              {lastFavAction.action === "added" ? "Added" : "Removed"}{" "}
              <strong style={{ textDecoration: "underline" }}>{lastFavAction.team}</strong>{" "}
              {lastFavAction.action === "added" ? "to" : "from"} preferences.
            </span>
          </div>
          <div style={{ 
            fontWeight: "600", 
            fontSize: "12px", 
            padding: "4px 10px", 
            borderRadius: "12px", 
            background: "rgba(0,0,0,0.04)" 
          }}>
            Favorites: {lastFavAction.all.length}
          </div>
        </motion.div>
      )}


      <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "#2c3e50" }}>Quick Navigation</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {[
          {
            icon: "🏆",
            title: "League Table",
            desc: "Full standings with form indicators, goal difference and qualification zone highlights.",
            path: "/table",
            color: "#1abc9c"
          },
          {
            icon: "⚽",
            title: "Matches & Fixtures",
            desc: "All 380 campaign fixtures grouped by round with detailed tactical stats.",
            path: "/matches",
            color: "#3498db"
          },
          {
            icon: "🏟️",
            title: "Teams",
            desc: "All 20 Premier League clubs with detailed squads, rosters and history.",
            path: "/teams",
            color: "#9b59b6"
          },
        ].map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            style={{
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid #eaedf1",
              backgroundColor: "#ffffff",
              cursor: "pointer",
              transition: "all 0.25s ease-in-out",
              boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#eaedf1";
            }}
          >
            <div style={{ 
              fontSize: "32px", 
              marginBottom: "12px",
              background: `rgba(${card.color === "#1abc9c" ? "26,188,156" : card.color === "#3498db" ? "52,152,219" : "155,89,182"}, 0.1)`,
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px"
            }}>{card.icon}</div>
            <div style={{ fontWeight: "600", fontSize: "18px", marginBottom: "8px", color: "#2c3e50" }}>{card.title}</div>
            <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
              {card.desc}
            </div>
          </div>
        ))}
      </div>


      <div style={{ 
        marginBottom: "40px", 
        backgroundColor: "#fcfdfd", 
        padding: "30px", 
        borderRadius: "14px",
        border: "1px solid #eaedf1" 
      }}>
        <h2 style={{ fontSize: "20px", marginTop: 0, marginBottom: "20px", color: "#2c3e50" }}>What You Can Do</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {[
            { icon: "📊", title: "Analyze Table", text: "View full standings and dynamically sort by any match metric." },
            { icon: "⭐", text: "Save favorite teams — state persists smoothly across your active browser sessions.", title: "Personalize Feed" },
            { icon: "🔍", text: "Search match events by team names and seamlessly browse through tournament rounds.", title: "Advanced Search" },
            { icon: "🗂️", text: "Open any fixture card for detailed live tactical formations, timelines and event logs.", title: "Match Center" },
            { icon: "👤", text: "Explore profiles containing season appearance statistics and professional history.", title: "Player Stats" },
            { icon: "🔥", text: "Instantly filter and see the most high-scoring and exciting matches of the iteration.", title: "Highlights" },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "18px", marginTop: "2px" }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px", color: "#34495e", marginBottom: "2px" }}>{item.title}</div>
                <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.5" }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div style={{
        padding: "24px",
        borderRadius: "14px",
        border: "1px solid #eaedf1",
        backgroundColor: "#ffffff",
        fontSize: "13px",
        color: "#666",
        lineHeight: "1.7",
        boxShadow: "0 2px 6px rgba(0,0,0,0.01)"
      }}>
        <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "10px", color: "#2c3e50" }}>
          About This Project
        </div>
        Real-time analytical data is fetched directly from the enterprise-grade{" "}
        <a href="https://www.api-football.com/" target="_blank" rel="noreferrer" style={{ color: "#3498db", textDecoration: "none", fontWeight: "500" }}>
          API-Football
        </a>{" "}
        layer and cached client-side for 24 hours to balance pipeline utilization. The framework covers 
        the complete 2023/24 Premier League campaign.
        <br /><br />
        <div style={{ 
          borderTop: "1px solid #f1f2f6", 
          paddingTop: "14px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <div>
            Built as a university coursework project at <strong>Kyiv Polytechnic Institute</strong>
          </div>
        </div>
        <div style={{ marginTop: "8px" }}>
          Developer: <a href="mailto:NickBril.ua@gmail.com" style={{ color: "#3498db", textDecoration: "none", fontWeight: "500" }}>Mykola Bril</a>
        </div>
      </div>

    </motion.div>
  );
}

export default HomePage;