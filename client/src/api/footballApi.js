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

  if (cached) {
    return cached;
  }

  const response = await fetch(
    `${BASE_URL}/teams?league=39&season=2023`,
    options
  );

  const data = await response.json();

  const teams = data.response;

  setCachedData("teams", teams);

  return teams;
}

export async function getMatches() {
  const cached = getCachedData("matches");

  if (cached) {
    return cached;
  }

  const response = await fetch(
    `${BASE_URL}/fixtures?league=39&season=2023`,
    options
  );

  const data = await response.json();

  const matches = data.response;

  setCachedData("matches", matches);

  return matches;
}

export async function getStandings() {
  const cached = getCachedData("standings");

  if (cached) {
    return cached;
  }

  const response = await fetch(
    `${BASE_URL}/standings?league=39&season=2023`,
    options
  );

  const data = await response.json();

  const standings = data.response[0].league.standings[0];

  setCachedData("standings", standings);

  return standings;
}