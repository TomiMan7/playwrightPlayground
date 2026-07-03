import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { /*addItemToCartViaAPI,*/ verifyLogin } from '../ui-layer/ui-service';
//import { ProductsCartPOM } from '../pom/product-page';
//import { faker } from '@faker-js/faker';

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
    console.log('Verification response body:', verificationBody);

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
});
