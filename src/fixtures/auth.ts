import { test as base } from '@playwright/test';
import { createToken } from '../api/api-service';
import { requireEnv } from '../utils/env';

type Fixtures = {
  token: string;
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
});

export const expect = test.expect;
