import handlebars from 'handlebars';
import { toFullHour, toLocaleDateString } from './utils';
import { writeFileSync } from 'fs';
import { AvailableDate } from './tests/model';

import ticketsJSON from './tickets.json';
import newTicketsJSON from './new-tickets.json';

const tickets: AvailableDate[] = ticketsJSON.map(ticket => ({
  ...ticket,
  date: new Date(ticket.date),
}));
const newTickets: AvailableDate[] = newTicketsJSON.map(ticket => ({
  ...ticket,
  date: new Date(ticket.date),
}));

const htmlTemplate = `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nowe bilety</title>
</head>
<body>
    <h1>Nowe bilety na spektakl 1989 </h1>
    <ul>
        {{#each tickets}}
        <li>
            {{#if href}}
                <a href="{{href}}">{{date}} - {{time}}</a>
            {{/if}}
            {{#if reservation}}
                {{date}} - {{time}} - {{reservation}}
            {{/if}}
        </li>
        {{/each}}
    </ul>
</body>
</html>
`;

const template = handlebars.compile(htmlTemplate);

const filterOutOnlyNewTicketsBasedOnTickets = (
  tickets: AvailableDate[],
  newTickets: AvailableDate[],
) =>
  newTickets.filter(
    nT => !tickets.some(t => t.date.getTime() === nT.date.getTime()),
  );

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