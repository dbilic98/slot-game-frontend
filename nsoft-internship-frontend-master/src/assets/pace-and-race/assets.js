const baseURL = import.meta.env.VITE_PACE_AND_RACE;

const assets = {
  background: {
    name: "background",
    mimeType: "png",
  },
  bonusSymbol: {
    name: "bonussymbol",
    mimeType: "png",
  },
  logo: {
    name: "logo",
    mimeType: "png",
  },
  reelBackground: {
    name: "reelbackground",
    mimeType: "png",
  },
  spin: {
    name: "Spin",
    mimeType: "png",
  },
  symbol1: {
    name: "symbol1",
    mimeType: "png",
  },
  symbol2: {
    name: "symbol2",
    mimeType: "png",
  },
  symbol3: {
    name: "symbol3",
    mimeType: "png",
  },
  symbol4: {
    name: "symbol4",
    mimeType: "png",
  },
  symbol5: {
    name: "symbol5",
    mimeType: "png",
  },
  symbol6: {
    name: "symbol6",
    mimeType: "png",
  },
  symbol7: {
    name: "symbol7",
    mimeType: "png",
  },
  wallet: {
    name: "wallet",
    mimeType: "png",
  },
  wildSymbol: {
    name: "wildsymbol",
    mimeType: "png",
  },
  money: {
    name: "money",
    mimeType: "png",
  },
  inter: {
    name: "inter",
    mimeType: "fnt",
  },
  closeIcon: {
    name: "close",
    mimeType: "png",
  },
  hamburger: {
    name: "header",
    mimeType: "png",
  },
  gameInfoIcon: {
    name: "gameinfo",
    mimeType: "png",
  },
  settingsIcon: {
    name: "settings",
    mimeType: "png",
  },
  moneyCountingSound: {
    name: "moneyCountingShorter",
    mimeType: "mp3",
  },
  backgroundSound: {
    name: "backgroundMusic",
    mimeType: "mp3",
  },
  spinSound: {
    name: "spinShorter",
    mimeType: "mp3",
  },
  switchOn: {
    name: "switchON",
    mimeType: "png",
  },
  switchOff: {
    name: "switchOFF",
    mimeType: "png",
  },
  paytableIcon: {
    name: "payoutIcon",
    mimeType: "png",
  },
};

export const assetsArray = Object.entries(assets).map(([key, asset]) => ({
  alias: key,
  src:
    asset.name === "inter"
      ? `/fonts/pace-and-race/${asset.name}.${asset.mimeType}`
      : `${baseURL}/${asset.name}.${asset.mimeType}`,
}));

export const gameInfoParagraphsPaceAndRace = [
  {
    title: "game_info_paragraphs_pace_and_race.game_overview.title",
    text: "game_info_paragraphs_pace_and_race.game_overview.text",
    gap: 340,
  },
  {
    title: "game_info_paragraphs_pace_and_race.rtp.title",
    text: "game_info_paragraphs_pace_and_race.rtp.text",
    gap: 590,
  },
  {
    title: "game_info_paragraphs_pace_and_race.core_mechanics.title",
    text: "game_info_paragraphs_pace_and_race.core_mechanics.text",
    gap: 880,
  },
  {
    title: "game_info_paragraphs_pace_and_race.special_symbols.title",
    text: "game_info_paragraphs_pace_and_race.special_symbols.text",
    gap: 1170,
  },
  {
    title: "game_info_paragraphs_pace_and_race.payline_rules.title",
    text: "game_info_paragraphs_pace_and_race.payline_rules.text",
    gap: 1550,
  },
];
