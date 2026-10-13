import { test as base } from '@playwright/test';
import { BookingApiClient } from '../api/api-service';
import { requireEnv } from '../utils/env';

type Fixtures = {
  api: BookingApiClient;
};

export const test = base.extend<Fixtures>({
  api: async ({ playwright }, use) => {
    const authContext = await playwright.request.newContext();
    const tokenResponse = await new BookingApiClient(authContext).createToken(
      requireEnv('API_USERNAME'),
      requireEnv('API_PASSWORD')
    );
    const { token } = await tokenResponse.json();
    await authContext.dispose();

    const apiContext = await playwright.request.newContext({
      baseURL: requireEnv('API_URL'),
      extraHTTPHeaders: {
        Cookie: `token=${token}`,
      },
    });

    await use(new BookingApiClient(apiContext));
    await apiContext.dispose();
  },
});

export const expect = test.expect;
