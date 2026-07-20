import { test as base } from '@playwright/test';
import {
  createBookingApiClient,
  BookingApiClientInterface,
} from '../api/api-service';

type Fixtures = {
  api: BookingApiClientInterface;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(createBookingApiClient(request));
  },
});

export const expect = test.expect;
