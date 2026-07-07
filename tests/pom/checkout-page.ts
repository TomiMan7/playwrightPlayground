import { Page, Locator } from '@playwright/test';

export class CheckoutPagePOM {
  readonly page: Page;

  private readonly addToCartButton: Locator;
  private readonly productName: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly quantity: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productName = page.locator('.product-information h2');
    this.addToCartButton = page.getByRole('button', { name: ' Add to cart' });
    this.continueShoppingButton = page.getByRole('button', {
      name: 'Continue Shopping',
    });
    this.quantity = page.locator('.cart_quantity button');
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
