import { APIRequestContext, APIResponse } from '@playwright/test';

const url = process.env.API_URL;

export interface BookingPayload {
  firstname?: string;
  lastname?: string;
  totalPrice?: number;
  depositPaid?: boolean;
  checkIn?: string;
  checkOut?: string;
  additionalNeeds?: string;
}

export interface BookingApiClientInterface {
  createToken(username: string, password: string): Promise<APIResponse>;
  ping(): Promise<APIResponse>;
  getAllBookings(): Promise<APIResponse>;
  getBookingByName(firstName: string, lastName: string): Promise<APIResponse>;
  getBookingById(bookingId: number): Promise<APIResponse>;
  createBooking(payload: BookingPayload): Promise<APIResponse>;
  updateBooking(
    bookingId: number,
    token: string,
    payload: BookingPayload
  ): Promise<APIResponse>;
  deleteBooking(bookingId: number, token: string): Promise<APIResponse>;
}

class BookingApiClient implements BookingApiClientInterface {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string = url as string
  ) {}

  /**
   * Creates an auth token for the given user credentials
   * @param username username for the user
   * @param password password for the user
   * @returns auth token for that user
   */
  async createToken(username: string, password: string) {
    return this.request.post(this.baseUrl + '/auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username,
        password,
      },
    });
  }

  /**
   * Pings the server to check availability
   * @returns pings the server for availability
   */
  async ping() {
    return this.request.get(this.baseUrl + '/ping');
  }

  /**
   * Retrieves all available bookings
   * @returns all the available bookings
   */
  async getAllBookings() {
    return this.request.get(this.baseUrl + '/booking');
  }

  /**
   * Retrieves bookings matching the provided owner name
   * @param firstName first name of the booking owner
   * @param lastName last name of the booking owner
   * @returns bookings matching the provided name
   */
  async getBookingByName(firstName: string, lastName: string) {
    return this.request.get(
      this.baseUrl + `/booking?firstname=${firstName}&lastname=${lastName}`
    );
  }

  /**
   * Retrieves booking details for the given booking ID
   * @param bookingId booking identifier to retrieve
   * @returns booking details for the given booking ID
   */
  async getBookingById(bookingId: number) {
    return this.request.get(this.baseUrl + `/booking/${bookingId}`);
  }

  /**
   * Creates a new booking with the provided details
   * @param payload booking details to create
   * @returns created booking response
   */
  async createBooking(payload: BookingPayload) {
    return this.request.post(this.baseUrl + '/booking', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: this.buildBookingPayload(payload),
    });
  }

  /**
   * Updates an existing booking with the provided details
   * @param bookingId booking identifier to update
   * @param token authentication token for the update
   * @param payload updated booking details
   * @returns updated booking response
   */
  async updateBooking(
    bookingId: number,
    token: string,
    payload: BookingPayload
  ) {
    return this.request.put(this.baseUrl + `/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
      data: this.buildBookingPayload(payload),
    });
  }

  /**
   * Deletes the booking with the given booking ID
   * @param bookingId booking identifier to delete
   * @param token authentication token for the deletion
   * @returns deletion response for the booking
   */
  async deleteBooking(bookingId: number, token: string) {
    return this.request.delete(this.baseUrl + `/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
    });
  }

  /**
   * Normalizes the booking payload into the shape expected by the API
   * @param payload booking payload to transform for the API
   * @returns normalized booking payload for the API request
   */
  private buildBookingPayload(payload: BookingPayload) {
    return {
      firstname: payload.firstname,
      lastname: payload.lastname,
      totalprice: payload.totalPrice,
      depositpaid: payload.depositPaid,
      bookingdates: {
        checkin: payload.checkIn,
        checkout: payload.checkOut,
      },
      additionalneeds: payload.additionalNeeds,
    };
  }
}

/**
 * Creates a configured booking API client
 * @param request Playwright API request context
 * @returns configured booking API client
 */
export const createBookingApiClient = (
  request: APIRequestContext
): BookingApiClient => new BookingApiClient(request);

/**
 * Creates an auth token for the given user via the booking API client
 * @param request Playwright API request context
 * @param username username for the user
 * @param password password for the user
 * @returns authentication response for the user
 */
export const createToken = async ({
  request,
  username,
  password,
}: {
  request: APIRequestContext;
  username: string;
  password: string;
}) => {
  const client = createBookingApiClient(request);
  return client.createToken(username, password);
};
