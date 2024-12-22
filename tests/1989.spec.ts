import { test, expect, Locator } from '@playwright/test';
import { writeFile } from 'fs/promises';
import { toLocaleDateString } from '../utils';
import { ShowsPageObject } from './shows.po';
import { AvailableDate } from './model';

let showsPage: ShowsPageObject;

test.beforeEach(async ({ page }) => {
  showsPage = new ShowsPageObject(page);
});

test('Check Dates', async ({ page }) => {
  await showsPage.open();
  await showsPage.selectShow();

  await expect(showsPage.spinnerLocator).toBeHidden();

  const count = await showsPage.dayWrapLocator.count();
  test.info().annotations.push({ type: 'count', description: `${count}` });

  // No Shows
  if (count === 0) {
    return;
  }

  const availableDates = await collectDayData();

  // sort available dates by date and time
  availableDates.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return a.time.localeCompare(b.time);
  });
  await writeFile('new-tickets.json', JSON.stringify(availableDates, null, 2));

  console.log('Available dates:');
  console.table(
    availableDates.map(d => ({ ...d, date: toLocaleDateString(d.date) })),
  );
});

async function collectDayData() {
  const dayWraps = await showsPage.dayWrapLocator.all();

  const availableDates: AvailableDate[] = [];
  for (const dayWrap of dayWraps) {
    const availableTimes = await collectTimeData(dayWrap);
    if (availableTimes.length === 0) {
      continue;
    }

    const date = await showsPage.getDayFor(dayWrap);

    availableTimes.forEach(time => {
      availableDates.push({
        date,
        ...time,
      });
    });
  }
  return availableDates;
}

async function collectTimeData(dayWrap: Locator) {
  const ticketsLocator = showsPage.ticketsLocator(dayWrap);
  const times = await showsPage.timeLocator(dayWrap).all();
  const availableTimes = [];
  for (const timeLocator of times) {
    await timeLocator.click();
    const time = (await timeLocator.innerText()).trim();
    const ticketOption = showsPage.ticketOption(ticketsLocator);

    const ticketOptionText = await ticketOption.innerText();
    if (ticketOptionText.includes('Rezerwacje')) {
      availableTimes.push({
        time,
        reservation: ticketOptionText.trim(),
      });
    }

    const ticketsLink = showsPage.ticketsLink(ticketOption);
    if (await ticketsLink.isVisible()) {
      const href = (await ticketsLink.getAttribute('href')) ?? undefined;
      availableTimes.push({
        time,
        href,
      });
    }
  }
  return availableTimes;
}
