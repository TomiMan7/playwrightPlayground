import { test as base } from '@playwright/test';
import {
  createToken,
  createBookingApiClient,
  BookingApiClientInterface,
} from '../api/api-service';
import { requireEnv } from '../utils/env';

type Fixtures = {
  token: string;
  api: BookingApiClientInterface;
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
});

export const expect = test.expect;
