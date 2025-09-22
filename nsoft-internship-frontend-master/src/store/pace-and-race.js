import { sound } from "@pixi/sound";

let _isGameActive = false;
let _isSpinSpedUp = false;
let _gameId = 2;
let _areSoundsActive = false;
let _betAmounts = null;

export const gameState = {
  get isGameActive() {
    return _isGameActive;
  },
  set isGameActive(value) {
    _isGameActive = value;
  },

  get isSpinSpedUp() {
    return _isSpinSpedUp;
  },
  set isSpinSpedUp(value) {
    _isSpinSpedUp = value;
  },

  get gameId() {
    return _gameId;
  },

  get areSoundsActive() {
    return _areSoundsActive;
  },
  set areSoundsActive(value) {
    _areSoundsActive = value;
    const bgSound = sound.find("backgroundSound");
    if (_areSoundsActive) {
      if (!bgSound.isPlaying) {
        sound.play("backgroundSound", { loop: true, volume: 0.1 });
      }
    } else {
      sound.stop("backgroundSound");
    }
  },
  set betAmounts(value) {
    _betAmounts = value;
  },
  get betAmounts() {
    return _betAmounts;
  },
};
