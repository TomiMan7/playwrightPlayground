import { test as base } from '@playwright/test';
import {
  createToken,
  createBookingApiClient,
  BookingApiClientInterface,
} from '../api/api-service';

type Fixtures = {
  token: string;
  api: BookingApiClientInterface;
};

export const test = base.extend<Fixtures>({
  token: async ({ request }, use) => {
    const response = await createToken({
      request,
      username: process.env.API_USERNAME as string,
      password: process.env.API_PASSWORD as string,
    });
    const body = await response.json();
    await use(body.token);
  },

  api: async ({ request }, use) => {
    const api = createBookingApiClient(request);
    await use(api);
  },
});

export const expect = test.expect;
