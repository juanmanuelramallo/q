/******************************************************************************
 *
 * Commands
 *
 *****************************************************************************/

import { room } from './room';
import { showScoreboard, downloadScoreboard } from './scoreboard';
import { restorePosition } from './restorePosition';
import { e } from './emojis';
import { longbounceStadium } from './stadiums/longbounce';
import { longbounce3v3 } from './stadiums/longbounce3v3';

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
  "!help": {
    description: "Aiudaaaa",
    func: function(player) { showHelp() }
  },
  "!rr": {
    description: "Quien fue el pajero que tiro el teclado?",
    func: function(player) {
      room.sendAnnouncement(e("redExclamationMark") + "Reset pedido por " + player.name, null);
      room.stopGame();
      room.startGame();
    },
  },
  "!swap": {
    description: "Pa cambiar equipos",
    func: function(player) {
      room.sendAnnouncement(e("redExclamationMark") + "Swap pedido por " + player.name, null);
      swapPlayers();
    }
  },
  "!sc": {
    description: "Give me the stats daddy",
    func: function(player) { showScoreboard() }
  },
  "!ds": {
    description: "Descarga el scoreboard en csv",
    func: function(player) { downloadScoreboard() }
  },
  "!restore": {
    description: "Si te desconectas en medio de una partida, podes correr !restore para volver a donde estabas",
    func: function(player) { restorePosition(player) }
  },
  "!3v3": {
    description: "Sale ese 3v3. Todos alaben al bicho",
    func: function(player) { room.setCustomStadium(longbounce3v3) }
  },
  "!2v2": {
    description: "Sale ese 2v2",
    func: function(player) { room.setCustomStadium(longbounceStadium) }
  },
}

function showHelp() {
  var msg = e("informationDeskWoman") + "\n";
  Object.keys(commands).forEach(function(command) {
    var meta = commands[command];
    msg += e("smallBlueDiamond") + " " + command + ": " + meta.description + "\n";
  });
  room.sendAnnouncement(msg);
}

function handleCommandsFromChat(player, message) {
  if (message[0] != "!") return;

  commands[message].func.call(this, player);
}

export { handleCommandsFromChat };
