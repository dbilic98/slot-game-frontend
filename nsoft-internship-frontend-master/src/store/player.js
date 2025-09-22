let _playerId = null;
let _balance = null;
let _betAmount = 1;

export const playerState = {
  get balance() {
    return _balance;
  },
  set balance(value) {
    _balance = value;
  },
  get betAmount() {
    return _betAmount;
  },
  set betAmount(value) {
    _betAmount = value;
  },
  get playerId() {
    return _playerId;
  },
  set playerId(value) {
    _playerId = value;
  },
};
