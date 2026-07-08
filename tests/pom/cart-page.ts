import { Page, Locator } from '@playwright/test';

export class CartPagePOM {
  readonly page: Page;

  private readonly proceedToCheckoutButton: Locator;
  private readonly registerPopup: Locator;
  private readonly registerPopupButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.registerPopup = page.getByText('Checkout Register / Login');
    this.registerPopupButton = page.getByRole('button', {
      name: 'Continue On Cart',
    });
  }
  returnProceedToCheckoutButton(): Locator {
    return this.proceedToCheckoutButton;
  }

  returnregisterPopup(): Locator {
    return this.registerPopup;
  }

  returnregisterPopupButton(): Locator {
    return this.registerPopupButton;
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
