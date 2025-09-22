import { createSpin } from "@/api/casino-slot";
import { gameState } from "@/store/pace-and-race";
import { playerState } from "@/store/player";
import { sound } from "@pixi/sound";

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
    reels.resetSpritesVisiblity();
    //if the winline animation existed, that means winnings should always be displayed
    footer.hideWinnings();
  }

  gameState.isGameActive = true;
  const response = await createSpin(
    playerState.betAmount,
    playerState.playerId
  );

  if (!response) {
    //in case of an error reset the state before exiting the game
    gameState.isGameActive = false;
    gameState.isSpinSpedUp = false;
    return;
  }
  footer.updateBalance(response.playerBalancePreResult);
  footer.disableBetAmountPickerInteractivity();
  header.hamburger.disableInteractivity();

  if (gameState.areSoundsActive) sound.play("spinSound", { volume: 1 });

  await reels.animateReels(response.reelWindow, 1.7);

  if (response.winlines.length) {
    spinButton.disable();
    reels.displayOneWinline(response.winlines[0]);
    await winScreen.animate(response.winAmount);
    footer.updateBalance(response.playerBalancePostResult);
    footer.displayWinnings(response.winAmount);
    spinButton.enable();
  }

  playerState.balance = response.playerBalancePostResult;

  //after each game check whether we should disable the button
  spinButton.updateAccordingToBalance()
  gameState.isGameActive = false;
  gameState.isSpinSpedUp = false;
  header.hamburger.enableInteractivity();
  footer.enableBetPicker();

  if (response.winlines.length) {
    reels.startPaylineAnimation(response.winlines, 1);
  }
}
