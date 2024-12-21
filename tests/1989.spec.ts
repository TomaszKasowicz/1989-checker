import { test, expect, Page, Locator } from '@playwright/test';
import { writeFile } from 'fs/promises'
import { toLocaleDateString } from '../utils';

const monthNames = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień'
];

class ShowsPageObject {
  
  readonly showsLocator = this.page.locator('div.show-more-container.spektakle.wrapper');
  readonly dayWrapLocator = this.showsLocator.locator('div.day-wrap');
  readonly spinnerLocator = this.page.locator('div.spinner');
  
  readonly ticketsLink = (dayWrap: Locator) => dayWrap.getByRole('link', { name: 'Bilet do teatru' });
  
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('https://teatrwkrakowie.pl/repertuar');
  }

  async selectShow() {
    await this.page.getByRole('link', { name: 'Wybierz spektakl' }).click();
    await this.page.locator('a').filter({ hasText: /^1989$/ }).click();
  }

  async getDayFor(dayWrap: Locator) {
    const text =  await dayWrap.locator('div.day').innerText();
    const [day, monthAndYear] = text.split('\n');
    const [month, year] = monthAndYear.split(' ');
    const monthIndex = monthNames.indexOf(month);
    return new Date(parseInt(year), monthIndex, parseInt(day));
  }
}


test('Check Dates', async ({ page }) => {
  const showsPage = new ShowsPageObject(page);
  await showsPage.open();
  await showsPage.selectShow();

  await expect(showsPage.spinnerLocator).toBeHidden();

  const count = await showsPage.dayWrapLocator.count();
  test.info().annotations.push({ type: 'count', description: `${count}` });

  // No Shows
  if (count === 0) {
    return;
  }

  const availableDates = [];
  for (let i=0; i<count; i++) {
    const dayWrapLocator = showsPage.dayWrapLocator.nth(i);
    if (!await showsPage.ticketsLink(dayWrapLocator).isVisible()) {
        continue;
    }

    const ticketsLink = await showsPage.ticketsLink(dayWrapLocator).getAttribute('href');
    const date = await showsPage.getDayFor(dayWrapLocator);

        // TODO: Add Icons
        availableDates.push({ date, ticketsLink });
    }

  availableDates.sort((a, b) => a.date.getTime() - b.date.getTime());
  await writeFile('new-tickets.json', JSON.stringify(availableDates, null, 2));
});