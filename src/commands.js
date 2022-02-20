/******************************************************************************
 *
 * Commands
 *
 *****************************************************************************/

import { room } from './room';
import { showScoreboard, downloadScoreboard } from './scoreboard';
import { restorePosition } from './restorePosition';
import { e } from './emojis';

// Swaps the player from one team to the other
function swapPlayers() {
  room.getPlayerList().forEach(function(player) {
    if (player.team == 0) return;

    // y = mx + b --> equation of a straight line
    // y = -x + b --> with b=3 (x,y) = (1,2) (2,1)
    room.setPlayerTeam(player.id, -player.team + 3)
  });
}

var commands = {
  "!help": function(player) {
    room.sendAnnouncement(e("informationDeskWoman") + "\n!swap: Pa cambiar equipos\n!scoreboard: Give me the stats daddy\n!rr: Quien fue el pajero que tiro el teclado?\n!restore: Si te desconectas en medio de una partida, podes correr !restore para volver a donde estabas\n!ds: Descarga el scoreboard en csv");
  },
  "!rr": function(player) {
    room.sendAnnouncement(e("redExclamationMark") + "Reset pedido por " + player.name, null);
    room.stopGame();
    room.startGame();
  },
  "!swap": function(player) {
    room.sendAnnouncement(e("redExclamationMark") + "Swap pedido por " + player.name, null);
    swapPlayers();
  },
  "!scoreboard": function(player) {
    showScoreboard();
  },
  "!ds": function(player) {
    downloadScoreboard();
  },
  "!restore": function(player) {
    restorePosition(player);
  },
}

function handleCommandsFromChat(player, message) {
  if (message[0] != "!") return;

  commands[message].call(this, player);
}

export { handleCommandsFromChat };
