import { calculateNewEloDelta } from '../src/eloCalculation';

let teamA = [
  {
    name: 'nostra',
  },
  {
    name: 'andy',
  },
];

let teamB = [
  {
    name: 'kevo',
  },
  {
    name: 'gaspi',
  },
];

const personalScoreboard = {
  nostra: {
    elo: 1400,
  },
  andy: {
    elo: 1750,
  },
  kevo: {
    elo: 1500,
  },
  gaspi: {
    elo: 1600,
  },
};

describe('calculateNewEloDelta', () => {
  describe('when the team has won', () => {
    it('returns positive points variation for the teamA that has won', () => {
      expect(calculateNewEloDelta(teamA, true, teamB, personalScoreboard)).toBe(13);
    });
  });

  describe('when the team has lost', () => {
    it('returns negative points variation for the teamA that has lost', () => {
      expect(calculateNewEloDelta(teamA, false, teamB, personalScoreboard)).toBe(-17);
    });
  });
});
