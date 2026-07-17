import { test as base } from '@playwright/test';
import { createToken, createBookingApiClient, BookingApiClientInterface } from '../api/api-service';
import { requireEnv } from '../utils/env';
import { ProductInfoPOM } from '../../tests/pom/product-detail-page';
import { CheckoutPagePOM } from '../../tests/pom/checkout-page';
import { LoginSignUpPOM } from '../../tests/pom/login-sign-up';
import { CartPagePOM } from '../../tests/pom/cart-page';
import { ProductsCartPOM } from '../../tests/pom/product-page';

type Fixtures = {
  token: string;
  api: BookingApiClientInterface;
  productsPage: ProductsCartPOM;
  productInfoPage: ProductInfoPOM;
  checkoutPage: CheckoutPagePOM;
  cartPage: CartPagePOM;
  loginPage: LoginSignUpPOM;
};

export const test = base.extend<Fixtures>({
  token: async ({ request }, use) => {
    const response = await createToken({
      request,
      username: requireEnv('API_USERNAME'),
      password: requireEnv('API_PASSWORD'),
    });
    const body = await response.json();
    await use(body.token);
  },

  api: async ({ request }, use) => {
    await use(createBookingApiClient(request));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsCartPOM(page));
  },

  productInfoPage: async ({ page }, use) => {
    await use(new ProductInfoPOM(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPagePOM(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPagePOM(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginSignUpPOM(page));
  },
});

export const expect = test.expect;
