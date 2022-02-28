import { room } from "./room";
import { getPersonalScoreboard } from "./scoreboard";

let url = "https://haxrecordings.s3.amazonaws.com/scoarboard.json";

let playersElo = async function () {
  const result = await fetch(url)

  return result.json();
};

const showElosInJsonFormat = async function () {
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
  const elosInJSON = JSON.stringify(orderedElosByNickname);
  room.sendAnnouncement(elosInJSON);
}

export {
  playersElo,
  showElosInJsonFormat,
}
