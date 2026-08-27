import { test as base } from '@playwright/test';
import {
  createBookingApiClient,
  BookingApiClientInterface,
} from '../api/api-service';
import { createToken } from '../api/api-service';
import { requireEnv } from '../utils/env';

type Fixtures = {
  api: BookingApiClientInterface;
};

export const test = base.extend<Fixtures>({
  api: async ({ playwright }, use) => {
    const authContext = await playwright.request.newContext();
    const tokenResponse = await createToken({
      request: authContext,
      username: requireEnv('API_USERNAME'),
      password: requireEnv('API_PASSWORD'),
    });
    const { token } = await tokenResponse.json();
    await authContext.dispose();

    const apiContext = await playwright.request.newContext({
      baseURL: requireEnv('API_URL'),
      extraHTTPHeaders: {
        Cookie: `token=${token}`,
      },
    });

    await use(createBookingApiClient(apiContext));
    await apiContext.dispose();
  },
});

export const expect = test.expect;
