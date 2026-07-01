export interface BookingData {
  firstname: string | number;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  checkin: string;
  checkout: string;
  additionalneeds: string;
}

export class BookingDataFactory {
  static createBookingData(overrides: Partial<BookingData> = {}): BookingData {
    return {
      firstname: 'asdasd',
      lastname: 'qweqwe',
      totalprice: 77,
      depositpaid: true,
      checkin: '2000-01-01',
      checkout: '2026-01-01',
      additionalneeds: 'Breakfast',
      ...overrides,
    };
  }
}
