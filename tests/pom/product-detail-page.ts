import { Page, Locator } from '@playwright/test';

export class ProductInfoPOM {
  readonly page: Page;

  private readonly addToCartButton: Locator;
  private readonly productName: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productName = page.locator('.product-information h2');
    this.addToCartButton = page.getByRole('button', { name: ' Add to cart' });
    this.continueShoppingButton = page.getByRole('button', {
      name: 'Continue Shopping',
    });
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  async addProductToCartAndReturnItsName(): Promise<string | null> {
    await this.addToCartButton.click();
    await this.continueShoppingButton.click();

    return await this.productName.innerText();
  }
}
