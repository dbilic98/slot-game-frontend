import { playerState } from "@/store/player";
import { AppSize } from "@/utility/common-types";
import { Sprite, Container } from "pixi.js";

export class SpinButton {
  /**
   * @param {PIXI.Texture} texture
   * @param {Function} onClick
   * @param {number} topY
   */
  constructor({ texture, onClick, topY }) {
    this.container = new Container();
    this.container.name = "SpinButton";
    this.isEnabled = true;

    this.button = new Sprite(texture);
    this.setInteractivity(true);
    this.button.buttonMode = true;

    this.button.x = (AppSize.Width - this.button.width) / 2;
    this.button.y = topY;

    this.button.on("pointerdown", () => {
      if (!this.isEnabled) return;
      onClick();
    });

    //if balance is insufficient on app boot, disable the spin button until it bet amount is changed
    this.updateAccordingToBalance();

    this.container.addChild(this.button);
  }
  /**
   * @param {boolean} enabled
   */
  setInteractivity(enabled) {
    this.isEnabled = enabled;
    this.button.eventMode = enabled ? "static" : "none";
    this.button.cursor = enabled ? "pointer" : "default";
    this.button.alpha = enabled ? 1 : 0.5;
  }

  disable() {
    this.setInteractivity(false);
  }

  enable() {
    this.setInteractivity(true);
  }

  updateAccordingToBalance() {
    if (playerState.balance < playerState.betAmount) {
      this.disable();
    } else {
      this.enable();
    }
  }
}
