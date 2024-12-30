import { filterOutOnlyNewTicketsBasedOnTickets } from './utils';

describe('Utils', () => {
  describe('filterOutOnlyNewTicketsBasedOnTickets', () => {
    const existingTickets = [
      { date: new Date('2025-03-06T19:00:00.000Z') },
      { date: new Date('2025-03-07T12:00:00.000Z') },
      { date: new Date('2025-03-07T12:00:00.000Z') },
    ];

    it('should return new tickets only', () => {
      const newTickets = [
        ...existingTickets,
        { date: new Date('2025-03-08T12:00:00.000Z') },
      ];

      const result = filterOutOnlyNewTicketsBasedOnTickets(
        existingTickets,
        newTickets,
      );

      expect(result).toEqual([{ date: new Date('2025-03-08T12:00:00.000Z') }]);
    });

    it('should return empty array if no new tickets', () => {
      const result = filterOutOnlyNewTicketsBasedOnTickets(
        existingTickets,
        existingTickets,
      );

      expect(result).toEqual([]);
    });

    it('should return empty array when one of the new tickets was removed', () => {
      const newTickets = existingTickets.slice(0, 2);

      const result = filterOutOnlyNewTicketsBasedOnTickets(
        existingTickets,
        newTickets,
      );

      expect(result).toEqual([]);
    });
  });
});
