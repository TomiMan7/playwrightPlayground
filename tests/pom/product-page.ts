import { FrameLocator, Page, Locator } from '@playwright/test';

export class ProductsCartPOM {
  readonly page: Page;

  private readonly consentButton: Locator;
  private readonly cartLink: Locator;
  private readonly productInfo: Locator;
  private readonly adFrame: FrameLocator;
  private readonly closeAdButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.consentButton = page.getByRole('button', { name: 'Consent' });
    this.cartLink = page.getByRole('link', { name: ' Cart' });
    this.productInfo = page.getByText('View Product');
    this.adFrame = page.frameLocator('iframe[name="aswift_3"]');
    this.closeAdButton = this.adFrame.getByRole('button', { name: 'Close ad' });
  }

  async closeAdIfVisible(): Promise<void> {
    if (await this.closeAdButton.isVisible().catch(() => false)) {
      await this.closeAdButton.click();
    }
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

  async goToProductInfoPageAndCloseAdIfVisible(index: number): Promise<void> {
    await this.productInfo.nth(index - 1).scrollIntoViewIfNeeded();
    await this.productInfo.nth(index - 1).waitFor({ state: 'visible' });
    await this.productInfo.nth(index - 1).click();
    await this.closeAdIfVisible();
  }

  async goToCart(): Promise<void> {
    await this.clickElement(this.cartLink);
  }

  getCartRow(name: string): Locator {
    return this.page.getByRole('row', { name });
  }

  async goToSpecificProductInfoPageAndCloseAdIfVisible(itemId: number): Promise<void> {
    await this.gotoProductsPage();
    await this.closeAdIfVisible();
    await this.goToProductInfoPageAndCloseAdIfVisible(itemId);
  }
}
