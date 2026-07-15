import { test as setup } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { SignUpDataFactory } from '../test-data/ui-sign-up-data-factory';
import { LoginSignUpPOM } from '../pom/login-sign-up';

setup('Setup for the auth tests', async ({ page, context }) => {
  const signUpData = SignUpDataFactory.createSignUpData();
  const customerAuthFile = '.customerAuth.json';
  const authState = {
    email: signUpData.email,
    password: signUpData.password,
  };
  const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;
  const pom = new LoginSignUpPOM(page);

  await pom.completeSignup(signUpData, isCI);

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
