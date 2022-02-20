import { room } from "./room";
import { downloadFile } from "./downloadFile";

var personalScoreboard = {};
var lastPlayerIdBallKick = null;
var secondLastPlayerIdBallKick = null;

function clearLastBallKicks() {
  lastPlayerIdBallKick = null;
  secondLastPlayerIdBallKick = null;
}

function initPersonalScoreboard(player) {
  if (personalScoreboard[player.name] != undefined) return;

  personalScoreboard[player.name] = {
    assists: 0,
    gamesLost: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    goals: 0,
    ownGoals: 0
  };
}

// Sends the scoreboard to all players ordered by player name
function showScoreboard() {
  var players = room.getPlayerList().sort(function(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  showScoreboardForPlayers(players, true)
}

// Shows the scoreboard for a list of players
function showScoreboardForPlayers(players, showInfo = true) {

  var scoreboard = "";
  if (showInfo) {
    scoreboard += "PJ: Partidos jugados - PG: Partidos ganados - PP: Partidos perdidos - G: Goles a favor - A: Asistencias - AG: Autogoles\n\n"
  }
  scoreboard += "PJ\tPG\tPP\tG\tA\tAG\tJugador\n";
  players.forEach(function(player) {
    scoreboard += personalScoreboard[player.name].gamesPlayed + "\t" + personalScoreboard[player.name].gamesWon + "\t" + personalScoreboard[player.name].gamesLost + "\t" + personalScoreboard[player.name].goals + "\t" + personalScoreboard[player.name].assists + "\t" + personalScoreboard[player.name].ownGoals + "\t" + player.name + "\n";
  });

  room.sendAnnouncement(scoreboard, null);
}

function handleScoreboardBallKick(player) {
  secondLastPlayerIdBallKick = lastPlayerIdBallKick;
  lastPlayerIdBallKick = player.id;
}

function handleScoreboardTeamGoal(team) {
  var player = room.getPlayer(lastPlayerIdBallKick);
  var secondPlayer = room.getPlayer(secondLastPlayerIdBallKick);

  // TODO: Ignore goals if the game is stopped before finishing (?)
  if (player.team == team) {
    personalScoreboard[player.name].goals++;

    if (secondPlayer && secondPlayer.name != player.name && secondPlayer.team == team) {
      personalScoreboard[secondPlayer.name].assists++;
    }
  } else {
    personalScoreboard[player.name].ownGoals++;
  }
}

function handleScoreboardTeamVictory(scores) {
  var redPlayers = room.getPlayerList().filter(function(player) {return player.team == 1});
  var bluePlayers = room.getPlayerList().filter(function(player) {return player.team == 2});
  var redWon = scores.red > scores.blue;

  redPlayers.forEach(function(player) {
    personalScoreboard[player.name].gamesPlayed++;

    if (redWon) {
      personalScoreboard[player.name].gamesWon++;
    } else {
      personalScoreboard[player.name].gamesLost++;
    }
  });

  bluePlayers.forEach(function(player) {
    personalScoreboard[player.name].gamesPlayed++;

    if (redWon) {
      personalScoreboard[player.name].gamesLost++;
    } else {
      personalScoreboard[player.name].gamesWon++;
    }
  });

  showScoreboard();
}

function exportScoreboardToCSV() {
  var csv = "playerName,dateTime,gamesPlayed,gamesWon,gamesLost,goals,assists,ownGoals\n";
  var today = new Date();
  Object.keys(personalScoreboard).map(function(playerName) {
    csv += playerName + "," +
      today.toISOString() + "," +
      personalScoreboard[playerName].gamesPlayed + "," +
      personalScoreboard[playerName].gamesWon + "," +
      personalScoreboard[playerName].gamesLost + "," +
      personalScoreboard[playerName].goals + "," +
      personalScoreboard[playerName].assists + "," +
      personalScoreboard[playerName].ownGoals + "\n";
  });

  return csv;
}

function downloadScoreboard() {
  var csv = exportScoreboardToCSV();
  var today = new Date();
  var filename = "Scoreboard " + today.toISOString() + ".csv";
  downloadFile(filename, csv);
}

export {
  clearLastBallKicks,
  downloadScoreboard,
  handleScoreboardBallKick,
  handleScoreboardTeamGoal,
  handleScoreboardTeamVictory,
  initPersonalScoreboard,
  showScoreboard,
  showScoreboardForPlayers
}
