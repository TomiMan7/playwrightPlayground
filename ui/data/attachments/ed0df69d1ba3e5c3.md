# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: practice2/auth.setup.spec.ts >> Setup for the auth tests
- Location: tests/practice2/auth.setup.spec.ts:5:6

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Consent' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Consent' })

```

```yaml
- banner:
  - link "Website for automation practice":
    - /url: /
    - img "Website for automation practice"
  - list:
    - listitem:
      - link " Home":
        - /url: /
    - listitem:
      - link " Products":
        - /url: /products
    - listitem:
      - link " Cart":
        - /url: /view_cart
    - listitem:
      - link " Signup / Login":
        - /url: /login
    - listitem:
      - link " Test Cases":
        - /url: /test_cases
    - listitem:
      - link " API Testing":
        - /url: /api_list
    - listitem:
      - link " Video Tutorials":
        - /url: https://www.youtube.com/c/AutomationExercise
    - listitem:
      - link " Contact us":
        - /url: /contact_us
- heading "Login to your account" [level=2]
- textbox "Email Address"
- textbox "Password"
- button "Login"
- heading "OR" [level=2]
- heading "New User Signup!" [level=2]
- textbox "Name"
- textbox "Email Address"
- button "Signup"
- contentinfo:
  - heading "Subscription" [level=2]
  - textbox "Your email address"
  - button ""
  - paragraph: Get the most recent updates from our site and be updated your self...
  - paragraph: Copyright © 2021 All rights reserved
- insertion:
  - heading "These are topics related to the article that might interest you" [level=2]: Discover more
  - link "Website analytics tools"
  - link "API testing courses"
  - link "API documentation"
```

# Test source

```ts
  1  | import { test as setup, expect } from '@playwright/test';
  2  | import { readFile, writeFile } from 'node:fs/promises';
  3  | import { SignUpDataFactory } from '../test-data/ui-sign-up-data-factory';
  4  | 
  5  | setup('Setup for the auth tests', async ({ page, context }) => {
  6  |   const signUpData = SignUpDataFactory.createSignUpData();
  7  |   const customerAuthFile = '.customerAuth.json';
  8  |   const authState = {
  9  |     email: signUpData.email,
  10 |     password: signUpData.password,
  11 |   };
  12 | 
  13 |   //UI sign up and login
  14 |   await page.goto('https://automationexercise.com/login');
> 15 |   await expect(page.getByRole('button', { name: 'Consent' })).toBeVisible();
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  16 | 
  17 |   await page.getByRole('button', { name: 'Consent' }).click();
  18 |   await page.getByRole('textbox', { name: 'Name' }).fill(signUpData.name);
  19 |   await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(signUpData.email);
  20 |   await page.getByRole('button', { name: 'Signup' }).click();
  21 |   await page.getByRole('textbox', { name: 'Name *', exact: true }).fill(signUpData.name);
  22 |   await page.getByRole('textbox', { name: 'Password *' }).fill(signUpData.password);
  23 |   await page.getByRole('textbox', { name: 'First name *' }).fill(signUpData.firstName);
  24 |   await page.getByRole('textbox', { name: 'Last name *' }).fill(signUpData.lastName);
  25 |   await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(signUpData.address);
  26 |   await page.getByRole('textbox', { name: 'State *' }).fill(signUpData.state);
  27 |   await page.getByRole('textbox', { name: 'City *' }).fill(signUpData.city);
  28 |   await page.locator('#zipcode').fill(signUpData.zipcode);
  29 |   await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(signUpData.mobileNumber);
  30 |   await page.getByRole('button', { name: 'Create Account' }).click();
  31 | 
  32 |   await expect(page.getByText('Account Created!')).toBeVisible({
  33 |     timeout: 10000,
  34 |   });
  35 |   await page.getByRole('link', { name: 'Continue' }).click();
  36 |   const adCloseButton = page.locator('iframe').locator('button').filter({ hasText: /close/i }).first();
  37 |   if (await adCloseButton.isVisible().catch(() => false)) {
  38 |     await adCloseButton.click();
  39 |   }
  40 | 
  41 |   //store cookies and credentials
  42 |   await context.storageState({ path: customerAuthFile });
  43 |   const existingAuth = await readFile(customerAuthFile, 'utf8')
  44 |     .then(JSON.parse)
  45 |     .catch(() => ({}));
  46 |   await writeFile(
  47 |     customerAuthFile,
  48 |     JSON.stringify(
  49 |       {
  50 |         ...authState,
  51 |         ...existingAuth,
  52 |       },
  53 |       null,
  54 |       2
  55 |     ),
  56 |     'utf8'
  57 |   );
  58 | });
  59 | 
```