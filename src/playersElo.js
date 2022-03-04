import { getPersonalScoreboard } from "./scoreboard";

let url = "https://haxrecordings.s3.amazonaws.com/scoreboard.json";

let playersElo = async function () {
  const result = await fetch(url)

  return result.json();
};

const playersEloInJsonFormat = async function () {
  const previousElos = await playersElo();
  const newElos = getPersonalScoreboard();
  const allElos = {...previousElos, ...newElos};
  const orderedElosByNickname = Object.keys(allElos).sort().reduce(
    (ordered, key) => {
      ordered[key] = allElos[key];
      return ordered;
    },
    {}
  );
  return JSON.stringify(orderedElosByNickname);
}

export {
  playersElo,
  playersEloInJsonFormat,
}
