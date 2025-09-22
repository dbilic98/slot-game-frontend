import { Sprite, Container, Graphics } from "pixi.js";
import gsap from "gsap";
import { Reel } from "./Reel.js";
import { ReelsLayout } from "./ReelsLayout.js";

export class Reels {
  constructor(
    texture,
    ropeTexture,
    screenWidth,
    screenHeight,
    symbolTextures,
    initialMatrix
  ) {
    this.symbolTextures = symbolTextures;
    this.container = new Container();
    this.container.name = "Reels";

    this.reelsList = [];

    this.setupLayout(texture, ropeTexture, screenWidth, screenHeight);
    this.setupMask();

    if (initialMatrix) {
      this.setReelsOutcome(initialMatrix);
    }
  }

  setupLayout(texture, ropeTexture, screenWidth, screenHeight) {
    this.rope = new Sprite(ropeTexture);
    this.reels = new Sprite(texture);
    this.symbolsContainer = new Container();
    this.timeline = gsap.timeline();

    this.rope.y = (screenHeight - this.rope.height) / 2.55;
    this.reels.x = (screenWidth - this.reels.width) / 2;
    this.reels.y = (screenHeight - this.reels.height) / 2.4;
    this.symbolsContainer.y = this.reels.y;

    this.spacing = ReelsLayout.Spacing;
    this.numCols = ReelsLayout.NumCols;
    this.horisontalGap =
      (this.reels.width - ReelsLayout.SymbolSize * this.numCols) / 3;
    this.verticalGap =
      (this.reels.height -
        ReelsLayout.SymbolSize * ReelsLayout.NumVisibleRows -
        this.spacing * 2) /
      2;

    this.container.addChild(this.reels, this.symbolsContainer, this.rope);
  }

  setupMask() {
    const maskWidth =
      this.numCols * ReelsLayout.SymbolSize +
      (this.numCols - 1) * this.horisontalGap;
    const maskHeight =
      ReelsLayout.NumVisibleRows * ReelsLayout.SymbolSize +
      (ReelsLayout.NumVisibleRows - 1) * this.verticalGap;

    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, maskWidth, maskHeight);
    graphics.endFill();

    graphics.x = this.reels.x;
    graphics.y = this.reels.y + this.spacing;

    this.symbolsContainer.mask = graphics;
    this.container.addChild(graphics);
  }

  createReels(reelsWindow) {
    for (let col = 0; col < this.numCols; col++) {
      const reel = new Reel(
        reelsWindow[col],
        this.symbolTextures,
        this.verticalGap,
        col
      );
      reel.container.x = (ReelsLayout.SymbolSize + this.horisontalGap) * col;
      reel.container.y = this.spacing;

      this.symbolsContainer.addChild(reel.container);
      this.reelsList.push(reel);
    }
  }

  setReelsOutcome(matrix) {
    const fullReelSymbols = [];

    for (let colIndex = 0; colIndex < matrix.length; colIndex++) {
      const invisibleCount =
        ReelsLayout.InvisibleSymbolsScalingFactor * (colIndex + 1) +
        ReelsLayout.InvisibleSymbolsConstant;

      const invisibleSymbols = [];
      for (let i = 0; i < invisibleCount; i++) {
        const randomSymbolIndex = Math.floor(
          Math.random() * this.symbolTextures.length
        );
        invisibleSymbols.push(randomSymbolIndex);
      }

      const fullColumn = matrix[colIndex].concat(invisibleSymbols);
      fullReelSymbols.push(fullColumn);
    }

    this.symbolsContainer.removeChildren();
    this.reelsList = [];

    this.createReels(fullReelSymbols);
  }

  getAnimationHeight(reel) {
    const symbols = reel.symbols;
    const symbolHeight = symbols[0].sprite.height;
    const verticalGap = reel.verticalGap;
    return (
      (symbolHeight + verticalGap) *
        (symbols.length - ReelsLayout.NumVisibleRows) +
      this.spacing
    );
  }

  animateReels(layoutResponse, totalDuration = 1.7, onComplete = () => {}) {
    this.isAnimating = true;
    this.timelinesReady = false;
    const fullReelSymbols = [];
    for (let i = 0; i < layoutResponse.length; i++) {
      const invisibleCount =
        ReelsLayout.InvisibleSymbolsScalingFactor * (i + 1) +
        ReelsLayout.InvisibleSymbolsConstant;

      const invisibleSymbols = [];
      for (let j = 0; j < invisibleCount; j++) {
        const randomSymbolIndex = Math.floor(
          Math.random() * this.symbolTextures.length
        );
        invisibleSymbols.push(randomSymbolIndex);
      }
      const fullColumn = layoutResponse[i].concat(invisibleSymbols);
      fullReelSymbols.push(fullColumn);
    }
    this.symbolsContainer.removeChildren();
    this.reelsList = [];
    this.timeline = gsap.timeline();

    for (let i = 0; i < fullReelSymbols.length; i++) {
      const reel = new Reel(
        fullReelSymbols[i],
        this.symbolTextures,
        this.verticalGap
      );
      reel.container.x = (ReelsLayout.SymbolSize + this.horisontalGap) * i;
      reel.container.y = this.spacing;
      this.symbolsContainer.addChild(reel.container);
      this.reelsList.push(reel);
      const animationHeight = this.getAnimationHeight(reel);

      const reelTimeline = gsap.to(reel.container, {
        y: animationHeight,
        duration: totalDuration + i * 0.2,
        ease: "power4.out",
      });
      reel.timeline = reelTimeline;
      this.timeline.add(reelTimeline, 0);
    }
    this.timelinesReady = true;

    this.timeline.eventCallback("onComplete", () => {
      for (const reel of this.reelsList) {
        reel.cleanupOldSymbols();
      }
      this.isAnimating = false;
      this.timelinesReady = false;
      onComplete();
    });

    return this.timeline;
  }

  displayOneWinline(winline) {
    for (let col = 0; col < this.reelsList.length; col++) {
      const reel = this.reelsList[col];
      const total = reel.symbols.length;
      const visibleCount = ReelsLayout.NumVisibleRows;

      for (let i = total - visibleCount, row = 0; i < total; i++, row++) {
        const symbol = reel.symbols[i];
        symbol.sprite.alpha = winline[col] === row ? 1 : 0.4;
      }
    }
  }
  clearWinlineHighlights() {
    for (let col = 0; col < this.reelsList.length; col++) {
      const reel = this.reelsList[col];
      const total = reel.symbols.length;
      const visibleCount = ReelsLayout.NumVisibleRows;

      for (let i = total - visibleCount; i < total; i++) {
        const symbol = reel.symbols[i];
        symbol.sprite.alpha = 1;
      }
    }
  }

  startPaylineAnimation(winlines, displayTime = 1) {
    if (!winlines || winlines.length === 0) return;

    this.winlineAnimationTimeline?.kill();
    this.winlineAnimationTimeline = gsap.timeline({ repeat: -1 });

    for (const winline of winlines) {
      this.winlineAnimationTimeline
        .call(() => {
          this.displayOneWinline(winline);
        })
        .to({}, { duration: displayTime });
    }
  }

  fastForwardAll() {
    if (!this.isAnimating || !this.timelinesReady) {
      return;
    }
    this.reelsList.forEach((reel) => reel.fastForward());
  }
}
