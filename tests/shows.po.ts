import { Locator, Page } from "@playwright/test";
const monthNames = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];
export class ShowsPageObject {
  readonly showsLocator = this.page.locator(
    'div.show-more-container.spektakle.wrapper',
  );
  readonly dayWrapLocator = this.showsLocator.locator('div.day-wrap');
  readonly spinnerLocator = this.page.locator('div.spinner');

  readonly timeLocator = (dayWrap: Locator) => dayWrap.locator('p.time');

  readonly columnWrapLocator = (dayWrap: Locator) =>
    dayWrap.locator('div.column-wrap');

  readonly repertoireIconsWrapper = (columnWrap: Locator) =>
    columnWrap.locator('div.repertoire-icons');

  readonly repertoireIcons = (repertoireIconsWrapper: Locator) =>
    repertoireIconsWrapper.locator('div[data-tooltip]:not(.hide-btn)');

  readonly ticketsLocator = (dayWrap: Locator) =>
    dayWrap.locator('div.tickets');

  readonly ticketOption = (ticketsLocator: Locator) =>
    ticketsLocator.locator('div[data-instance-tickets]:not(.hide)');

  readonly ticketsLink = (ticketOption: Locator) =>
    ticketOption.getByRole('link', { name: 'Bilet do teatru' });

  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('https://teatrwkrakowie.pl/repertuar');
  }

  async selectShow() {
    await this.page.getByRole('link', { name: 'Wybierz spektakl' }).click();
    await this.page
      .locator('a')
      .filter({ hasText: /^1989$/ })
      .click();
  }

  async getDayFor(dayWrap: Locator) {
    const text = await dayWrap.locator('div.day').innerText();
    const [day, monthAndYear] = text.split('\n');
    const [month, year] = monthAndYear.split(' ');
    const monthIndex = monthNames.indexOf(month);
    const paddedMonth =
      monthIndex < 9 ? `0${monthIndex + 1}` : `${monthIndex + 1}`;
    return `${year}-${paddedMonth}-${day}`;
  }
}
