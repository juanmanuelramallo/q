/*
 *  How to use?
 *  1. Go to https://www.haxball.com/headless
 *  2. Paste this script into the console
 *  3. GLHF
 *
 *  Features & roadmap:
 *  [x] 1) Gives admin to all users
 *  [x] 2) Sets longbounce as the stadium
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
import { announcementMessages } from "./announcementMessages";

var stopRecordingStats = false

room.onGameTick = function() {
  storePlayerPositions();
}

room.onPlayerChat = function(player, message) {
  handleCommandsFromChat(player, message);
}

room.onPlayerJoin = function(player) {
  const isUnique = playerNameUniqueness(player);
  if (!isUnique) { return }

  room.setPlayerAdmin(player.id, true);
  initPersonalScoreboard(player);
  showScoreboardForPlayers([player], false);
  announcementMessages(player.name);
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
  if (stopRecordingStats) return

  handleScoreboardTeamGoal(team);

  const scores = room.getScores()
  const scoreLimit = scores.scoreLimit

  if (scores.red == scoreLimit || scores.blue == scoreLimit) {
    handleScoreboardTeamVictory(scores)
  }
}

room.onStadiumChange = function(newStadiumName, byPlayer) {
  // TODO: Decide if we want to record stats in stadiums other than the classic 2v2 Longbounce
  stopRecordingStats = newStadiumName !== 'Longbounce XXL from HaxMaps'
}

sendHappyMessages();
