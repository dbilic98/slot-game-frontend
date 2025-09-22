<template>
  <div ref="pixi-container" class="pixi-container"></div>
</template>

<script setup>
import { useTemplateRef, onMounted } from "vue";
import { Assets } from "pixi.js";
import { Background } from "../components/crazy-pirate/Background.js";
import { Reels } from "../components/crazy-pirate/Reels.js";
import { Logo } from "../components/crazy-pirate/Logo.js";
import { SpinButton } from "../components/shared/SpinButton.js";
import { Footer } from "../components/shared/Footer.js";
import { initialisePixiGame } from "@/services/initialise.js";
import { playerState } from "@/store/player";
import { WinScreen } from "@/components/crazy-pirate/WinScreen";
import { spin } from "@/services/crazy-pirate.js";
import { BetAmountPicker } from "@/components/shared/BetAmountPicker.js";
import { Header } from "@/components/shared/Header.js";
import { gameInfoParagraphsCrazyPirate } from "../assets/crazy-pirate/assets";
import { gameState as gameStateCP } from "../store/crazy-pirate";

const pixiContainer = useTemplateRef("pixi-container");

onMounted(async () => {
  const { pixiAssets: loadedAssets, pixiApp: app } = await initialisePixiGame(
    pixiContainer,
    "crazyPirate"
  );

  const symbolTextures = [
    loadedAssets.symbol1,
    loadedAssets.symbol2,
    loadedAssets.symbol3,
    loadedAssets.symbol4,
    loadedAssets.symbol5,
    loadedAssets.symbol6,
    loadedAssets.symbol7,
    loadedAssets.wildSymbol,
    loadedAssets.bonusSymbol,
  ];

  const matrix = [
  [3, 2, 1],
  [4, 2, 6],
  [7, 2, 0],
  [5, 2, 1],
];

  pixiContainer.value.appendChild(app.view);

  const bgTexture = loadedAssets.background;
  const background = new Background(
    bgTexture,
    app.screen.width,
    app.screen.height
  );
  app.stage.addChild(background.container);

  const reelsTexture = loadedAssets.reelBackground;
  const ropeTexture = loadedAssets.rope;
  const reels = new Reels(
    reelsTexture,
    ropeTexture,
    app.screen.width,
    app.screen.height,
    symbolTextures,
    matrix
  );
  app.stage.addChild(reels.container);

  const winScreen = new WinScreen();
  const logoTexture = loadedAssets.logo;
  const logo = new Logo(logoTexture, app.screen.width, reels.reels.y);

  app.stage.addChild(logo.container);

  const header = new Header({
    hamburgerIconTexture: loadedAssets.hamburger,
    closeIconTexture: loadedAssets.closeIcon,
    gameInfoIconTexture: loadedAssets.gameInfoIcon,
    settingsIconTexture: loadedAssets.settingsIcon,
    paytableIconTexture: loadedAssets.paytableIcon,
    switchOnTexture: loadedAssets.switchOn,
    switchOffTexture: loadedAssets.switchOff,
    symbolTextures: symbolTextures,
    rightMargin: 20,
    topMargin: 40,
    paragraphs: gameInfoParagraphsCrazyPirate,
    gameState: gameStateCP,
  });

  const spinTexture = loadedAssets.spin;
  const spinBtn = new SpinButton({
    texture: spinTexture,
    onClick: () => spin(reels, winScreen, spinBtn, footer, header),
    topY: reels.reels.y + reels.reels.height + 75,
  });
  const picker = new BetAmountPicker(gameStateCP.betAmounts, (newBet) => {
    footer.updateBetAmount(newBet);
    spinBtn.updateAccordingToBalance();
    picker.visible = false;
  });

  const walletTexture = Assets.get("wallet");
  const moneyTexture = Assets.get("money");
  const footer = new Footer({
    balance: playerState.balance,
    betAmount: playerState.betAmount,
    margin: 40,
    gap: 26,
    walletIconTexture: walletTexture,
    betAmountIconTexture: moneyTexture,
    spinButton: spinBtn,
    picker: picker,
  });

  app.stage.addChild(footer.container);
  app.stage.addChild(spinBtn.container);
  app.stage.addChild(picker.container);

  app.stage.addChild(header.hamburger.icon, header.popUpWindow);
  app.stage.addChild(winScreen.container);

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !header.popUpWindow.visible) {
      spin(reels, winScreen, spinBtn, footer, header);
    }
  });
});
</script>

<style scoped>
.pixi-container {
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background-color: black;

  display: flex;
  justify-content: center;
}
</style>
