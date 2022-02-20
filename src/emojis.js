var emojis = {
  "redExclamationMark": 10071,
  "faceWithSymbolsOverMouth": 129324,
  "faceWithRollingEyes": 128580,
  "informationDeskWoman": 128129
}
function e(emoji) {
  return String.fromCodePoint(emojis[emoji]);
}

export { e };
