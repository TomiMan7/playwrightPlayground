import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { verifyLogin } from '../ui-layer/ui-service';

test.describe('UI Sign Up and Login Tests', () => {
  test.use({ storageState: '.customerAuth.json' });

  test('Test the sign up functionality, with api validation at the end', async ({ request }) => {
    const authState = JSON.parse(await readFile('.customerAuth.json', 'utf8'));
    const email = authState.email;
    const password = authState.password;

    //API verification of sign up and login
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
});
