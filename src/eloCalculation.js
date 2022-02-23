
function calculateNewEloDelta(teamPlayers, hasWon, opponentTeamPlayers) {
  const teamElo = totalTeamElo(teamPlayers);
  const opponentTeamElo = totalTeamElo(opponentTeamPlayers);

  return newEloDelta(teamElo, hasWon, opponentTeamElo);
}

function totalTeamElo(players) {
  return players.reduce(function(total, player) {
    const playerElo = Object.values(player)[0].elo;

    return total + playerElo;
  }, 0);
}

function newEloDelta(totalTeamElo, hasWon, totalOpponentTeamElo) {
  const k = 30;
  const finalScore = (hasWon ? 1 : 0);
  const expectedScore = 1 / (1 + 10**((totalOpponentTeamElo - totalTeamElo) / 400));

  return Math.round((finalScore - expectedScore) * k);
}

export { calculateNewEloDelta };
