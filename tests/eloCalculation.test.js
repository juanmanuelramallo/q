import { calculateNewEloDelta } from '../src/eloCalculation';

let teamA = [
  {
    nostra: {
      elo: 1400,
    },
  },
  {
    andy: {
      elo: 1750,
    },
  },
];

let teamB = [
  {
    kevo: {
      elo: 1500,
    },
  },
  {
    gaspi: {
      elo: 1600,
    },
  },
];

describe('calculateNewEloDelta', () => {
  describe('when the team has won', () => {
    it('returns positive amount', () => {
      expect(calculateNewEloDelta(teamA, true, teamB)).toBe(13);
    });
  });

  describe('when the team has lost', () => {
    it('returns negative amount', () => {
      expect(calculateNewEloDelta(teamA, false, teamB)).toBe(-17);
    });
  });
});
