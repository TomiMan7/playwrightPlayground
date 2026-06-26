import { test, expect } from '@playwright/test';

test('GET /stuff', async ({ request }) => {
  const url = 'https://restful-booker.herokuapp.com';
  const response = await request.get(url + '/ping');

  expect(response.status()).toBe(201);
});
