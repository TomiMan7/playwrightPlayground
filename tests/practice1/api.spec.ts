import { test, expect } from '../../src/fixtures/auth';
import { StatusCodes } from 'http-status-codes';
import { BookingDataFactory } from '../../src/test-data/booking-data-factory';
import { Logger } from '../../src/utils/logger';

const logger = new Logger('api.spec');

test.describe('GET API Tests', () => {
  test('GET /ping', async ({ api }) => {
    const response = await api.ping();

    expect(response.status()).toBe(StatusCodes.CREATED);
  });

  test('GET /getAllBooking', async ({ api }) => {
    const response = await api.getAllBookings();
    const responseBody = await response.json();

    expect(Object.keys(responseBody[0])[0]).toBe('bookingid');
    expect(typeof Object.keys(responseBody[0])[0]).toBe('string');
    expect(response.status()).toBe(StatusCodes.OK);
  });

  test('GET /get booking by name', async ({ api }) => {
    const response = await api.getBookingByName('sally', 'brown');
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(response.status()).toBe(StatusCodes.OK);
  });
});

test.describe('POST API Tests', () => {
  test('POST /booking', async ({ api, token }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(Object.keys(responseBody)).toContain('bookingid');
    expect(typeof responseBody.bookingid).toBe('number');
    expect(response.status()).toBe(StatusCodes.OK);

    const deleteResponse = await api.deleteBooking(responseBody.bookingid, token);
    expect(deleteResponse.status()).toBe(StatusCodes.CREATED); //cleaning up
  });
});

test.describe('PUT API Tests', () => {
  test('PUT /booking', async ({ api, token }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(responseBody.booking.firstname).toBe(bookingData.firstname);
    expect(responseBody.booking.lastname).toBe(bookingData.lastname);
    expect(responseBody.booking.additionalneeds).toBe(bookingData.additionalNeeds);

    const updatedBookingData = BookingDataFactory.createBookingData();

    const updateResponse = await api.updateBooking(responseBody.bookingid, token, updatedBookingData);
    const updateResponseBody = await updateResponse.json();

    logger.info('Update Response Body:', updateResponseBody);

    expect(updateResponseBody.firstname).toBe(updatedBookingData.firstname);
    expect(updateResponseBody.lastname).toBe(updatedBookingData.lastname);
    expect(updateResponseBody.additionalneeds).toBe(updatedBookingData.additionalNeeds);
    expect(updateResponse.status()).toBe(StatusCodes.OK);

    const deleteResponse = await api.deleteBooking(responseBody.bookingid, token);
    expect(deleteResponse.status()).toBe(StatusCodes.CREATED); //cleaning up
  });
});

test.describe('DELETE API Tests', () => {
  test('DELETE /booking', async ({ api, token }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    expect(responseBody.booking.firstname).toBe(bookingData.firstname);
    expect(responseBody.booking.lastname).toBe(bookingData.lastname);
    expect(responseBody.booking.additionalneeds).toBe(bookingData.additionalNeeds);

    const deleteResponse = await api.deleteBooking(responseBody.bookingid, token);

    logger.info('Delete Response Status:', deleteResponse.status());

    expect(deleteResponse.status()).toBe(StatusCodes.CREATED);

    const getResponse = await api.getBookingById(responseBody.bookingid);
    logger.info('Get Response Status after deletion:', getResponse.status());
    expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
  });
});

test.describe('NEGATIVE API Tests', () => {
  test('update booking with invalid name', async ({ api, token }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    const updateResponse = await api.updateBooking(responseBody.bookingid, token, {
      firstname: 777 as unknown as string,
    });
    logger.info(updateResponse);
    expect(updateResponse.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);

    const deleteResponse = await api.deleteBooking(responseBody.bookingid, token);
    expect(deleteResponse.status()).toBe(StatusCodes.CREATED); //cleaning up
  });

  test('update booking with invalid token', async ({ api, token }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    const updateResponse = await api.updateBooking(responseBody.bookingid, 'invalidToken', {});
    logger.info(updateResponse);
    expect(updateResponse.status()).toBe(StatusCodes.FORBIDDEN);

    const deleteResponse = await api.deleteBooking(responseBody.bookingid, token);
    expect(deleteResponse.status()).toBe(StatusCodes.CREATED); //cleaning up
  });

  test('delete booking with invalid token', async ({ api, token }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await api.createBooking(bookingData);
    const responseBody = await response.json();

    const deleteResponse = await api.deleteBooking(responseBody.bookingid, 'invalidToken');
    logger.info(deleteResponse);
    expect(deleteResponse.status()).toBe(StatusCodes.FORBIDDEN);

    const deleteResponse2 = await api.deleteBooking(responseBody.bookingid, token);
    expect(deleteResponse2.status()).toBe(StatusCodes.CREATED); //cleaning up
  });

  test('delete booking with invalid id', async ({ api, token }) => {
    const deleteResponse = await api.deleteBooking('asd' as unknown as number, token);
    logger.info(deleteResponse);
    expect(deleteResponse.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
  });
});
