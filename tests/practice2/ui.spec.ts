import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { /*addItemToCartViaAPI,*/ verifyLogin } from '../ui-layer/ui-service';
import { ProductsCartPOM } from '../pom/product-page';
import { faker } from '@faker-js/faker';
import { ProductInfoPOM } from '../pom/product-detail-page';
import { CheckoutPagePOM } from '../pom/checkout-page';

test.describe('test', () => {
  test.use({ storageState: '.customerAuth.json' });

  test('Test the sign up functionality, with api validation at the end', async ({ request }) => {
    const authState = JSON.parse(await readFile('.customerAuth.json', 'utf8'));
    const email = authState.email;
    const password = authState.password;
    const verificationResponse = await verifyLogin({
      request,
      email,
      password,
    });
    const verificationBody = await verificationResponse.json();

    expect(verificationBody.responseCode).toBe(200);
    expect(verificationBody.message).toMatch('User exists!');
  });

  /*
    Blocked by cloudeflare

  test('Add items to cart via API validate them on UI', async ({ request, page }) => {

    const itemId1 = faker.number.int({ min: 1, max: 10 });
    const itemId2 = faker.number.int({ min: 11, max: 20 });

    const productsPage = new ProductsCartPOM(page);
    await productsPage.gotoProductsPage();

    await addItemToCartViaAPI({ request, itemId: itemId1 });
    await addItemToCartViaAPI({ request, itemId: itemId2 });
    await productsPage.goToCart();

    await expect(productsPage.checkRemoveElementAttribute(itemId1)).resolves.toBe(true);
    await expect(productsPage.checkRemoveElementAttribute(itemId2)).resolves.toBe(true);
    await expect(productsPage.proceedToCheckout()).toBeVisible();
  });
  */

  test('Add items to cart, via ui, then validate them on the checkout page', async ({ page }) => {
    const itemId1 = faker.number.int({ min: 2, max: 3 });
    const itemId2 = faker.number.int({ min: 4, max: 6 });

    const productsPage = new ProductsCartPOM(page);
    const productInfoPage = new ProductInfoPOM(page);
    const checkoutPage = new CheckoutPagePOM(page);

    await productsPage.gotoProductsPage();
    await productsPage.goToProductInfoPageAndCloseAdIfVisible(itemId1);
    const productName1 = await productInfoPage.addProductToCartAndReturnItsName();

    await productsPage.gotoProductsPage();
    await productsPage.closeAdIfVisible();
    await productsPage.goToProductInfoPageAndCloseAdIfVisible(itemId2);
    const productName2 = await productInfoPage.addProductToCartAndReturnItsName();

    await productsPage.goToCart();
    await expect(productsPage.proceedToCheckout()).toBeVisible();
    await productsPage.proceedToCheckout().click();

    expect(await checkoutPage.validateCartItem(productName1 as string)).toBe(true);
    expect(await checkoutPage.validateCartItem(productName2 as string)).toBe(true);
    expect(await checkoutPage.returnCartItemQuantity(itemId1, page)).toBe('1');
    expect(await checkoutPage.returnCartItemQuantity(itemId2, page)).toBe('1');
  });
});
