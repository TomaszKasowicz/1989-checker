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
    "div.show-more-container.spektakle.wrapper",
  );
  readonly dayWrapLocator = this.showsLocator.locator("div.day-wrap");
  readonly spinnerLocator = this.page.locator("div.spinner");

  readonly timeLocator = (dayWrap: Locator) => dayWrap.locator("p.time");
  readonly repertoireIcons = (dayWrap: Locator) =>
    dayWrap.locator("div.repertoire-icons");
  readonly ticketsLocator = (dayWrap: Locator) =>
    dayWrap.locator("div.tickets");
  readonly ticketOption = (ticketsLocator: Locator) =>
    ticketsLocator.locator("div[data-instance-tickets]:not(.hide)");
  readonly ticketsLink = (ticketOption: Locator) =>
    ticketOption.getByRole("link", { name: "Bilet do teatru" });

  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto("https://teatrwkrakowie.pl/repertuar");
  }

  async selectShow() {
    await this.page.getByRole("link", { name: "Wybierz spektakl" }).click();
    await this.page
      .locator("a")
      .filter({ hasText: /^1989$/ })
      .click();
  }

  async getDayFor(dayWrap: Locator) {
    const text = await dayWrap.locator("div.day").innerText();
    const [day, monthAndYear] = text.split("\n");
    const [month, year] = monthAndYear.split(" ");
    const monthIndex = monthNames.indexOf(month);
    return new Date(parseInt(year), monthIndex, parseInt(day));
  }
}
