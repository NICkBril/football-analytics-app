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

    if (teams && teams.length > 0) {
      setCachedData("teams", teams);
    }

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

    if (matches && matches.length > 0) {
      setCachedData("matches", matches);
    }

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
    const standings = data.response[0]?.league?.standings[0];

    if (standings && standings.length > 0) {
      setCachedData("standings", standings);
    }

    return standings || [];

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

    if (squad.length > 0) {
      setCachedData(cacheKey, squad);
    }

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

    if (stats && stats.length > 0) {
      setCachedData(cacheKey, stats);
    }

    return stats;

  } catch (error) {

    console.error("Error loading stats:", error);
    return [];

  }
}

export async function getMatchEvents(fixtureId) {
  const cacheKey = `events_${fixtureId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/fixtures/events?fixture=${fixtureId}`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await response.json();
    const events = data.response;

    if (events && events.length > 0) {
      setCachedData(cacheKey, events);
    }

    return events;
  } catch (error) {
    console.error("Error loading events:", error);
    return [];
  }
}

export async function getMatchLineups(fixtureId) {
  const cacheKey = `lineups_${fixtureId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/fixtures/lineups?fixture=${fixtureId}`,
      options
    );

    if (!response.ok) throw new Error("Failed to fetch lineups");

    const data = await response.json();
    const lineups = data.response;

    if (lineups && lineups.length > 0) {
      setCachedData(cacheKey, lineups);
    }

    return lineups;
  } catch (error) {
    console.error("Error loading lineups:", error);
    return [];
  }
}

export async function getPlayerDetails(playerId) {
  const cacheKey = `player_${playerId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/players?id=${playerId}&season=2024`, 
      options
    );

    const data = await response.json();

    if (!data.response || data.response.length === 0) {
      console.warn(`No data for season 2024, trying 2025...`);
      const retryResponse = await fetch(
        `${BASE_URL}/players?id=${playerId}&season=2025`,
        options
      );
      const retryData = await retryResponse.json();
      
      if (!retryData.response || retryData.response.length === 0) {
        return null;
      }
      
      setCachedData(cacheKey, retryData.response[0]);
      return retryData.response[0];
    }

    setCachedData(cacheKey, data.response[0]);
    return data.response[0];
  } catch (error) {
    console.error("Error loading player details:", error);
    return null;
  }
}

export async function getPlayerTrophies(playerId) {
  const response = await fetch(`${BASE_URL}/trophies?player=${playerId}`, {
    headers: { "x-apisports-key": API_KEY }
  });
  const data = await response.json();
  return data.response || [];
}

export async function getPlayerMatchStats(fixtureId, playerId) {
  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures/players?fixture=${fixtureId}`,
    {
      headers: {
        "x-apisports-key": API_KEY,
      },
    }
  );
  const data = await res.json();
  const teams = data.response || [];

  for (const teamData of teams) {
    const found = teamData.players.find((p) => p.player.id === playerId);
    if (found) {
      return { ...found, teamLogo: teamData.team.logo };
    }
  }
  return null;
}

export async function getMatchInjuries(fixtureId) {
  const cacheKey = `injuries_${fixtureId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/injuries?fixture=${fixtureId}`,
      options
    );

    if (!response.ok) throw new Error("Failed to fetch injuries");

    const data = await response.json();
    const injuries = data.response;

    if (injuries && injuries.length > 0) {
      setCachedData(cacheKey, injuries);
    }

    return injuries;

  } catch (error) {
    console.error("Error loading injuries:", error);
    return [];
  }
}