import { Sprite } from "pixi.js";
import { ReelsLayout } from "./Reels";

export class Symbol {
  sprite;

  constructor(y = 0) {
    this.sprite = new Sprite();
    this.sprite.y = y;

    this.sprite.width = this.sprite.height = ReelsLayout.SymbolSize;
  }

  setTexture(texture) {
    this.sprite.texture = texture;
  }

  setY(y) {
    this.sprite.y = y;
  }

  static calculateY(reelIndex, symbolIndex) {
    const SymbolAndVGap = ReelsLayout.VerticalGap + ReelsLayout.SymbolSize;

    return (
      -(
        SymbolAndVGap *
        ((reelIndex + 1) * ReelsLayout.InvisibleSymbolsScalingFactor +
          ReelsLayout.InvisibleSymbolsConstant)
      ) +
      symbolIndex * SymbolAndVGap +
      ReelsLayout.TopOffset
    );
  }
}

export class SymbolTextures {
  constructor({ symbolTextures }) {
    this.textures = symbolTextures;
  }

  getCustomTexture() {
    return this.textures[Math.floor(Math.random() * this.textures.length)];
  }

  getTexture(index) {
    return this.textures[index];
  }
}
