import { sound } from "@pixi/sound";
import { createSpin } from "@/api/casino-slot";
import { gameState } from "@/store/crazy-pirate";
import { playerState } from "@/store/player";

export async function spin(reels, winScreen, spinButton, footer, header) {
  if (playerState.balance < playerState.betAmount) {
    return;
  }

  if (gameState.isGameActive && gameState.isSpinSpedUp) {
    return;
  }

  if (gameState.isGameActive && !gameState.isSpinSpedUp) {
    reels.fastForwardAll();
    gameState.isSpinSpedUp = true;

    if (gameState.areSoundsActive && sound.find("spinSound")?.isPlaying) {
      sound.stop("spinSound");
    }

    return;
  }
  
  if (reels.winlineAnimationTimeline) {
    reels.winlineAnimationTimeline.kill();
    footer.hideWinnings();
  }

  gameState.isGameActive = true;
  const response = await createSpin(
    playerState.betAmount,
    playerState.playerId,
    gameState.gameId
  );
  
  if (!response) {
    gameState.isGameActive = false;
    gameState.isSpinSpedUp = false;
    return;
  }
  
  const matrix = response.reelWindow;
  const winningSymbols = response.winlines;
  
  footer.updateBalance(response.playerBalancePreResult);
  footer.disableBetAmountPickerInteractivity();
  header.hamburger.disableInteractivity();

  if (gameState.areSoundsActive) sound.play("spinSound", { volume: 1 });

  reels.winlineAnimationTimeline?.kill();
  reels.clearWinlineHighlights();
  await reels.animateReels(matrix, 1.7);

  if (winningSymbols.length) {
    spinButton.disable();
    reels.startPaylineAnimation(winningSymbols, 1);
    await winScreen.animate(response.winAmount);
    footer.updateBalance(response.playerBalancePostResult);
    footer.displayWinnings(response.winAmount);
    spinButton.enable();
  }

  playerState.balance = response.playerBalancePostResult;

  //after each game check whether we should disable the button
  spinButton.updateAccordingToBalance();

  gameState.isGameActive = false;
  gameState.isSpinSpedUp = false;
  footer.enableBetPicker();
  header.hamburger.enableInteractivity();

  if (response.winlines.length) {
    reels.startPaylineAnimation(winningSymbols, 1);
  }
}
