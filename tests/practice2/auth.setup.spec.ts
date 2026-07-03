import { test as setup, expect } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { SignUpDataFactory } from '../test-data/ui-sign-up-data-factory';

setup('Setup for the auth tests', async ({ page, context }) => {
  const signUpData = SignUpDataFactory.createSignUpData();
  const customerAuthFile = '.customerAuth.json';
  const authState = {
    email: signUpData.email,
    password: signUpData.password,
  };

  //UI sign up and login
  await page.goto('https://automationexercise.com/login');
  await expect(page.getByRole('button', { name: 'Consent' })).toBeVisible();

  await page.getByRole('button', { name: 'Consent' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(signUpData.name);
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(signUpData.email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByRole('textbox', { name: 'Name *', exact: true }).fill(signUpData.name);
  await page.getByRole('textbox', { name: 'Password *' }).fill(signUpData.password);
  await page.getByRole('textbox', { name: 'First name *' }).fill(signUpData.firstName);
  await page.getByRole('textbox', { name: 'Last name *' }).fill(signUpData.lastName);
  await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(signUpData.address);
  await page.getByRole('textbox', { name: 'State *' }).fill(signUpData.state);
  await page.getByRole('textbox', { name: 'City *' }).fill(signUpData.city);
  await page.locator('#zipcode').fill(signUpData.zipcode);
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(signUpData.mobileNumber);
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page.getByText('Account Created!')).toBeVisible({
    timeout: 10000,
  });
  await page.getByRole('link', { name: 'Continue' }).click();
  const adCloseButton = page.locator('iframe').locator('button').filter({ hasText: /close/i }).first();
  if (await adCloseButton.isVisible().catch(() => false)) {
    await adCloseButton.click();
  }

  //store cookies and credentials
  await context.storageState({ path: customerAuthFile });
  const existingAuth = await readFile(customerAuthFile, 'utf8')
    .then(JSON.parse)
    .catch(() => ({}));
  await writeFile(
    customerAuthFile,
    JSON.stringify(
      {
        ...authState,
        ...existingAuth,
      },
      null,
      2
    ),
    'utf8'
  );
});
