import { Page, Locator } from '@playwright/test';

export class ProductsCartPOM {
  readonly page: Page;

  private readonly consentButton: Locator;
  private readonly addToCartButtons: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly cartLink: Locator;
  private readonly proceedToCheckoutButton: Locator;
  private readonly removeItemFromCartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.consentButton = page.getByRole('button', { name: 'Consent' });
    this.addToCartButtons = page.getByText('Add to cart');
    this.continueShoppingButton = page.getByRole('button', {
      name: 'Continue Shopping',
    });
    this.cartLink = page.getByRole('link', { name: ' Cart' });
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.removeItemFromCartButton = page.locator('.cart_quantity_delete');
  }

  async gotoProductsPage(): Promise<void> {
    await this.page.goto('https://automationexercise.com/products');
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  async handleConsent(isCI: boolean): Promise<void> {
    if (!isCI) {
      await this.consentButton.waitFor({ state: 'visible' });
      await this.clickElement(this.consentButton);
    }
  }

  async addProductToCart(index: number): Promise<void> {
    await this.addToCartButtons.nth(index).click();
    await this.continueShoppingButton.click();
  }

  async goToCart(): Promise<void> {
    await this.clickElement(this.cartLink);
  }

  getCartRow(name: string): Locator {
    return this.page.getByRole('row', { name });
  }

  proceedToCheckout(): Locator {
    return this.proceedToCheckoutButton;
  }

  async checkRemoveElementAttribute(value: number): Promise<boolean> {
    const asd = await this.removeItemFromCartButton.getAttribute('data-product-id');
    return asd === value.toString();
  }
}
