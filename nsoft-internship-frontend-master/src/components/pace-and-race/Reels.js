import { Container, Graphics, Sprite } from "pixi.js";
import gsap from "gsap";
import { AppSize } from "@/utility/common-types";
import { Symbol } from "./Symbol";

export const ReelsLayout = Object.freeze({
  TopOffset: 6,
  HorizontalGap: 12,
  VerticalGap: 36,
  InvisibleSymbolsScalingFactor: 4,
  InvisibleSymbolsConstant: 15,
  BackgroundHeight: 850,
  VisibleSymbolsPerReel: 3,
  ReelsCount: 4,
  SymbolSize: 255,
});

export class Reels {
  /** @type {Reel[]} Array of individual reel objects */
  reels = [];

  /** @type  {SymbolTextures} Contains symbol textures and symbols' access methods*/
  symbolTextures;

  /** @type {PIXI.Container} Base container for the whole Reels class */
  container;

  /**
   * @param {PIXI.Texture} reelsBackgroundTexture - Texture used for the reels' background.
   * @param {SymbolTextures} symbolTextures - Contains symbol textures and symbols' access methods
   */
  constructor({ reelsBackgroundTexture, symbolTextures }) {
    this.symbolTextures = symbolTextures;

    this.container = new Container();
    this.container.y = (AppSize.Height - ReelsLayout.BackgroundHeight) / 2;

    const background = new Sprite(reelsBackgroundTexture);
    background.width = AppSize.Width;
    background.height = ReelsLayout.BackgroundHeight;

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, AppSize.Width, ReelsLayout.BackgroundHeight);
    mask.endFill();
    this.container.mask = mask;

    this.container.addChild(background, mask);
  }

  /**
   * Creates a reel layout with symbols based on a 2D layout array.
   *
   * Each reel includes a number of invisible (off-screen) symbols, which are used for animation purposes.
   * The number of invisible symbols per reel is calculated using the following formula:
   *
   *    InvisibleSymbolsScalingFactor × (reelIndex + 1)
   *
   * For example, if `InvisibleSymbolsScalingFactor` is 10 and there are 4 reels, the number of invisible symbols per reel
   * from left to right will be: 10, 20, 30, and 40, respectively.
   *
   * As we move from left to right, each reel's animation lasts `(reelIndex + 1)` times longer.
   * This scaling ensures a constant animation speed (rate of symbol movement) across all reels.
   *
   * @param {number[][]} layoutResponse - A 2D array where each element numerically represents a response symbol
   *
   */
  createSymbolLayout(layoutResponse) {
    for (let i = 0; i < ReelsLayout.ReelsCount; i++) {
      const reel = new Reel(i);

      for (let j = 0; j < reel.totalSymbolsPerReel; j++) {
        const symbol = new Symbol(Symbol.calculateY(i, j));

        if (j >= reel.firstVisibleSymbolIndex) {
          symbol.setTexture(
            this.symbolTextures.getTexture(
              layoutResponse[i][j - reel.firstVisibleSymbolIndex]
            )
          );
        } else {
          symbol.setTexture(this.symbolTextures.getCustomTexture());
        }
        reel.container.addChild(symbol.sprite);
      }
      this.container.addChild(reel.container);
      this.reels.push(reel);
    }
  }

  /**
   * Animates all reels based on a layout response, staggering them progressively.
   *
   * Duration of each reel animation is calculated using the following formula:
   *    (totalDuration/reelsCount) * (reelIndex + 1)
   *
   *
   * @param {number[][]} layoutResponse - A 2D array where each inner array represents a reel,
   *   and each number corresponds to an index in the `symbolTextures` array.
   * @param {number} totalDuration - Total animation duration (in seconds) to spread across reels.
   * @returns {Promise<void>} Resolves when all reels have finished animating. Useful for post animation logic(enabling buttons)
   */
  animateReels(layoutResponse, totalDuration) {
    const animations = [];
    for (let i = 0; i < layoutResponse.length; i++) {
      const reelAnimationDuration =
        (((i + 1) * ReelsLayout.InvisibleSymbolsScalingFactor +
          ReelsLayout.InvisibleSymbolsConstant) /
          (ReelsLayout.InvisibleSymbolsConstant +
            ReelsLayout.ReelsCount *
              ReelsLayout.InvisibleSymbolsScalingFactor)) *
        totalDuration;

      animations.push(
        this.reels[i].animate(
          layoutResponse[i],
          reelAnimationDuration,
          this.symbolTextures
        )
      );
    }

    return Promise.all(animations);
  }

  startPaylineAnimation(winlines, displayTime = 1) {
    this.winlineAnimationTimeline = gsap.timeline({ repeat: -1 });
    for (const winline of winlines) {
      this.winlineAnimationTimeline
        .call(() => {
          this.displayOneWinline(winline);
        })
        .to({}, { duration: displayTime });
    }
  }

  displayOneWinline(winline) {
    for (let i = 0; i < ReelsLayout.ReelsCount; i++) {
      for (let j = 0; j < ReelsLayout.VisibleSymbolsPerReel; j++) {
        const sprite = this.reels[i].getVisibleSpriteAt(j);
        sprite.alpha = j === winline[i] ? 1 : 0.2;
      }
    }
  }

  resetSpritesVisiblity() {
    for (const reel of this.reels) {
      reel.container.children.forEach((sprite) => {
        sprite.alpha = 1;
      });
    }
  }

  /**
   * Calls fastForward() in order to speed up every reel's animation time.
   * It's used when a user wants to skip(speed up) the animation
   */
  fastForwardAll() {
    this.reels.forEach((reel) => reel.fastForward());
  }
}

class Reel {
  /** @type {PIXI.Container} Container holding all symbols for this reel */
  container;

  /** @type {number} Number of off-screen (invisible) symbols above visible ones */
  invisibleSymbolsPerReel;

  /** @type {number} Total number of symbols per reel (visible + invisible) */
  totalSymbolsPerReel;

  /** @type {number} Current index of the first visible symbol in the reel */
  firstVisibleSymbolIndex;

  timeline;

  /**
   * @param {number} index - the reel's expected index in reels[] array. Used to calculate invisible symbols and reel's x position
   */
  constructor(index) {
    this.container = new Container();

    this.invisibleSymbolsPerReel =
      ReelsLayout.InvisibleSymbolsScalingFactor * (index + 1) +
      ReelsLayout.InvisibleSymbolsConstant;

    this.totalSymbolsPerReel =
      this.invisibleSymbolsPerReel + ReelsLayout.VisibleSymbolsPerReel;

    this.firstVisibleSymbolIndex = this.invisibleSymbolsPerReel;

    this.container.x =
      ReelsLayout.HorizontalGap +
      index * (ReelsLayout.SymbolSize + ReelsLayout.HorizontalGap);

    this.timeline = null;
  }

  /**
   * Animates the reel from current layout to an expected one
   *
   * @param {number[]} expectedReelSymbolIndices - Array of numbers which represnts the expected result for that reel
   * @param {number} duration - Reel's animation duration in seconds.
   * @param {number} symbolTextures - Contains symbol textures and symbols' specfic information
   * @returns {Promise<void>} Resolves when the animation completes.
   */
  animate(expectedReelSymbolIndices, duration, symbolTextures) {
    for (let i = 0; i < expectedReelSymbolIndices.length; i++) {
      this.container.getChildAt(
        (this.firstVisibleSymbolIndex + i + ReelsLayout.VisibleSymbolsPerReel) %
          this.totalSymbolsPerReel
      ).texture = symbolTextures.getTexture(expectedReelSymbolIndices[i]);
    }

    const repositionY =
      this.invisibleSymbolsPerReel *
      (ReelsLayout.SymbolSize + ReelsLayout.VerticalGap);
    this.timeline = gsap.timeline();

    const children = this.container.children;

    //make a small move up before the main animation
    this.timeline.to(
      children,
      {
        y: "-=40",
        duration: 0.1,
        ease: "none",
      },
      0
    );

    // move all symbols down together
    this.timeline.to(
      children,
      {
        y: `+=${repositionY + 40}`,
        duration: duration,
        ease: "none",
      },
      `+=0`
    );

    // inertia bounce (down + back up)
    this.timeline.to(
      children,
      {
        y: "+=50", // bounce down
        duration: 0.1,
        ease: "power1.out",
      },
      `+=0`
    );

    this.timeline.to(
      children,
      {
        y: "-=50", // return to resting
        duration: 0.1,
        ease: "power1.in",
      },
      `+=0`
    );

    return new Promise((resolve) => {
      this.timeline.eventCallback("onComplete", () => {
        this.updateFirstVisibleSymbolIndex();

        //reposition the symbols back up so the animation is cyclic
        for (let i = 0; i < this.invisibleSymbolsPerReel; i++) {
          const sprite = this.container.getChildAt(
            (this.firstVisibleSymbolIndex +
              ReelsLayout.VisibleSymbolsPerReel +
              i) %
              this.totalSymbolsPerReel
          );
          sprite.y -=
            (ReelsLayout.SymbolSize + ReelsLayout.VerticalGap) *
            this.totalSymbolsPerReel;
        }

        resolve();
      });
    });
  }

  /**
   * Speeds up reel's gsap timeline. Used for speeding up the animation on demand
   */
  fastForward() {
    if (this.timeline) {
      this.timeline.timeScale(7);
    }
  }

  /**
   * Updates the value that represents the index of first visible reel
   * Used for correctly cycling the symbol reuse.
   */
  updateFirstVisibleSymbolIndex() {
    this.firstVisibleSymbolIndex =
      (this.firstVisibleSymbolIndex + ReelsLayout.VisibleSymbolsPerReel) %
      this.totalSymbolsPerReel;
  }

  getVisibleSpriteAt(index) {
    return this.container.getChildAt(
      (this.firstVisibleSymbolIndex + index) % this.totalSymbolsPerReel
    );
  }
}
