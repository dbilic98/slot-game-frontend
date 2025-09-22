import { Sprite, Container } from "pixi.js";

export class Background {
  /**
   * @param {PIXI.Texture} texture
   * @param {number} screenWidth
   * @param {number} screenHeight
   */
  constructor(texture, screenWidth, screenHeight) {
    this.container = new Container();
    this.container.name = "Background";

    this.background = new Sprite(texture);
    this.background.x = (screenWidth - this.background.width) / 2;
    this.background.y = (screenHeight - this.background.height) / 2;

    this.container.addChild(this.background);
  }
}
