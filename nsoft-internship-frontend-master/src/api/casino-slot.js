import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_CASINO_SLOT_API,
});

export async function createSpin(bet, playerId, gameId) {
  try {
    const response = await http({
      url: "/games",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        playerId: playerId,
        stake: bet,
        gameId,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getGameData(gameId) {
  try {
    const response = await http.get(`/state/players/${gameId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching game data:", error);
    return null;
  }
}
