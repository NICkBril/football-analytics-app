const API_KEY = import.meta.env.VITE_API_KEY;

const options = {
  method: "GET",
  headers: {
    "x-apisports-key": API_KEY
  }
};

const BASE_URL = "https://v3.football.api-sports.io";

function getCachedData(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const parsed = JSON.parse(cached);

  const now = new Date().getTime();

  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (now - parsed.timestamp > ONE_DAY) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.data;
}

function setCachedData(key, data) {
  const value = {
    data: data,
    timestamp: new Date().getTime()
  };

  localStorage.setItem(key, JSON.stringify(value));
}

export async function getTeams() {
  const cached = getCachedData("teams");
  if (cached) return cached;

  try {

    const response = await fetch(
      `${BASE_URL}/teams?league=39&season=2023`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch teams");
    }

    const data = await response.json();
    const teams = data.response;

    setCachedData("teams", teams);

    return teams;

  } catch (error) {

    console.error("Error loading teams:", error);
    return [];

  }

}

export async function getMatches() {
  const cached = getCachedData("matches");
  if (cached) return cached;

  try {

    const response = await fetch(
      `${BASE_URL}/fixtures?league=39&season=2023`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch matches");
    }

    const data = await response.json();
    const matches = data.response;

    setCachedData("matches", matches);

    return matches;

  } catch (error) {

    console.error("Error loading matches:", error);
    return [];

  }

}

export async function getStandings() {
  const cached = getCachedData("standings");
  if (cached) return cached;

  try {

    const response = await fetch(
      `${BASE_URL}/standings?league=39&season=2023`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch standings");
    }

    const data = await response.json();
    const standings = data.response[0].league.standings[0];

    setCachedData("standings", standings);

    return standings;

  } catch (error) {

    console.error("Error loading standings:", error);
    return [];

  }

}

export async function getSquad(teamId) {
  const cacheKey = `squad_${teamId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {

    const response = await fetch(
      `${BASE_URL}/players/squads?team=${teamId}`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch squad");
    }

    const data = await response.json();
    const squad = data.response[0]?.players || [];

    setCachedData(cacheKey, squad);

    return squad;

  } catch (error) {

    console.error("Error loading squad:", error);
    return [];

  }
}

export async function getMatchStatistics(fixtureId) {
  const cacheKey = `stats_${fixtureId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {

    const response = await fetch(
      `${BASE_URL}/fixtures/statistics?fixture=${fixtureId}`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }

    const data = await response.json();
    const stats = data.response;

    setCachedData(cacheKey, stats);

    return stats;

  } catch (error) {

    console.error("Error loading stats:", error);
    return [];

  }
}