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

  /**
   * Checks whether a cart item with the given name is visible.
   * @param value - the accessible name of the cart item heading to look for
   * @returns true if the item heading is visible, false otherwise
   */
  async validateCartItemVisibility(value: string): Promise<boolean> {
    return this.page
      .getByRole('heading', { name: value })
      .isVisible()
      .catch(() => false);
  }

  /**
   * Returns the quantity text for a specific cart item.
   * @param id - the product id of the cart item
   * @param page - the Playwright Page to query
   * @returns the quantity value as text
   */
  async returnCartItemQuantity(id: number, page: Page): Promise<string> {
    return page.locator(`#product-${id} .cart_quantity`).innerText();
  }
}
