import { room } from "./room";

function playerNameUniqueness(player) {
  var players = room.getPlayerList();
  var playerNames = players.map(p => p.name);
  var deleted = playerNames.splice(0, 2, player.name);
  if (deleted.length == 2) {
    room.kickPlayer(player.id, "Ya ahi alguien con ese nombre conectado", false);
    return false;
  }

  return true;
}

export { playerNameUniqueness };
