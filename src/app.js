/*
 *  How to use?
 *  1. Go to https://www.haxball.com/headless
 *  2. Paste this script into the console
 *  3. GLHF
 *
 *  Features & roadmap:
 *  [x] 1) Gives admin to all users
 *  [ ] 2) Sets longbounce as the stadium
 *  [x] 3) Records matches
 *  [ ] 4) Celebrations with avatars
 *  [x] 5) Commands to manage a game: restart and swap
 *  [x] 6) Global scoreboard
 *  [ ] 7) Pause on AFKs
 *  [ ] 8) Export scoreboard to a csv
 *  [x] 9) Pause on disconnect
 *  [ ] 10) New game mode? Portalhax, ball passes through portals
 */

var room = HBInit({
	roomName: "Longaniza",
	maxPlayers: 16,
	noPlayer: true
});

room.setDefaultStadium("Big");
room.setScoreLimit(1);
room.setTimeLimit(0);

const STOPPED = 0;
const STARTED = 1;
const PAUSED = 2;
var gameStatus = STOPPED;

var emojis = {
  "redExclamationMark": 10071,
  "faceWithSymbolsOverMouth": 129324,
  "faceWithRollingEyes": 128580
}
function e(emoji) {
  return String.fromCodePoint(emojis[emoji]);
}

/******************************************************************************
 *
 * Commands
 *
 *****************************************************************************/

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
  "!restore": function(player) {
    restorePosition(player);
  },
}

room.onPlayerChat = function(player, message) {
  if (message[0] != "!") return;

  commands[message].call(this, player);
}

/******************************************************************************
 *
 *  Recording
 *
 * ****************************************************************************/

function download(filename, uint8Array) {
  var element = document.createElement('a');
  var blob = new Blob([uint8Array], { type: "text/html;charset=UTF-8" });
  var url = URL.createObjectURL(blob);
  element.setAttribute('href', url);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function handleStopRecording(recording) {
  var today = new Date();
  var filename = "Recording " + today.toDateString() + " " + today.toLocaleTimeString() + ".hbr2";
  download(filename, recording);
  // TODO: Perhaps send it to a s3-like service
}

/******************************************************************************
 *
 *  Scoreboard
 *
 * ****************************************************************************/

var personalScoreboard = {};
var lastPlayerIdBallKick = null;
var secondLastPlayerIdBallKick = null;

function initPersonalScoreboard(player) {
  if (personalScoreboard[player.id] != undefined) return;

  personalScoreboard[player.id] = {
    assists: 0,
    goals: 0,
    ownGoals: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0
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
    scoreboard += personalScoreboard[player.id].gamesPlayed + "\t" + personalScoreboard[player.id].gamesWon + "\t" + personalScoreboard[player.id].gamesLost + "\t" + personalScoreboard[player.id].goals + "\t" + personalScoreboard[player.id].assists + "\t" + personalScoreboard[player.id].ownGoals + "\t" + player.name + "\n";
  });

  room.sendAnnouncement(scoreboard, null);
}

room.onPlayerBallKick = function(player) {
  secondLastPlayerIdBallKick = lastPlayerIdBallKick;
  lastPlayerIdBallKick = player.id;
}

room.onTeamGoal = function(team) {
  var player = room.getPlayer(lastPlayerIdBallKick);
  var secondPlayer = room.getPlayer(secondLastPlayerIdBallKick);

  if (player.team == team) {
    personalScoreboard[player.id].goals++;

    if (secondPlayer && secondPlayer.team == team) {
      personalScoreboard[secondPlayer.id].assists++;
    }
  } else {
    personalScoreboard[player.id].ownGoals++;
  }
}

room.onTeamVictory = function(scores) {
  var redPlayers = room.getPlayerList().filter(function(player) {return player.team == 1});
  var bluePlayers = room.getPlayerList().filter(function(player) {return player.team == 2});
  var redWon = scores.red > scores.blue;

  redPlayers.forEach(function(player) {
    personalScoreboard[player.id].gamesPlayed++;

    if (redWon) {
      personalScoreboard[player.id].gamesWon++;
    } else {
      personalScoreboard[player.id].gamesLost++;
    }
  });

  bluePlayers.forEach(function(player) {
    personalScoreboard[player.id].gamesPlayed++;

    if (redWon) {
      personalScoreboard[player.id].gamesLost++;
    } else {
      personalScoreboard[player.id].gamesWon++;
    }
  });

  showScoreboard();
}

/******************************************************************************
 *
 *  Restore player position on disconnect
 *
 * ****************************************************************************/

var playerPositions = {};

function storePlayerPositions() {
  if (room.getScores() == null) return;

  var players = room.getPlayerList();
  players.forEach(function(player) {
    if (player.team == 0) return;

    playerPositions[player.name] = {
      x: player.position.x,
      y: player.position.y,
      team: player.team,
      restoreEnabled: false
    };
  });
}

function restorePosition(player) {
  if (gameStatus == STOPPED) return;
  if (playerPositions[player.name] == undefined) return;
  if (!playerPositions[player.name].restoreEnabled) return;

  if (gameStatus != PAUSED) {
    room.pauseGame(true);
  }

  room.setPlayerTeam(player.id, playerPositions[player.name].team);
  room.setPlayerDiscProperties(player.id, {
    x: playerPositions[player.name].x,
    y: playerPositions[player.name].y,
  });

  playerPositions[player.name].restoreEnabled = false;
  room.sendAnnouncement(e("faceWithRollingEyes") + " Devolviendo la posicion a " + player.name);
}

/******************************************************************************
 *
 *  Game
 *
 * ****************************************************************************/

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function handlePlayerLeave(player) {
  if (randomInt(3) == 0) {
    room.sendAnnouncement(e("faceWithSymbolsOverMouth") + "Rage quit " + player.name + "?", null);
  }

  if (player.team == 0) return;

  room.pauseGame(true);
  playerPositions[player.name].restoreEnabled = true;
  room.sendAnnouncement(e("redExclamationMark") + "Pausa. Se fue " + player.name + ".", null);
}

room.onGameTick = function() {
  storePlayerPositions();
}

room.onPlayerJoin = function(player) {
  room.setPlayerAdmin(player.id, true);
  initPersonalScoreboard(player);
  showScoreboardForPlayers([player], false);
}

room.onPlayerLeave = function(player) {
  handlePlayerLeave(player);
}

room.onGameStart = function(byPlayer) {
  gameStatus = STARTED;
  lastPlayerIdBallKick = null;
  secondLastPlayerIdBallKick = null;
  playerPositions = {};
  room.startRecording();
}

room.onGameStop = function(byPlayer) {
  gameStatus = STOPPED;
  handleStopRecording(room.stopRecording());
}

room.onGamePause = function(byPlayer) {
  gameStatus = PAUSED;
}
