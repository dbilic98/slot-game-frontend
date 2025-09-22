<template>
  <div class="app_background">
    <div class="pixi_game_canvas" ref="pixiGameCanvas"></div>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef } from "vue";
import { Sprite } from "pixi.js";
import { Footer } from "@/components/shared/Footer";
import { initialisePixiGame } from "@/services/initialise";
import { Reels } from "@/components/pace-and-race/Reels";
import { Logo } from "@/components/pace-and-race/Logo";
import { SpinButton } from "@/components/shared/SpinButton";
import { spin } from "@/services/pace-and-race";
import { Header } from "@/components/shared/Header";
import { AppSize } from "@/utility/common-types";
import { SymbolTextures } from "@/components/pace-and-race/Symbol";
import { WinScreen } from "@/components/shared/WinScreen";
import { playerState } from "@/store/player";
import { BetAmountPicker } from "@/components/shared/BetAmountPicker";
import { gameInfoParagraphsPaceAndRace } from "../assets/pace-and-race/assets";
import { gameState as gameStatePNR } from "../store/pace-and-race";

const pixiGameCanvas = useTemplateRef("pixiGameCanvas");
onMounted(async () => {
  if (!pixiGameCanvas.value) {
    console.error("onMounted: Container ref is not available");
    return;
  }

  const { pixiAssets, pixiApp } = await initialisePixiGame(
    pixiGameCanvas,
    "paceAndRace"
  );

  const symbolTexturesArray = [
    pixiAssets.symbol1,
    pixiAssets.symbol2,
    pixiAssets.symbol3,
    pixiAssets.symbol4,
    pixiAssets.symbol5,
    pixiAssets.symbol6,
    pixiAssets.symbol7,
    pixiAssets.wildSymbol,
    pixiAssets.bonusSymbol,
  ];

  const symbolTextures = new SymbolTextures({
    symbolTextures: symbolTexturesArray,
  });

  const appBackground = new Sprite(pixiAssets.background);
  appBackground.width = AppSize.Width;
  appBackground.height = AppSize.Height;

  const spinButton = new SpinButton({
    texture: pixiAssets.spin,
    onClick: () => spin(reels, winScreen, spinButton, footer, header),
    topY: 1475,
  });
  const picker = new BetAmountPicker(gameStatePNR.betAmounts, (newBet) => {
    footer.updateBetAmount(newBet);
    if (playerState.balance < playerState.betAmount) {
      spinButton.disable();
    } else {
      spinButton.enable();
    }
    picker.visible = false;
  });

  const footer = new Footer({
    balance: playerState.balance,
    betAmount: playerState.betAmount,
    margin: 20,
    gap: 20,
    walletIconTexture: pixiAssets.wallet,
    betAmountIconTexture: pixiAssets.money,
    spinButton: spinButton,
    picker: picker,
  });

  const header = new Header({
    hamburgerIconTexture: pixiAssets.hamburger,
    closeIconTexture: pixiAssets.closeIcon,
    gameInfoIconTexture: pixiAssets.gameInfoIcon,
    settingsIconTexture: pixiAssets.settingsIcon,
    paytableIconTexture: pixiAssets.paytableIcon,
    switchOnTexture: pixiAssets.switchOn,
    switchOffTexture: pixiAssets.switchOff,
    symbolTextures: symbolTextures,
    rightMargin: 20,
    topMargin: 40,
    paragraphs: gameInfoParagraphsPaceAndRace,
    gameState: gameStatePNR,
  });

  const logo = new Logo({ headerTexture: pixiAssets.logo });

  const reels = new Reels({
    reelsBackgroundTexture: pixiAssets.reelBackground,
    symbolTextures: symbolTextures,
  });
  const winScreen = new WinScreen();

  pixiApp.stage.addChild(
    appBackground,
    reels.container,
    footer.container,
    logo.header,
    spinButton.container,
    winScreen.container,
    header.hamburger.icon,
    picker.container,
    header.popUpWindow
  );

  reels.createSymbolLayout([
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 1],
  ]);

  window.addEventListener("keydown", (event) => {
    if (
      event.code === "Space" &&
      !header.popUpWindow.visible &&
      !picker.visible
    ) {
      spin(reels, winScreen, spinButton, footer, header);
    }
  });
});
</script>

<style scoped>
.app_background {
  height: 100dvh;
  width: 100vw;
  background-color: rgb(31, 3, 58);
  display: flex;
  justify-content: center;
  overflow: hidden;
}
</style>
