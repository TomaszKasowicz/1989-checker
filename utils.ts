export function toLocaleDateString(date: string | Date) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  };
  const dateStr = new Date(date).toLocaleDateString('pl-PL', options);

  // capitalize first letter
  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

export function toFullHour(date: string | Date) {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  };
  return new Date(date).toLocaleTimeString('pl-PL', options);
}

export function filterOutOnlyNewTicketsBasedOnTickets(
  tickets: { date: Date }[],
  newTickets: { date: Date }[],
) {
  return newTickets.filter(
    nT => !tickets.some(t => t.date.getTime() === nT.date.getTime()),
  );
}
