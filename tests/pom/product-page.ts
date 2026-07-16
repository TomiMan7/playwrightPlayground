import { FrameLocator, Page, Locator } from '@playwright/test';

export class ProductsCartPOM {
  readonly page: Page;
  private readonly cartLink: Locator;
  private readonly productInfo: Locator;
  private readonly adFrame: FrameLocator;
  private readonly closeAdButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByRole('link', { name: ' Cart' });
    this.productInfo = page.getByText('View Product');
    this.adFrame = page.frameLocator('iframe[name="aswift_3"]');
    this.closeAdButton = this.adFrame.getByRole('button', { name: 'Close ad' });
  }
  /**
   * Closes the ad popup if it is currently visible
   */
  async closeAdIfVisible(): Promise<void> {
    if (await this.closeAdButton.isVisible().catch(() => false)) {
      await this.closeAdButton.click();
    }
  }

  async gotoProductsPage(): Promise<void> {
    const url = process.env.UI_URL;
    await this.page.goto(url + '/products');
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Opens the product info page at the given position, then closes the ad if visible.
   * @param index - 1-based position of the product in the list
   */
  async goToProductInfoPageAndCloseAdIfVisible(index: number): Promise<void> {
    await this.productInfo.nth(index - 1).scrollIntoViewIfNeeded();
    await this.productInfo.nth(index - 1).waitFor({ state: 'visible' });
    await this.productInfo.nth(index - 1).click();
    await this.closeAdIfVisible();
  }

  async goToCartPage(): Promise<void> {
    await this.clickElement(this.cartLink);
  }

  /**
   * Navigates to the products page and opens the info page for a specific product,
   * closing the ad if it appears at any step.
   * @param itemId - 1-based position/id of the product to open
   */
  async goToSpecificProductInfoPageAndCloseAdIfVisible(itemId: number): Promise<void> {
    await this.gotoProductsPage();
    await this.closeAdIfVisible();
    await this.goToProductInfoPageAndCloseAdIfVisible(itemId);
  }
}
