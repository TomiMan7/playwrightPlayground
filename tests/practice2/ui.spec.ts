import { test, expect } from '../../src/fixtures/fixtures';
import { readFile } from 'node:fs/promises';
import { /*addItemToCartViaAPI,*/ verifyLogin } from '../../src/ui/ui-service';
import { StatusCodes } from 'http-status-codes';
import { SignUpDataFactory } from '../../src/test-data/ui-sign-up-data-factory';

test.describe('auth tests', () => {
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

    expect(verificationBody.responseCode).toBe(StatusCodes.OK);
    expect(verificationBody.message).toMatch('User exists!');
  });

  /*
    Blocked by cloudeflare

  test('Add items to cart via API validate them on UI', async ({ request, page, productsPage, }) => {

    const itemId1 = SignUpDataFactory.createProductId(2, 3);
    const itemId2 = SignUpDataFactory.createProductId(4, 6);
    
    await productsPage.gotoProductsPage();

    await addItemToCartViaAPI({ request, itemId: itemId1 });
    await addItemToCartViaAPI({ request, itemId: itemId2 });
    await productsPage.goToCart();

    await expect(productsPage.checkRemoveElementAttribute(itemId1)).resolves.toBe(true);
    await expect(productsPage.checkRemoveElementAttribute(itemId2)).resolves.toBe(true);
    await expect(productsPage.proceedToCheckout()).toBeVisible();
  });
  */

  test('Add items to cart, via ui, then validate them on the checkout page', async ({ page, productsPage, productInfoPage, checkoutPage, cartPage }) => {
    const itemId1 = SignUpDataFactory.createProductId(1, 3);
    const itemId2 = SignUpDataFactory.createProductId(4, 6);

    await productsPage.goToSpecificProductInfoPageAndCloseAdIfVisible(itemId1);
    const productName1 = await productInfoPage.addProductToCartAndReturnItsName();

    await productsPage.goToSpecificProductInfoPageAndCloseAdIfVisible(itemId2);
    const productName2 = await productInfoPage.addProductToCartAndReturnItsName();

    await productsPage.goToCartPage();
    await expect(cartPage.returnProceedToCheckoutButton()).toBeVisible();
    await cartPage.returnProceedToCheckoutButton().click();

    expect(await checkoutPage.validateCartItemVisibility(productName1 as string)).toBe(true);
    expect(await checkoutPage.validateCartItemVisibility(productName2 as string)).toBe(true);
    expect(await checkoutPage.returnCartItemQuantity(itemId1, page)).toBe('1');
    expect(await checkoutPage.returnCartItemQuantity(itemId2, page)).toBe('1');
  });
});

test.describe('unauth tests', () => {
  test('Add items to cart, via ui, then validate them on the checkout page', async ({ page, productsPage, productInfoPage, loginPage, cartPage }) => {
    const itemId1 = SignUpDataFactory.createProductId(2, 3);
    const itemId2 = SignUpDataFactory.createProductId(4, 6);
    const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;

    await loginPage.goToLoginWithoutAuth(isCI);

    //adding item to cart based on its ID.
    await productsPage.goToSpecificProductInfoPageAndCloseAdIfVisible(itemId1);
    //returning the name of the product
    const productName1 = await productInfoPage.addProductToCartAndReturnItsName();

    await productsPage.goToSpecificProductInfoPageAndCloseAdIfVisible(itemId2);
    const productName2 = await productInfoPage.addProductToCartAndReturnItsName();

    await productsPage.goToCartPage();
    expect(await cartPage.validateCartItemVisibility(productName1)).toBe(true);
    expect(await cartPage.validateCartItemVisibility(productName2)).toBe(true);
    expect(await cartPage.returnCartItemQuantity(itemId1, page)).toBe('1');
    expect(await cartPage.returnCartItemQuantity(itemId2, page)).toBe('1');

    await expect(cartPage.returnProceedToCheckoutButton()).toBeVisible();
    await cartPage.returnProceedToCheckoutButton().click();

    expect(cartPage.returnregisterPopup()).toBeVisible();
    expect(cartPage.returnregisterPopupButton()).toBeVisible();

    await cartPage.returnregisterPopupButton().click();
    expect(cartPage.returnregisterPopup()).not.toBeVisible();
  });
});
