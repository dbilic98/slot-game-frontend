import { Container, Graphics, Sprite, Text } from "pixi.js";
import { t } from "@/locales/i18n";
import { AppSize } from "@/utility/common-types";

class ClickableIcon {
  constructor({
    texture,
    onClick,
    anchor = { x: 0, y: 0 },
    position = { x: 0, y: 0 },
  }) {
    this.icon = new Sprite(texture);
    this.icon.anchor.set(anchor.x, anchor.y);
    this.icon.position.set(position.x, position.y);
    this.icon.eventMode = "static";
    this.icon.cursor = "pointer";
    this.icon.on("pointertap", () => onClick());
  }

  disableInteractivity() {
    this.icon.eventMode = "none";
    this.icon.cursor = "default";
    this.icon.alpha = 0.5;
  }

  enableInteractivity() {
    this.icon.eventMode = "static";
    this.icon.cursor = "pointer";
    this.icon.alpha = 1;
  }

  setTint(colorHex) {
    this.icon.tint = colorHex;
  }
}

export class Header {
  constructor({
    hamburgerIconTexture,
    closeIconTexture,
    gameInfoIconTexture,
    settingsIconTexture,
    paytableIconTexture,
    switchOnTexture,
    switchOffTexture,
    symbolTextures,
    rightMargin,
    topMargin,
    paragraphs,
    gameState,
  }) {
    this.gameState = gameState;

    this.popUpWindow = new Container();
    this.popUpWindow.visible = false;

    this.hamburger = new ClickableIcon({
      texture: hamburgerIconTexture,
      onClick: () => {
        this.popUpWindow.visible = true;
      },
      position: { x: AppSize.Width - rightMargin, y: topMargin },
      anchor: { x: 1, y: 0 },
    });

    const background = new Graphics();
    background.eventMode = "static";
    background.beginFill(0x000000, 0.9);
    background.drawRect(0, 0, AppSize.Width, AppSize.Height);
    background.endFill();

    const close = new ClickableIcon({
      texture: closeIconTexture,
      anchor: { x: 1, y: 0 },
      position: { x: AppSize.Width - rightMargin, y: topMargin },
      onClick: () => {
        this.popUpWindow.visible = false;
      },
    });

    this.popUpWindowHeader = new Text(t(""), {
      fill: "#FFFFFF",
      fontSize: 64,
      fontWeight: 800,
    });
    this.popUpWindowHeader.anchor.set(0.5, 0);
    this.popUpWindowHeader.x = AppSize.Width / 2;
    this.popUpWindowHeader.y = topMargin;

    const gameInfo = new ClickableIcon({
      texture: gameInfoIconTexture,
      anchor: { x: 0.5, y: 0.5 },
      position: { x: (AppSize.Width / 4) * 1, y: 225 },
      onClick: () => this.setActiveTab("game_info"),
    });

    const settings = new ClickableIcon({
      texture: settingsIconTexture,
      anchor: { x: 0.5, y: 0.5 },
      position: { x: (AppSize.Width / 4) * 2, y: 225 },
      onClick: () => this.setActiveTab("settings"),
    });

    const paytable = new ClickableIcon({
      texture: paytableIconTexture,
      anchor: { x: 0.5, y: 0.5 },
      position: { x: (AppSize.Width / 4) * 3, y: 225 },
      onClick: () => this.setActiveTab("paytable"),
    });

    const gameInfoTab = new GameInfoTab({ paragraphs });

    const settingsTab = new SettingsTab({
      activeSettingIcon: switchOnTexture,
      disabledSettingIcon: switchOffTexture,
      gameState: this.gameState,
    });

    const paytableTab = new PaytableTab({ symbolTextures });

    this.tabs = {
      game_info: { tab: gameInfoTab, icon: gameInfo },
      settings: { tab: settingsTab, icon: settings },
      paytable: { tab: paytableTab, icon: paytable },
    };

    this.setActiveTab("game_info");

    this.popUpWindow.addChild(background, close.icon, this.popUpWindowHeader);

    for (const tab of Object.values(this.tabs)) {
      this.popUpWindow.addChild(tab.tab.container, tab.icon.icon);
    }
  }

  setActiveTab(tabName) {
    this.popUpWindowHeader.text = t(tabName);
    for (const [key, tabObj] of Object.entries(this.tabs)) {
      const { icon, tab } = tabObj;
      if (key === tabName) {
        icon.setTint(0xff0000);
        tab.show();
      } else {
        icon.setTint(0xffffff);
        tab.hide();
      }
    }
  }
}

class GameInfoTab {
  constructor({ paragraphs }) {
    this.container = new Container();
    this.container.visible = false;

    for (const paragraph of paragraphs) {
      const postI18nParagraph = {
        title: t(paragraph.title),
        text: t(paragraph.text),
        gap: paragraph.gap,
      };
      const paragraphObject = new Paragraph({
        paragraphObject: postI18nParagraph,
      });
      this.container.addChild(paragraphObject.container);
    }
  }

  show() {
    this.container.visible = true;
  }

  hide() {
    this.container.visible = false;
  }
}

class SettingsTab {
  constructor({ activeSettingIcon, disabledSettingIcon, gameState }) {
    this.container = new Container();
    this.container.visible = false;
    this.gameState = gameState;

    const soundText = new Text(t("sound"), {
      fill: "#FFFFFF",
      fontSize: 32,
      fontWeight: 600,
    });
    soundText.x = 50;
    soundText.y = 340;

    this.soundActivationIcon = new ClickableIcon({
      texture: this.gameState.areSoundsActive
        ? activeSettingIcon
        : disabledSettingIcon,
      onClick: () => {
        this.gameState.areSoundsActive = !this.gameState.areSoundsActive;
        this.soundActivationIcon.icon.tint = this.gameState.areSoundsActive
          ? 0xff0000
          : 0xffffff;
        this.soundActivationIcon.icon.texture = this.gameState.areSoundsActive
          ? activeSettingIcon
          : disabledSettingIcon;
      },
      anchor: { x: 1, y: 0 },
      position: { x: AppSize.Width - 50, y: 340 },
    });

    this.soundActivationIcon.icon.tint = this.gameState.areSoundsActive
      ? 0xff0000
      : 0xffffff;

    this.container.addChild(soundText, this.soundActivationIcon.icon);
  }

  show() {
    this.container.visible = true;
  }

  hide() {
    this.container.visible = false;
  }
}

class PaytableTab {
  constructor({ symbolTextures }) {
    this.container = new Container();
    this.container.visible = false;

    const paytableText = new Text(t("paytable"), {
      fill: "#FFFFFF",
      fontSize: 32,
      fontWeight: 600,
    });
    paytableText.x = 50;
    paytableText.y = 340;

    const startY = 445;

    for (let i = 0; i < 4; i++) {
      const symbol = new Sprite(symbolTextures[i]);
      symbol.scale.set(0.8);
      symbol.y = startY + i * (60 + 255 * 0.8);
      symbol.x = 50;
      const text1 = new Text("4 - 50.00", { fill: "#FFFFFF", fontSize: 32 });
      const text2 = new Text("3 - 5.00", { fill: "#FFFFFF", fontSize: 32 });
      text1.x = text2.x = 50 + 255;
      text1.y = symbol.y + 255 / 5;
      text2.y = symbol.y + (255 / 5) * 2;
      this.container.addChild(symbol, text1, text2);
    }

    const payTable = {
      4: { 4: "250.00", 3: "15.00" },
      5: { 4: "250.00", 3: "20.00" },
      6: { 4: "300.00", 3: "25.00" },
      7: { 4: "500.00", 3: "110.00" },
    };

    for (let i = 4; i < 8; i++) {
      const symbol = new Sprite(symbolTextures[i]);
      symbol.anchor.x = 1;
      symbol.scale.set(0.8);
      symbol.y = startY + (i - 4) * (60 + 255 * 0.8);
      symbol.x = AppSize.Width - 50 - 190;
      const text1 = new Text(`4 - ${payTable[i][4]}`, {
        fill: "#FFFFFF",
        fontSize: 32,
      });
      const text2 = new Text(`3 - ${payTable[i][3]}`, {
        fill: "#FFFFFF",
        fontSize: 32,
      });
      text1.x = text2.x = AppSize.Width - 200;
      text1.y = symbol.y + 255 / 5;
      text2.y = symbol.y + (255 / 5) * 2;
      this.container.addChild(symbol, text1, text2);
    }

    this.container.addChild(paytableText);
  }

  show() {
    this.container.visible = true;
  }

  hide() {
    this.container.visible = false;
  }
}

class Paragraph {
  constructor({ paragraphObject }) {
    this.container = new Container();
    this.container.x = 50;
    this.container.y = paragraphObject.gap;
    const title = new Text(paragraphObject.title, {
      fontSize: 32,
      fontWeight: 600,
      fill: "#FFFFFF",
    });
    const text = new Text(paragraphObject.text, {
      fontSize: 32,
      wordWrap: true,
      wordWrapWidth: AppSize.Width - 100,
      lineHeight: 40,
      fill: "#FFFFFF",
    });
    text.y = 60;
    this.container.addChild(text, title);
  }
}
