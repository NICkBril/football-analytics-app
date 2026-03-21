const API_KEY = import.meta.env.VITE_API_KEY;

const BASE_URL = "https://v3.football.api-sports.io";

export async function getTeams() {
  const response = await fetch(
    `${BASE_URL}/teams?league=39&season=2023`,
    {
      headers: {
        "x-apisports-key": API_KEY
      }
    }
  );

  const data = await response.json();
  return data.response;
}

export async function getMatches() {
  const response = await fetch(
    `${BASE_URL}/fixtures?league=39&season=2023`,
    {
      headers: {
        "x-apisports-key": API_KEY
      }
    }
  );

  const data = await response.json();
  return data.response;
}