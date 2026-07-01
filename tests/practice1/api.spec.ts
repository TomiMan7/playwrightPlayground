import type { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/auth';
import {
  createBookingApiClient,
  type BookingApiClient,
} from '../service-layer/api-service';

import { BookingDataFactory } from '../test-data/booking-data-factory';

const logger = {
  info: (...args: unknown[]) => console.warn('[api.spec]', ...args),
};

const createApiClient = (request: APIRequestContext): BookingApiClient =>
  createBookingApiClient(request);

test.describe('GET API Tests', () => {
  test('GET /ping', async ({ request }) => {
    const api: BookingApiClient = createApiClient(request);
    const response = await api.ping();

    expect(response.status()).toBe(201);
  });

  test('GET /getAllBooking', async ({ request }) => {
    const api: BookingApiClient = createApiClient(request);
    const response = await api.getAllBookings();
    const responseBody = await response.json();

    expect(Object.keys(responseBody[0])[0]).toBe('bookingid');
    expect(typeof Object.keys(responseBody[0])[0]).toBe('string');
    expect(response.status()).toBe(200);
  });

  test('GET /get booking by name', async ({ request }) => {
    const api: BookingApiClient = createApiClient(request);
    const response = await api.getBookingByName('sally', 'brown');
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(response.status()).toBe(200);
  });
});

test.describe('POST API Tests', () => {
  test('POST /booking', async ({ request }) => {
    const api: BookingApiClient = createApiClient(request);
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'ASD',
      lastname: 'QWE',
      additionalneeds: 'idk something',
    });
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(Object.keys(responseBody)).toContain('bookingid');
    expect(typeof responseBody.bookingid).toBe('number');
    expect(response.status()).toBe(200);
  });
});

test.describe('PUT API Tests', () => {
  test('PUT /booking', async ({ request, token }) => {
    const api: BookingApiClient = createApiClient(request);
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'idk firstname',
      lastname: 'idk lastname',
      additionalneeds: 'idk something',
    });
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(responseBody.booking.firstname).toBe(bookingData.firstname);
    expect(responseBody.booking.lastname).toBe(bookingData.lastname);
    expect(responseBody.booking.additionalneeds).toBe(
      bookingData.additionalneeds
    );

    const updatedBookingData = BookingDataFactory.createBookingData({
      firstname: 'updated firstname',
      lastname: 'updated lastname',
      additionalneeds: 'updated something',
    });

    const updateResponse = await api.updateBooking(
      responseBody.bookingid,
      token,
      updatedBookingData
    );
    const updateResponseBody = await updateResponse.json();

    logger.info('Update Response Body:', updateResponseBody);

    expect(updateResponseBody.firstname).toBe(updatedBookingData.firstname);
    expect(updateResponseBody.lastname).toBe(updatedBookingData.lastname);
    expect(updateResponseBody.additionalneeds).toBe(
      updatedBookingData.additionalneeds
    );
    expect(updateResponse.status()).toBe(200);
  });
});

test.describe('DELETE API Tests', () => {
  test('DELETE /booking', async ({ request, token }) => {
    const api: BookingApiClient = createApiClient(request);
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'delete firstname',
      lastname: 'delete lastname',
      additionalneeds: 'delete something',
    });
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(responseBody.booking.firstname).toBe(bookingData.firstname);
    expect(responseBody.booking.lastname).toBe(bookingData.lastname);
    expect(responseBody.booking.additionalneeds).toBe(
      bookingData.additionalneeds
    );

    const deleteResponse = await api.deleteBooking(
      responseBody.bookingid,
      token
    );

    logger.info('Delete Response Status:', deleteResponse.status());

    expect(deleteResponse.status()).toBe(201);

    const getResponse = await api.getBookingById(responseBody.bookingid);
    logger.info('Get Response Status after deletion:', getResponse.status());
    expect(getResponse.status()).toBe(404); // Expecting 404 Not Found after deletion
  });
});

test.describe('NEGATIVE API Tests', () => {
  test('update booking with invalid name', async ({ request, token }) => {
    const api: BookingApiClient = createApiClient(request);
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'idk firstname',
      lastname: 'idk lastname',
      additionalneeds: 'idk something',
    });
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    const updateResponse = await api.updateBooking(
      responseBody.bookingid,
      token,
      {
        firstname: '777',
      }
    );
    logger.info(updateResponse);
    expect(updateResponse.status()).toBe(200);
  });

  test('update booking with invalid token', async ({ request }) => {
    const api: BookingApiClient = createApiClient(request);
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'idk firstname',
      lastname: 'idk lastname',
      additionalneeds: 'idk something',
    });
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    const updateResponse = await api.updateBooking(
      responseBody.bookingid,
      'invalidToken',
      { firstname: '777' as unknown as string }
    );
    logger.info(updateResponse);
    expect(updateResponse.status()).toBe(403);
  });

  test('delete booking with invalid token', async ({ request }) => {
    const api: BookingApiClient = createApiClient(request);
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'idk firstname',
      lastname: 'idk lastname',
      additionalneeds: 'idk something',
    });
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    const deleteResponse = await api.deleteBooking(
      responseBody.bookingid,
      'invalidToken'
    );
    logger.info(deleteResponse);
    expect(deleteResponse.status()).toBe(403);
  });

  test('delete booking with invalid id', async ({ request, token }) => {
    const api: BookingApiClient = createApiClient(request);
    const deleteResponse = await api.deleteBooking('asd', token);
    logger.info(deleteResponse);
    expect(deleteResponse.status()).toBe(405);
  });
});
