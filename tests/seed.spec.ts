import { test, expect } from '@playwright/test';
import { createToken } from './service-layer/api-service';

const logger = {
  info: (...args: unknown[]) => console.warn('[api.spec]', ...args),
};

test.describe('Test group', () => {
  test('seed auth token generation', async ({ request }) => {
    const username = 'admin';
    const password = 'password123';

    const response = await createToken({ request, username, password });
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(response.status()).toBe(200);
    expect(responseBody).toHaveProperty('token');
  });
});
