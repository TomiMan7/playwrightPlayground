import { APIRequestContext, APIResponse } from '@playwright/test';
import { faker } from '@faker-js/faker';

const url = 'https://restful-booker.herokuapp.com'; // move to .env later?

export interface BookingPayload {
  firstname?: string | number;
  lastname?: string;
  totalprice?: number;
  depositpaid?: boolean;
  checkin?: string;
  checkout?: string;
  additionalneeds?: string;
}

export interface BookingApiClient {
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
  deleteBooking(
    bookingId: number | string,
    token: string
  ): Promise<APIResponse>;
}

class PlaywrightBookingApiClient implements BookingApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string = url
  ) {}

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

  async ping() {
    return this.request.get(this.baseUrl + '/ping');
  }

  async getAllBookings() {
    return this.request.get(this.baseUrl + '/booking');
  }

  async getBookingByName(firstName: string, lastName: string) {
    return this.request.get(
      this.baseUrl + `/booking?firstname=${firstName}&lastname=${lastName}`
    );
  }

  async getBookingById(bookingId: number) {
    return this.request.get(this.baseUrl + `/booking/${bookingId}`);
  }

  async createBooking(payload: BookingPayload) {
    return this.request.post(this.baseUrl + '/booking', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: this.buildBookingPayload(payload),
    });
  }

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

  async deleteBooking(bookingId: number | string, token: string) {
    return this.request.delete(this.baseUrl + `/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
    });
  }

  private buildBookingPayload(payload: BookingPayload) {
    return {
      firstname: payload.firstname ?? faker.person.firstName(),
      lastname: payload.lastname ?? faker.person.lastName(),
      totalprice:
        payload.totalprice ?? faker.number.int({ min: 100, max: 1000 }),
      depositpaid: payload.depositpaid ?? true,
      bookingdates: {
        checkin: payload.checkin ?? faker.date.past({ years: 1 }),
        checkout: payload.checkout ?? faker.date.future({ years: 1 }),
      },
      additionalneeds: payload.additionalneeds ?? 'Breakfast',
    };
  }
}

export const createBookingApiClient = (
  request: APIRequestContext
): BookingApiClient => new PlaywrightBookingApiClient(request);

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

export const ping = async ({ request }: { request: APIRequestContext }) => {
  const client = createBookingApiClient(request);
  return client.ping();
};

export const getAllBooking = async ({
  request,
}: {
  request: APIRequestContext;
}) => {
  const client = createBookingApiClient(request);
  return client.getAllBookings();
};

export const getBookingByName = async (
  { request }: { request: APIRequestContext },
  firstName: string,
  lastName: string
) => {
  const client = createBookingApiClient(request);
  return client.getBookingByName(firstName, lastName);
};

export const getBookingById = async (
  { request }: { request: APIRequestContext },
  bookingId: number
) => {
  const client = createBookingApiClient(request);
  return client.getBookingById(bookingId);
};

export const createBooking = async ({
  request,
  ...payload
}: {
  request: APIRequestContext;
} & BookingPayload) => {
  const client = createBookingApiClient(request);
  return client.createBooking(payload);
};

export const updateBooking = async ({
  request,
  bookingId,
  token,
  ...payload
}: {
  request: APIRequestContext;
  bookingId: number;
  token: string;
} & BookingPayload) => {
  const client = createBookingApiClient(request);
  return client.updateBooking(bookingId, token, payload);
};

export const deleteBooking = async ({
  request,
  bookingId,
  token,
}: {
  request: APIRequestContext;
  bookingId: number | string;
  token: string;
}) => {
  const client = createBookingApiClient(request);
  return client.deleteBooking(bookingId, token);
};

module.exports = {
  createBookingApiClient,
  ping,
  getAllBooking,
  getBookingByName,
  createBooking,
  createToken,
  updateBooking,
  deleteBooking,
  getBookingById,
};
