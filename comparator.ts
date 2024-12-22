import tickets from "./tickets.json";
import newTickets from "./new-tickets.json";
import handlebars from "handlebars";
import { toLocaleDateString } from "./utils";
import { writeFileSync, renameSync } from "fs";
type Ticket = {
  date: string;
  ticketsLink: string;
};

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
            <a href="{{ticketsLink}}">{{date}}</a>
        </li>
        {{/each}}
    </ul>
</body>
</html>
`;

const template = handlebars.compile(htmlTemplate);

const filterOutOnlyNewTicketsBasedOnTickets = (
  tickets: Ticket[],
  newTickets: Ticket[],
) => {
  return newTickets.filter(newTicket => {
    return !tickets.some(ticket => ticket.date === newTicket.date);
  });
};

const newTicketsOnly = filterOutOnlyNewTicketsBasedOnTickets(
  tickets,
  newTickets,
);

if (newTicketsOnly.length === 0) {
  console.log("No new tickets available");
  process.exit(0);
}

// Write new tickets to console
const ticketsToHtml = newTicketsOnly.map(ticket => ({
  ...ticket,
  date: toLocaleDateString(ticket.date),
}));
console.log("New tickets available:");
console.table(ticketsToHtml);

// Write new tickets to HTML
const html = template({ tickets: ticketsToHtml });
writeFileSync("new-tickets.html", html);

// Store tickets for future comparison
renameSync("new-tickets.json", "tickets.json");
console.log("Tickets stored for future comparison");
