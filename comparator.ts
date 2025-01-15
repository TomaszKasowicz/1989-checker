import {
  filterOutOnlyNewTicketsBasedOnTickets,
  toFullHour,
  toLocaleDateString,
} from './utils';
import { writeFileSync } from 'fs';
import { AvailableDate } from './tests/model';

import ticketsJSON from './tickets.json';
import newTicketsJSON from './new-tickets.json';
import { template } from './template';

const tickets: AvailableDate[] = ticketsJSON.map(ticket => ({
  ...ticket,
  date: new Date(ticket.date),
}));
const newTickets: AvailableDate[] = newTicketsJSON.map(ticket => ({
  ...ticket,
  date: new Date(ticket.date),
}));

const newTicketsOnly = filterOutOnlyNewTicketsBasedOnTickets(
  tickets,
  newTickets,
);

if (newTicketsOnly.length === 0) {
  console.log('No new tickets available');
  process.exit(0);
}

// Write new tickets to console
const ticketsToHtml = newTicketsOnly.map(ticket => ({
  ...ticket,
  date: toLocaleDateString(ticket.date),
  time: toFullHour(ticket.date),
}));
console.log('New tickets available:');
console.table(ticketsToHtml, ['date', 'time', 'href', 'reservation', 'icons']);

// Write new tickets to HTML
const html = template({ tickets: ticketsToHtml });
writeFileSync('new-tickets.html', html);

// Merge tickets and new tickets
const allTickets = tickets.concat(newTickets);

// Remove duplicates
const uniqueTickets = allTickets.filter(
  (ticket, index, self) =>
    index === self.findIndex(t => t.date.getTime() === ticket.date.getTime()),
);

// Write unique tickets to JSON
writeFileSync('tickets.json', JSON.stringify(uniqueTickets, null, 2));
