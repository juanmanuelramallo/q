
function calculateNewEloDelta(teamPlayers, hasWon, opponentTeamPlayers) {
  var teamElo = totalTeamElo(teamPlayers);
  var opponentTeamElo = totalTeamElo(opponentTeamPlayers);

  return newEloDelta(teamElo, hasWon, opponentTeamElo);
}

function totalTeamElo(players) {
  return players.reduce(function(total, player) {
    var playerElo = Object.values(player)[0].elo;

    return total + playerElo;
  }, 0);
}

function newEloDelta(totalTeamElo, hasWon, totalOpponentTeamElo) {
  const k = 30;
  let finalScore = (hasWon ? 1 : 0);
  let expectedScore = 1 / (1 + 10**((totalOpponentTeamElo - totalTeamElo) / 400));

  return Math.round((finalScore - expectedScore) * k);
}

export { calculateNewEloDelta };
