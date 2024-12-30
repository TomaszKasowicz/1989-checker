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
console.table(ticketsToHtml);

// Write new tickets to HTML
const html = template({ tickets: ticketsToHtml });
writeFileSync('new-tickets.html', html);
