import { Sprite } from "pixi.js";
import { AppSize } from "@/utility/common-types";

export class Logo {
  constructor({ headerTexture }) {
    this.header = new Sprite(headerTexture);
    this.header.anchor.x = 0.5;
    this.header.x = AppSize.Width / 2 - 20;

    this.header.y = ((AppSize.Height - 1066) / 2 - 85) / 2;
  }
}
