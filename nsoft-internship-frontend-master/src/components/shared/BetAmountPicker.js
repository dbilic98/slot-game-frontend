import { Container, Sprite, Text, Texture, Graphics } from "pixi.js";
import { AppSize } from "@/utility/common-types";
import { t } from "@/locales/i18n";


export class BetAmountPicker {
  /**
   * @param {number[]} betAmounts
   * @param {(amount: number) => void} onSelectCallback
   */
  constructor(betAmounts, onSelectCallback) {
    this.container = new Container();
    this.container.name = "BetAmountPicker";
    this.container.visible = false;
    this.container.eventMode = "static";

    const background = new Sprite(Texture.WHITE);
    background.tint = 0x000000;
    background.alpha = 1;
    background.width = AppSize.Width;
    background.height = AppSize.Height / 3;
    background.y = AppSize.Height - background.height;
    this.container.addChild(background);

    const closeButton = new Text("×", {
      fill: "#ffffff",
      fontSize: 42,
      fontWeight: "bold",
      fontFamily: "Arial",
    });
    closeButton.eventMode = "static";
    closeButton.cursor = "pointer";
    closeButton.x = background.width - 40;
    closeButton.y = background.y + 16;
    closeButton.on("pointerdown", () => {
      this.container.visible = false;
    });
    this.container.addChild(closeButton);

    const title = new Text(t("bet_amount"), {
      fill: "#ffffff",
      fontSize: 40,
      fontWeight: "bold",
      fontFamily: "Arial",
    });
    title.anchor.set(0.5, 0);
    title.x = background.width / 2;
    title.y = background.y + 20;
    this.container.addChild(title);

    const divider = new Sprite(Texture.WHITE);
    divider.tint = 0xffffff;
    divider.width = background.width - 40;
    divider.height = 2;
    divider.x = 20;
    divider.y = title.y + title.height + 10;
    this.container.addChild(divider);

    const cols = 3;
    const gap = 30;
    const padding = 40;
    const availableWidth = background.width - 2 * padding;
    const availableHeight =
      background.height - (divider.y + 20 - background.y) - 2 * padding;
    const rows = Math.ceil(betAmounts.length / cols);

    const boxWidth = (availableWidth - (cols - 1) * gap) / cols;
    const boxHeight = (availableHeight - (rows - 1) * gap) / rows;
    const startY = divider.y + 20;

    for (const [index, value] of betAmounts.entries()) {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const x = padding + col * (boxWidth + gap);
      const y = startY + padding + row * (boxHeight + gap);

      const box = new Graphics();
      box.lineStyle(2, 0xffffff);
      box.beginFill(0x000000);
      box.drawRoundedRect(0, 0, boxWidth, boxHeight, 20);
      box.endFill();
      box.x = x;
      box.y = y;
      box.eventMode = "static";
      box.cursor = "pointer";

      const label = new Text(value.toFixed(2), {
        fill: "#ffffff",
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: "Arial",
      });
      label.anchor.set(0.5);
      label.x = x + boxWidth / 2;
      label.y = y + boxHeight / 2;
      label.eventMode = "static";
      label.cursor = "pointer";

      const handleClick = () => {
        onSelectCallback(value);
        this.container.visible = false;
      };

      box.on("pointerdown", handleClick);
      label.on("pointerdown", handleClick);

      this.container.addChild(box, label);
    }
  }

  get visible() {
    return this.container.visible;
  }

  set visible(value) {
    this.container.visible = value;
  }
}
