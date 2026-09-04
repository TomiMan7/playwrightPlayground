import { APIRequestContext } from '@playwright/test';

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

export class BookingApiClient {
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
      data: this.buildBookingPayload(payload),
    });
  }

  /**
   * Updates an existing booking with the provided details.
   * By default the authenticated token baked into the request context is used.
   * @param bookingId booking identifier to update
   * @param payload updated booking details
   * @param tokenOverride optional token to override the default authenticated cookie
   * @returns updated booking response
   */
  async updateBooking(
    bookingId: number,
    payload: BookingPayload,
    tokenOverride?: string
  ) {
    return this.request.put(this.baseUrl + `/booking/${bookingId}`, {
      headers: this.buildAuthHeader(tokenOverride),
      data: this.buildBookingPayload(payload),
    });
  }

  /**
   * Deletes the booking with the given booking ID.
   * By default the authenticated token baked into the request context is used.
   * @param bookingId booking identifier to delete
   * @param tokenOverride optional token to override the default authenticated cookie
   * @returns deletion response for the booking
   */
  async deleteBooking(bookingId: number, tokenOverride?: string) {
    return this.request.delete(this.baseUrl + `/booking/${bookingId}`, {
      headers: this.buildAuthHeader(tokenOverride),
    });
  }

  /**
   * Builds an auth header only when a token override is provided.
   * When omitted, the token baked into the request context (extraHTTPHeaders) is used.
   * @param tokenOverride optional token to override the default authenticated cookie
   * @returns a Cookie header object when overriding, otherwise an empty object
   */
  private buildAuthHeader(tokenOverride?: string) {
    return tokenOverride ? { Cookie: `token=${tokenOverride}` } : {};
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
