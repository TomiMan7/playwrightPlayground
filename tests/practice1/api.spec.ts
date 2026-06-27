import { test, expect } from '@playwright/test';
import {
  ping,
  getAllBooking,
  getBookingByName,
  createBooking,
} from '../service-layer/api-service';

import testData from '../test-data/service-test-data.json';

const data = JSON.parse(JSON.stringify(testData));

test('GET /stuff', async ({ request }) => {
  const response = await ping({ request });

  expect(response.status()).toBe(201);
});

test('GET /booking', async ({ request }) => {
  const response = await getAllBooking({ request });
  const responseBody = await response.json();

  expect(Object.keys(responseBody[0])[0]).toBe('bookingid');
  expect(typeof Object.keys(responseBody[0])[0]).toBe('string');
  expect(response.status()).toBe(200);
});

test('GET /booking by name', async ({ request }) => {
  const response = await getBookingByName({ request }, 'sally', 'brown');
  const responseBody = await response.json();

  console.log('Response Body:', responseBody); // Log the response body for debugging

  //xpect(Object.keys(responseBody[0])[0]).toBe('bookingid');
  //expect(typeof Object.keys(responseBody[0])[0]).toBe('string');
  expect(response.status()).toBe(200);
});

test('POST /booking', async ({ request }) => {
  const response = await createBooking({ request, ...data.createBooking });
  const responseBody = await response.json();

  console.log('Response Body:', responseBody); // Log the response body for debugging

  expect(Object.keys(responseBody)).toContain('bookingid');
  expect(typeof responseBody.bookingid).toBe('number');
  expect(response.status()).toBe(200);
});
