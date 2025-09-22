import { Sprite } from "pixi.js";

export class SlotSymbol {
  /**
   * @param {PIXI.Texture} texture
   */
  constructor(texture) {
    this.sprite = new Sprite(texture);
    this.sprite.name = "SymbolSprite";
  }

   setTexture(newTexture) {
    this.sprite.texture = newTexture;
  }
}

