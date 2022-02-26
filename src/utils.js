/*
 *  @param max {number} - the maximum number, exclusive
 *  @return {number} - a random number between 0 and (max - 1)
 */
function randomInt(max) {
  return Math.floor(Math.random() * max);
}

export { randomInt }
