import { Page, Locator } from '@playwright/test';

export class CheckoutPagePOM {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  async validateCartItem(value: string): Promise<boolean> {
    return this.page
      .getByRole('heading', { name: value })
      .isVisible()
      .catch(() => false);
  }

  async returnCartItemQuantity(id: number, page: Page): Promise<string> {
    return page.locator(`#product-${id} .cart_quantity`).innerText();
  }
}
