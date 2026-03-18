import "../index.css";

function HomePage() {
  return (
    <div className="page-container">
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

      <footer>
        Football Analytics App © 2026
        <div className="contact-info">
          Email: <a href="mailto:NickBril.ua@gmail.com">NickBril.ua@gmail.com</a> | 
          Telegram: <a href="https://t.me/barankaY">@NickBril</a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;