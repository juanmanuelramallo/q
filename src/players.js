import { room } from "./room";
import { getGameStatus, STOPPED } from "./gameStatus";

var redPlayers = [];
var bluePlayers = [];

function getRedPlayers() {
    return redPlayers;
}

function getBluePlayers() {
    return bluePlayers;
}

function setTeamPlayers() {
  if (getGameStatus() === STOPPED) { return; }

  redPlayers = room.getPlayerList().filter(function(player) { return player.team == 1 });
  bluePlayers = room.getPlayerList().filter(function(player) { return player.team == 2 });
}

export { getRedPlayers, getBluePlayers, setTeamPlayers };
