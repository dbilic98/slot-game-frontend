import { Container } from "pixi.js";
import { SlotSymbol } from "./Symbol.js";
import { ReelsLayout } from "./ReelsLayout.js";

export class Reel {
  constructor(symbolIndex, symbolTextures, verticalGap) {
    this.container = new Container();
    this.container.name = "Reel";
    this.symbols = [];
    this.verticalGap = verticalGap;
    this.symbolTextures = symbolTextures;
    this.setupSymbols(symbolIndex);
    this.timeline = null;
  }

  setupSymbols(symbolIndex) {
    const totalSymbols = symbolIndex.length;
    const visibleCount = ReelsLayout.NumVisibleRows;
    const upperSymbols = totalSymbols - visibleCount;
    const startSymbolY =
      -upperSymbols * (this.verticalGap + this.symbolTextures[0].height);

    for (let i = 0; i < totalSymbols; i++) {
      const texture = this.symbolTextures[symbolIndex[i]];
      const symbol = new SlotSymbol(texture);

      symbol.sprite.y = startSymbolY + i * (texture.height + this.verticalGap);
      this.container.addChild(symbol.sprite);
      this.symbols.push(symbol);
    }
  }

  cleanupOldSymbols() {
    const visibleCount = ReelsLayout.NumVisibleRows;

    for (let i = this.symbols.length - 1; i >= visibleCount; i--) {
      const symbol = this.symbols[i];
      if (symbol.sprite) {
        this.container.removeChild(symbol.sprite);
        symbol.sprite.destroy();
      }
      this.symbols.splice(i, 1);
    }
  }

  fastForward() {
    if (this.timeline) {
      this.timeline.timeScale(7);
    }
  }
}
