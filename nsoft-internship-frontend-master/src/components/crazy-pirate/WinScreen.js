import { sound } from "@pixi/sound";
import { BitmapText, Container, Graphics } from "pixi.js";
import { AppSize } from "@/utility/common-types";
import gsap from "gsap";
import { formatNumberWithCurrency } from "@/utility/helpers";
import { gameState } from "@/store/crazy-pirate";

export class WinScreen {
  constructor() {
    this.container = new Container();
    this.container.visible = false;
    const background = new Graphics();
    background.beginFill(0x000000, 0.4);
    background.drawRect(0, 0, AppSize.Width, AppSize.Height);
    background.endFill();

    this.winAmountText = new BitmapText("0", {
      fontName: "Inter",
      fontSize: 128,
      align: "center",
    });

    this.winAmountText.anchor.set(0.5);

    this.winAmountText.x = AppSize.Width / 2;
    this.winAmountText.y = AppSize.Height / 2.3;

    this.container.addChild(background, this.winAmountText);
  }

  animate(winAmount) {
    return new Promise((res) => {
      this.container.visible = true;

      const counter = { value: 0 };

      if (gameState.areSoundsActive)
        sound.play("moneyCountingSound", { volume: 1 });
      gsap.to(counter, {
        value: winAmount,
        duration: 1,
        ease: "power4.out",
        onUpdate: () => {
          this.winAmountText.text = formatNumberWithCurrency(counter.value);
        },

        onComplete: () => {
          setTimeout(() => {
            this.container.visible = false;
            res();
          }, 1000);
        },
      });
    });
  }
}
