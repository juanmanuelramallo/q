var emojis = {
  "redExclamationMark": 10071,
  "faceWithSymbolsOverMouth": 129324,
  "faceWithRollingEyes": 128580,
  "informationDeskWoman": 128129,
  "smallBlueDiamond": 128313,
  "bug": 128027,
  "pray": 128591,
  "prayerBeads": 128255
}
function e(emoji) {
  return String.fromCodePoint(emojis[emoji]);
}

export { e };
