import { test, expect } from '../../src/fixtures/api';
import { StatusCodes } from 'http-status-codes';
import { BookingDataFactory } from '../../src/test-data/booking-data-factory';
import { Logger } from '../../src/utils/logger';

const logger = new Logger('api.spec');

test.describe('GET API Tests', () => {
  test('GET /ping', async ({ api }) => {
    const response = await test.step('Ping the API', async () => {
      return await api.ping();
    });

    await test.step('Validate the ping response status', async () => {
      expect(response.status()).toBe(StatusCodes.CREATED);
    });
  });

  test('GET /getAllBooking', async ({ api }) => {
    const response = await test.step('Get all bookings', async () => {
      return await api.getAllBookings();
    });
    const responseBody = await response.json();

    await test.step('Validate the get all bookings response', async () => {
      expect(Object.keys(responseBody[0])[0]).toBe('bookingid');
      expect(typeof Object.keys(responseBody[0])[0]).toBe('string');
      expect(response.status()).toBe(StatusCodes.OK);
    });
  });

  test('GET /get booking by name', async ({ api }) => {
    const response = await test.step('Get booking by name', async () => {
      return await api.getBookingByName('sally', 'brown');
    });
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    await test.step('Validate the get booking by name response status', async () => {
      expect(response.status()).toBe(StatusCodes.OK);
    });
  });
});

test.describe('POST API Tests', () => {
  test('POST /booking', async ({ api }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await test.step('Create a booking', async () => {
      return await api.createBooking(bookingData);
    });
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    await test.step('Validate the created booking response', async () => {
      expect(Object.keys(responseBody)).toContain('bookingid');
      expect(typeof responseBody.bookingid).toBe('number');
      expect(response.status()).toBe(StatusCodes.OK);
    });

    await test.step('Delete the created booking', async () => {
      const deleteResponse = await api.deleteBooking(responseBody.bookingid);
      expect(deleteResponse.status()).toBe(StatusCodes.CREATED); //cleaning up
    });
  });
});

test.describe('PUT API Tests', () => {
  test('PUT /booking', async ({ api }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await test.step('Create a booking', async () => {
      return await api.createBooking(bookingData);
    });
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    await test.step('Validate the created booking response', async () => {
      expect(responseBody.booking.firstname).toBe(bookingData.firstname);
      expect(responseBody.booking.lastname).toBe(bookingData.lastname);
      expect(responseBody.booking.additionalneeds).toBe(
        bookingData.additionalNeeds
      );
    });

    const updatedBookingData = BookingDataFactory.createBookingData();

    const updateResponse = await test.step('Update the booking', async () => {
      return await api.updateBooking(
        responseBody.bookingid,
        updatedBookingData
      );
    });
    const updateResponseBody = await updateResponse.json();

    logger.info('Update Response Body:', updateResponseBody);

    await test.step('Validate the updated booking response', async () => {
      expect(updateResponseBody.firstname).toBe(updatedBookingData.firstname);
      expect(updateResponseBody.lastname).toBe(updatedBookingData.lastname);
      expect(updateResponseBody.additionalneeds).toBe(
        updatedBookingData.additionalNeeds
      );
      expect(updateResponse.status()).toBe(StatusCodes.OK);
    });

    await test.step('Delete the created booking', async () => {
      const deleteResponse = await api.deleteBooking(responseBody.bookingid);
      expect(deleteResponse.status()).toBe(StatusCodes.CREATED); //cleaning up
    });
  });
});

test.describe('DELETE API Tests', () => {
  test('DELETE /booking', async ({ api }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await test.step('Create a booking', async () => {
      return await api.createBooking(bookingData);
    });
    const responseBody = await response.json();

    logger.info('Response Body:', responseBody);

    await test.step('Validate the created booking response', async () => {
      expect(responseBody.booking.firstname).toBe(bookingData.firstname);
      expect(responseBody.booking.lastname).toBe(bookingData.lastname);
      expect(responseBody.booking.additionalneeds).toBe(
        bookingData.additionalNeeds
      );
    });

    const deleteResponse = await test.step('Delete the booking', async () => {
      return await api.deleteBooking(responseBody.bookingid);
    });

    logger.info('Delete Response Status:', deleteResponse.status());

    await test.step('Validate the delete response status', async () => {
      expect(deleteResponse.status()).toBe(StatusCodes.CREATED);
    });

    const getResponse =
      await test.step('Get the booking by id after deletion', async () => {
        return await api.getBookingById(responseBody.bookingid);
      });

    logger.info('Get Response Status after deletion:', getResponse.status());

    await test.step('Validate the booking is not found after deletion', async () => {
      expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });
  });
});

test.describe('NEGATIVE API Tests', () => {
  test('update booking with invalid name', async ({ api }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await test.step('Create a booking', async () => {
      return await api.createBooking(bookingData);
    });
    const responseBody = await response.json();

    const updateResponse =
      await test.step('Update the booking with an invalid name', async () => {
        return await api.updateBooking(responseBody.bookingid, {
          firstname: 777 as unknown as string,
        });
      });

    logger.info(updateResponse);

    await test.step('Validate the update response status', async () => {
      expect(updateResponse.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    await test.step('Delete the created booking', async () => {
      const deleteResponse = await api.deleteBooking(responseBody.bookingid);
      expect(deleteResponse.status()).toBe(StatusCodes.CREATED); //cleaning up
    });
  });

  test('update booking with invalid token', async ({ api }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await test.step('Create a booking', async () => {
      return await api.createBooking(bookingData);
    });
    const responseBody = await response.json();

    const updateResponse =
      await test.step('Update the booking with an invalid token', async () => {
        return await api.updateBooking(
          responseBody.bookingid,
          {},
          'invalidToken'
        );
      });

    logger.info(updateResponse);

    await test.step('Validate the update response status', async () => {
      expect(updateResponse.status()).toBe(StatusCodes.FORBIDDEN);
    });

    await test.step('Delete the created booking', async () => {
      const deleteResponse = await api.deleteBooking(responseBody.bookingid);
      expect(deleteResponse.status()).toBe(StatusCodes.CREATED); //cleaning up
    });
  });

  test('delete booking with invalid token', async ({ api }) => {
    const bookingData = BookingDataFactory.createBookingData();
    const response = await test.step('Create a booking', async () => {
      return await api.createBooking(bookingData);
    });
    const responseBody = await response.json();

    const deleteResponse =
      await test.step('Delete the booking with an invalid token', async () => {
        return await api.deleteBooking(responseBody.bookingid, 'invalidToken');
      });

    logger.info(deleteResponse);

    await test.step('Validate the delete response status', async () => {
      expect(deleteResponse.status()).toBe(StatusCodes.FORBIDDEN);
    });

    await test.step('Delete the created booking', async () => {
      const deleteResponse2 = await api.deleteBooking(responseBody.bookingid);
      expect(deleteResponse2.status()).toBe(StatusCodes.CREATED); //cleaning up
    });
  });

  test('delete booking with invalid id', async ({ api }) => {
    const deleteResponse =
      await test.step('Delete a booking with an invalid id', async () => {
        return await api.deleteBooking('asd' as unknown as number);
      });

    logger.info(deleteResponse);

    await test.step('Validate the delete response status', async () => {
      expect(deleteResponse.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    });
  });
});
