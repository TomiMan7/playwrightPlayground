import { test as base } from '@playwright/test';
import { createToken } from '../service-layer/api-service';

type Fixtures = { token: string };

export const test = base.extend<Fixtures>({
  token: async ({ request }, use) => {
    const response = await createToken({
      request,
      username: 'admin',
      password: 'password123',
    });
    const body = await response.json();
    await use(body.token);
  },
});

export const expect = test.expect;
