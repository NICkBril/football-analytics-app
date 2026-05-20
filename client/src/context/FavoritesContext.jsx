import { createContext, useState, useEffect } from "react";
import { favoritesEmitter } from "../utils/eventEmitter";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(teamName) {
    const isAlreadyFavorite = favorites.includes(teamName);
    const nextFavorites = isAlreadyFavorite
      ? favorites.filter((t) => { return t !== teamName; })
      : [...favorites, teamName];

    setFavorites(nextFavorites);

    // ============================================================
    // START: LAB 7
    // ============================================================
    favoritesEmitter.emit("favoritesChanged", {
      team: teamName,
      action: isAlreadyFavorite ? "removed" : "added",
      all: nextFavorites,
    });
    // END: LAB 7
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}