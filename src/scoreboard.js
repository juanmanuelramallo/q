import { room } from "./room";
import { downloadFile } from "./downloadFile";
import { e } from "./emojis";
import { getBluePlayers, getRedPlayers } from "./players";
import { calculateNewEloDelta } from './eloCalculation';

var personalScoreboard = {};
var lastPlayerIdBallKick = null;
var secondLastPlayerIdBallKick = null;
var scoreboardPaused = false;

function isScoreboardPaused() {
  return scoreboardPaused;
}

function pauseScoreboard(paused) {
  scoreboardPaused = paused;
}

function clearLastBallKicks() {
  lastPlayerIdBallKick = null;
  secondLastPlayerIdBallKick = null;
}

function initPersonalScoreboard(player, elo) {
  if (personalScoreboard[player.name] != undefined) return;

  personalScoreboard[player.name] = {
    assists: 0,
    elo: elo || 1500,
    currentEloDelta: 0,
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
    scoreboard += "PJ: Partidos jugados - ELO: Ranking del jugador - PG: Partidos ganados - PP: Partidos perdidos - G: Goles a favor - A: Asistencias - AG: Autogoles\n\n"
  }
  scoreboard += "PJ\tELO\t\tPG\tPP\tG\tA\tAG\tJugador\n";
  players.forEach(function(player) {
    scoreboard +=
      personalScoreboard[player.name].gamesPlayed + "\t"
        + personalScoreboard[player.name].elo + "\t"
        + personalScoreboard[player.name].gamesWon + "\t"
        + personalScoreboard[player.name].gamesLost + "\t"
        + personalScoreboard[player.name].goals + "\t"
        + personalScoreboard[player.name].assists + "\t"
        + personalScoreboard[player.name].ownGoals + "\t"
        + player.name + "\n";
  });

  room.sendAnnouncement(scoreboard, null);
  if (scoreboardPaused) {
    room.sendAnnouncement(e("redExclamationMark") + "Scoreboard pausado. Usa !usc para reanudar.");
  }
}

function handleScoreboardBallKick(player) {
  secondLastPlayerIdBallKick = lastPlayerIdBallKick;
  lastPlayerIdBallKick = player.id;
}

function handleScoreboardTeamGoal(team) {
  // Early return if scoreboard is disabled
  if (scoreboardPaused) { return; }

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
  // Early return if scoreboard is disabled
  if (scoreboardPaused) { return; }

  var redWon = scores.red > scores.blue;
  var blueWon = !redWon;
  let redPlayers = getRedPlayers()
  let bluePlayers = getBluePlayers();
  const personalScoreboardCopy = Object.assign({}, personalScoreboard);

  redPlayers.forEach(function(player) {
    personalScoreboard[player.name].gamesPlayed++;

    if (redWon) {
      personalScoreboard[player.name].gamesWon++;
    } else {
      personalScoreboard[player.name].gamesLost++;
    }

    let eloDelta = calculateNewEloDelta(redPlayers, redWon, bluePlayers, personalScoreboardCopy);
    personalScoreboard[player.name].elo += eloDelta;
    personalScoreboard[player.name].currentEloDelta = eloDelta;
  });

  bluePlayers.forEach(function(player) {
    personalScoreboard[player.name].gamesPlayed++;

    if (redWon) {
      personalScoreboard[player.name].gamesLost++;
    } else {
      personalScoreboard[player.name].gamesWon++;
    }

    let eloDelta = calculateNewEloDelta(bluePlayers, blueWon, redPlayers, personalScoreboardCopy);
    personalScoreboard[player.name].elo += eloDelta;
    personalScoreboard[player.name].currentEloDelta = eloDelta;
  });

  showScoreboard();
}

function exportScoreboardToCSV() {
  var csv = "playerName,dateTime,gamesPlayed,elo,gamesWon,gamesLost,goals,assists,ownGoals\n";
  var today = new Date();
  Object.keys(personalScoreboard).map(function(playerName) {
    csv += playerName + "," +
      today.toISOString() + "," +
      personalScoreboard[playerName].gamesPlayed + "," +
      personalScoreboard[playerName].elo + "," +
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

function getPersonalScoreboard() {
  return personalScoreboard;
}

function getEloDeltaForPlayer(player) {
  return personalScoreboard[player.name].currentEloDelta;
}

export {
  clearLastBallKicks,
  downloadScoreboard,
  handleScoreboardBallKick,
  handleScoreboardTeamGoal,
  handleScoreboardTeamVictory,
  initPersonalScoreboard,
  showScoreboard,
  showScoreboardForPlayers,
  pauseScoreboard,
  isScoreboardPaused,
  getPersonalScoreboard,
  getEloDeltaForPlayer
}
