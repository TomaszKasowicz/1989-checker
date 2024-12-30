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

  // sort available dates by date which is a javascript Date object
  availableDates.sort((a, b) => a.date.getTime() - b.date.getTime());

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

    availableTimes.forEach(timeData => {
      const { time, ...rest } = timeData;
      console.log(date, time, `${date}T${time}Z`);
      availableDates.push({
        date: new Date(`${date}T${time}Z`), // ISO 8601 format
        ...rest,
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

    // Collect repertoire-icons
    const icons = await collectReportoireIcons(dayWrap);
    const ticketOptionText = await ticketOption.innerText();
    if (ticketOptionText.includes('Rezerwacje')) {
      availableTimes.push({
        time,
        reservation: ticketOptionText.trim(),
        icons,
      });
    }

    const ticketsLink = showsPage.ticketsLink(ticketOption);
    if (await ticketsLink.isVisible()) {
      const href = (await ticketsLink.getAttribute('href')) ?? undefined;
      availableTimes.push({
        time,
        href,
        icons,
      });
    }
  }
  return availableTimes;
}

async function collectReportoireIcons(dayWrap: Locator) {
  const columnWrap = showsPage.columnWrapLocator(dayWrap);
  const repertoireIconsWrapper = showsPage.repertoireIconsWrapper(columnWrap);
  const repertoireIcons = await showsPage
    .repertoireIcons(repertoireIconsWrapper)
    .all();

  const icons = [];
  for (const repertoireIcon of repertoireIcons) {
    const icon = await repertoireIcon.getAttribute('data-tooltip');
    icons.push(icon);
  }
  return icons;
}