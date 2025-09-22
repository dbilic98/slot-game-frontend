import { Sprite, Container } from "pixi.js";

export class Logo {
  /**
   * @param {PIXI.Texture} texture
   * @param {number} screenWidth
   * @param {number} reelsY
   */
  constructor(texture, screenWidth, reelsY) {
    this.container = new Container();
    this.container.name = "Logo";

    this.logo = new Sprite(texture);
    this.logo.x = (screenWidth - this.logo.width) / 2;
    this.logo.y = reelsY - this.logo.height + 10;

    this.container.addChild(this.logo);
  }
}
