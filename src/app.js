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

import { handleStopRecording } from "./recording";
import { room } from "./room";
import {
  clearLastBallKicks,
  handleScoreboardBallKick,
  handleScoreboardTeamGoal,
  handleScoreboardTeamVictory,
  initPersonalScoreboard,
  showScoreboardForPlayers,
} from "./scoreboard";
import { e } from "./emojis";
import {
  clearPlayerPositions,
  handleRestorePositionPlayerLeave,
  storePlayerPositions
} from "./restorePosition";
import { handleCommandsFromChat } from "./commands";
import { getGameStatus, setGameStatus, STARTED, STOPPED, PAUSED } from "./gameStatus";
import { playerNameUniqueness } from "./playerNameUniqueness";
import { sendHappyMessages } from "./sendHappyMessages"

room.onGameTick = function() {
  storePlayerPositions();
}

room.onPlayerChat = function(player, message) {
  handleCommandsFromChat(player, message);
}

room.onPlayerJoin = function(player) {
  isUnique = playerNameUniqueness(player);
  if (!isUnique) { return }

  room.setPlayerAdmin(player.id, true);
  initPersonalScoreboard(player);
  showScoreboardForPlayers([player], false);
}

room.onPlayerLeave = function(player) {
  handleRestorePositionPlayerLeave(player);
}

room.onGameStart = function(byPlayer) {
  setGameStatus(STARTED);
  clearLastBallKicks();
  clearPlayerPositions();
  room.startRecording();
}

room.onGameStop = function(byPlayer) {
  setGameStatus(STOPPED);
  handleStopRecording(room.stopRecording());
}

room.onGamePause = function(byPlayer) {
  setGameStatus(PAUSED);
}

room.onPlayerBallKick = function(player) {
  handleScoreboardBallKick(player);
}

room.onTeamGoal = function(team) {
  handleScoreboardTeamGoal(team);

  const scores = room.getScores()
  const scoreLimit = scores.scoreLimit

  if (scores.red == scoreLimit || scores.blue == scoreLimit) {
    handleScoreboardTeamVictory(scores)
  }
}

sendHappyMessages();
