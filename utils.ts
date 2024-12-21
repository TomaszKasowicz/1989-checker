export function toLocaleDateString(date: string | Date) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateStr = new Date(date).toLocaleDateString('pl-PL', options);

    // capitalize first letter
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}