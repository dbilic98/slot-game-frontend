const baseURL = import.meta.env.VITE_CRAZY_PIRATE;

const assets = {
  background: {
    name: "staticBackground",
    mimeType: "png",
  },
  logo: {
    name: "staticLogo",
    mimeType: "png",
  },
  reelBackground: {
    name: "staticReelv2",
    mimeType: "png",
  },
  rope: {
    name: "staticRope",
    mimeType: "png",
  },
  spin: {
    name: "staticSpinButton",
    mimeType: "png",
  },
  wallet: {
    name: "wallet",
    mimeType: "png",
  },
  money: {
    name: "money",
    mimeType: "png",
  },
  symbol1: {
    name: "staticSymbol01",
    mimeType: "png",
  },
  symbol2: {
    name: "staticSymbol02",
    mimeType: "png",
  },
  symbol3: {
    name: "staticSymbol03",
    mimeType: "png",
  },
  symbol4: {
    name: "staticSymbol04",
    mimeType: "png",
  },
  symbol5: {
    name: "staticSymbol05",
    mimeType: "png",
  },
  symbol6: {
    name: "staticSymbol06",
    mimeType: "png",
  },
  symbol7: {
    name: "staticSymbol07",
    mimeType: "png",
  },
  wildSymbol: {
    name: "staticSymbol09",
    mimeType: "png",
  },
  bonusSymbol: {
    name: "staticSymbol08",
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
      ? `/fonts/crazy-pirate/${asset.name}.${asset.mimeType}`
      : `${baseURL}/${asset.name}.${asset.mimeType}`,
}));

export const gameInfoParagraphsCrazyPirate = [
  {
    title: "game_info_paragraphs_crazy_pirate.game_overview.title",
    text: "game_info_paragraphs_crazy_pirate.game_overview.text",
    gap: 340,
  },
  {
    title: "game_info_paragraphs_crazy_pirate.rtp.title",
    text: "game_info_paragraphs_crazy_pirate.rtp.text",
    gap: 590,
  },
  {
    title: "game_info_paragraphs_crazy_pirate.core_mechanics.title",
    text: "game_info_paragraphs_crazy_pirate.core_mechanics.text",
    gap: 880,
  },
  {
    title: "game_info_paragraphs_crazy_pirate.special_symbols.title",
    text: "game_info_paragraphs_crazy_pirate.special_symbols.text",
    gap: 1170,
  },
  {
    title: "game_info_paragraphs_crazy_pirate.payline_rules.title",
    text: "game_info_paragraphs_crazy_pirate.payline_rules.text",
    gap: 1550,
  },
];
