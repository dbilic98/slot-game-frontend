import { Container, Sprite, Text } from "pixi.js";
import { AppSize, FontSize } from "@/utility/common-types";
import { t } from "@/locales/i18n";
import { formatNumberWithCurrency } from "@/utility/helpers";
import { playerState } from "@/store/player";

/**
 * Footer component that displays player info. (balance, bet amount (stake))
 */

export class Footer {
  constructor({
    balance,
    betAmount,
    margin,
    gap,
    walletIconTexture,
    betAmountIconTexture,
    picker,
  }) {
    this.iconSize = 64;
    this.height = 85;
    this.margin = margin;
    this.gap = gap;

    this.container = new Container();
    this.container.name = "Footer";
    this.container.y = AppSize.Height - this.height;

    this.walletIcon = new Sprite(walletIconTexture);
    this.walletIcon.width = this.walletIcon.height = this.iconSize;
    this.walletIcon.anchor.y = 0.5;
    this.walletIcon.y = this.height / 2;
    this.walletIcon.x = margin;

    this.balanceText = new Text(formatNumberWithCurrency(balance, "BAM"), {
      fill: "#FFFFFF",
      fontSize: FontSize.Normal,
      fontWeight: 1000,
    });
    this.balanceText.anchor.y = 0.5;
    this.balanceText.x = walletIconTexture
      ? margin + this.iconSize + gap
      : margin;
    this.balanceText.y = this.height / 2;

    this.betAmount = betAmount;
    this.betAmountContainer = new Container();
    this.betAmountText = new Text(formatNumberWithCurrency(betAmount), {
      fill: "#FFFFFF",
      fontSize: FontSize.Normal,
      fontWeight: 1000,
    });

    const betAmountIcon = new Sprite(betAmountIconTexture);
    betAmountIcon.width = betAmountIcon.height = this.iconSize;
    this.betAmountContainer.addChild(this.betAmountText, betAmountIcon);

    this.winDisplayContainer = new Container();
    const winDisplayContainerHeader = new Text(t("win"), {
      fill: "#FFFFFF",
      fontSize: FontSize.Small,
      fontWeight: 500,
    });
    this.winAmount = new Text(0, {
      fill: "#FFFFFF",
      fontSize: FontSize.Normal,
      fontWeight: 1000,
    });
    winDisplayContainerHeader.anchor.set(0.5);
    this.winAmount.anchor.set(0.5);

    winDisplayContainerHeader.x = this.winAmount.x = AppSize.Width / 2;
    winDisplayContainerHeader.y += 15;
    this.winAmount.y += 50;

    this.winDisplayContainer.addChild(
      this.winAmount,
      winDisplayContainerHeader
    );
    this.winDisplayContainer.visible = false;
    this.betAmountIcon = betAmountIcon;

    this.betAmountText.x = AppSize.Width - margin;
    this.betAmountText.anchor.y = 0.5;
    this.betAmountText.anchor.x = 1;
    this.betAmountText.y = this.height / 2;
    this.betAmountText.eventMode = "static";
    this.betAmountText.cursor = "pointer";

    betAmountIcon.anchor.x = 1;
    betAmountIcon.anchor.y = 0.5;
    betAmountIcon.y = this.height / 2;
    betAmountIcon.x = AppSize.Width - margin - this.betAmountText.width - gap;

    betAmountIcon.eventMode = "static";
    betAmountIcon.cursor = "pointer";
    
    this.betAmountText.on("pointerdown", () => {
      picker.visible = !picker.visible;
    });
    betAmountIcon.on("pointerdown", () => {
      picker.visible = !picker.visible;
    });

    this.container.addChild(
      this.balanceText,
      this.walletIcon,
      this.winDisplayContainer,
      this.betAmountContainer
    );
  }
  updateBetAmount(newAmount) {
    this.betAmount = newAmount;
    this.betAmountText.text = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(newAmount);

    this.betAmountIcon.x =
      AppSize.Width - this.margin - this.betAmountText.width - this.gap;
    this.betAmountText.x = AppSize.Width - this.margin;

    playerState.betAmount = newAmount;

  }
  displayWinnings(winAmount) {
    this.winAmount.text = formatNumberWithCurrency(winAmount, "BAM");
    this.winDisplayContainer.visible = true;
  }
  hideWinnings() {
    this.winDisplayContainer.visible = false;
  }
  updateBalance(balance) {
    this.balanceText.text = formatNumberWithCurrency(balance, "BAM");
  }
  setStage(stage) {
    this.stage = stage;
    this.stage.addChild(this.picker.container);
  }
  disableBetAmountPickerInteractivity() {
    this.betAmountContainer.alpha = 0.5;
    this.betAmountIcon.eventMode = this.betAmountText.eventMode = "none";
    this.betAmountIcon.cursor = this.betAmountText.cursor = "default";
  }
  enableBetPicker() {
    this.betAmountContainer.alpha = 1;
    this.betAmountIcon.eventMode = this.betAmountText.eventMode = "static";
    this.betAmountIcon.cursor = this.betAmountText.cursor = "pointer";
  }
}
