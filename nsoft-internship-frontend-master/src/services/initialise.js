import { Application, Assets } from "pixi.js";
import { sound } from "@pixi/sound";
import { AppSize } from "@/utility/common-types";
import { assetsArray as paceAndRaceAssets } from "@/assets/pace-and-race/assets";
import { assetsArray as crazyPirateAssets } from "@/assets/crazy-pirate/assets";
import { getGameData } from "@/api/casino-slot";
import { playerState } from "@/store/player";
import { gameState as paceAndRaceGameState } from "@/store/pace-and-race";
import { gameState as crazyPirateGameState } from "@/store/crazy-pirate";

const games = {
  paceAndRace: {
    assets: paceAndRaceAssets,
    state: paceAndRaceGameState,
  },
  crazyPirate: {
    assets: crazyPirateAssets,
    state: crazyPirateGameState,
  },
};
export async function initialisePixiGame(pixiGameCanvas, gameName) {
  if (!games[gameName]) {
    console.error(
      'Invalid game name. Only valid options are "crazyPirate" and "paceAndRace"'
    );
    return;
  }

  const pixiApp = new Application({
    background: "#1d094d",
    width: AppSize.Width,
    height: AppSize.Height,
  });

  pixiGameCanvas.value.appendChild(pixiApp.view);

  resizeCanvas(pixiApp);
  window.addEventListener("resize", () => resizeCanvas(pixiApp));

  const pixiAssets = await Assets.load(games[gameName].assets);

  const { balance, playerId, betAmounts } = await getGameData(
    games[gameName].state.gameId
  );

  playerState.balance = balance;
  playerState.playerId = playerId;
  games[gameName].state.betAmounts = betAmounts;

  return {
    pixiAssets,
    pixiApp,
  };
}

const resizeCanvas = (pixiApp) => {
  const scaleX = window.innerWidth / AppSize.Width;
  const scaleY = window.innerHeight / AppSize.Height;
  const scale = Math.min(scaleX, scaleY);
  pixiApp.view.style.width = `${AppSize.Width * scale}px`;
  pixiApp.view.style.height = `${AppSize.Height * scale}px`;
};
