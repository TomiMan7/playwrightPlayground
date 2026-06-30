import { test, expect } from '../fixtures/auth';
import {
  ping,
  getAllBooking,
  getBookingByName,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingById,
} from '../service-layer/api-service';

import { BookingDataFactory } from '../test-data/booking-data-factory';

test.describe('GET API Tests', () => {
  test('GET /ping', async ({ request }) => {
    const response = await ping({ request });

    expect(response.status()).toBe(201);
  });

  test('GET /getAllBooking', async ({ request }) => {
    const response = await getAllBooking({ request });
    const responseBody = await response.json();

    expect(Object.keys(responseBody[0])[0]).toBe('bookingid');
    expect(typeof Object.keys(responseBody[0])[0]).toBe('string');
    expect(response.status()).toBe(200);
  });

  test('GET /get booking by name', async ({ request }) => {
    const response = await getBookingByName({ request }, 'sally', 'brown');
    const responseBody = await response.json();

    console.log('Response Body:', responseBody); // Log the response body for debugging

    //update these
    //xpect(Object.keys(responseBody[0])[0]).toBe('bookingid');
    //expect(typeof Object.keys(responseBody[0])[0]).toBe('string');
    expect(response.status()).toBe(200);
  });
});

test.describe('POST API Tests', () => {
  test('POST /booking', async ({ request }) => {
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'ASD',
      lastname: 'QWE',
      additionalneeds: 'idk something',
    });
    const response = await createBooking({ request, ...bookingData });
    const responseBody = await response.json();

    console.log('Response Body:', responseBody); // Log the response body for debugging

    //update these
    expect(Object.keys(responseBody)).toContain('bookingid');
    expect(typeof responseBody.bookingid).toBe('number');
    expect(response.status()).toBe(200);
  });
});

test.describe('PUT API Tests', () => {
  test('PUT /booking', async ({ request, token }) => {
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'idk firstname',
      lastname: 'idk lastname',
      additionalneeds: 'idk something',
    });
    const response = await createBooking({ request, ...bookingData });
    const responseBody = await response.json();

    console.log('Response Body:', responseBody); // Log the response body for debugging

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

    const updateResponse = await updateBooking({
      request,
      bookingId: responseBody.bookingid,
      token,
      ...updatedBookingData,
    });
    const updateResponseBody = await updateResponse.json();

    console.log('Update Response Body:', updateResponseBody); // Log the response body for debugging

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
    const bookingData = BookingDataFactory.createBookingData({
      firstname: 'delete firstname',
      lastname: 'delete lastname',
      additionalneeds: 'delete something',
    });
    const response = await createBooking({ request, ...bookingData });
    const responseBody = await response.json();

    console.log('Response Body:', responseBody); // Log the response body for debugging

    expect(responseBody.booking.firstname).toBe(bookingData.firstname);
    expect(responseBody.booking.lastname).toBe(bookingData.lastname);
    expect(responseBody.booking.additionalneeds).toBe(
      bookingData.additionalneeds
    );

    const deleteResponse = await deleteBooking({
      request,
      bookingId: responseBody.bookingid,
      token,
    });

    console.log('Delete Response Status:', deleteResponse.status()); // Log the response status for debugging

    expect(deleteResponse.status()).toBe(201);

    // Verify that the booking has been deleted
    const getResponse = await getBookingById(
      { request },
      responseBody.bookingid
    );
    console.log('Get Response Status after deletion:', getResponse.status()); // Log the response status for debugging
    expect(getResponse.status()).toBe(404); // Expecting 404 Not Found after deletion
  });
});
