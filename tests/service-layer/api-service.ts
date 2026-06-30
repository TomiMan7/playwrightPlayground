import { APIRequestContext } from '@playwright/test';

const url = 'https://restful-booker.herokuapp.com'; // move to to .env later?

/*
interface Input {
    call: string
    query: Array<string>,
    adult: string,
    language: string,
    page: string
}
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
  const response = await request.post(url + '/auth', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username,
      password,
    },
  });
  return response;
};

export const ping = async ({ request }: { request: APIRequestContext }) => {
  const response = await request.get(url + '/ping');
  return response;
};

export const getAllBooking = async ({
  request,
}: {
  request: APIRequestContext;
}) => {
  const response = await request.get(url + '/booking');
  return response;
};

export const getBookingByName = async (
  { request }: { request: APIRequestContext },
  firstName: string,
  lastName: string
) => {
  const response = await request.get(
    url + `/booking?firstname=${firstName}&lastname=${lastName}`
  );
  return response;
};

export const getBookingById = async (
  { request }: { request: APIRequestContext },
  bookingId: number
) => {
  const response = await request.get(url + `/booking/${bookingId}`);
  return response;
};

export const createBooking = async ({
  request,
  firstname = 'Jim',
  lastname = 'Brown',
  totalprice = 111,
  depositpaid = true,
  checkin = '2018-01-01',
  checkout = '2019-01-01',
  additionalneeds = 'Breakfast',
}: {
  request: APIRequestContext;
  firstname?: string;
  lastname?: string;
  totalprice?: number;
  depositpaid?: boolean;
  checkin?: string;
  checkout?: string;
  additionalneeds?: string;
}) => {
  const response = await request.post(url + '/booking', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      firstname,
      lastname,
      totalprice,
      depositpaid,
      bookingdates: {
        checkin,
        checkout,
      },
      additionalneeds,
    },
  });
  return response;
};

export const updateBooking = async ({
  request,
  bookingId,
  token,
  firstname = 'Jim',
  lastname = 'Brown',
  totalprice = 111,
  depositpaid = true,
  checkin = '2018-01-01',
  checkout = '2019-01-01',
  additionalneeds = 'Breakfast',
}: {
  request: APIRequestContext;
  bookingId: number;
  token: string;
  firstname?: string;
  lastname?: string;
  totalprice?: number;
  depositpaid?: boolean;
  checkin?: string;
  checkout?: string;
  additionalneeds?: string;
}) => {
  const response = await request.put(url + `/booking/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
    },
    data: {
      firstname,
      lastname,
      totalprice,
      depositpaid,
      bookingdates: {
        checkin,
        checkout,
      },
      additionalneeds,
    },
  });
  return response;
};

export const deleteBooking = async ({
  request,
  bookingId,
  token,
}: {
  request: APIRequestContext;
  bookingId: number;
  token: string;
}) => {
  const response = await request.delete(url + `/booking/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
    },
  });
  return response;
};

module.exports = {
  ping,
  getAllBooking,
  getBookingByName,
  createBooking,
  createToken,
  updateBooking,
  deleteBooking,
  getBookingById,
};
