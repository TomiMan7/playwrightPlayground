import { faker } from '@faker-js/faker';

export interface BookingData {
  firstname: string;
  lastname: string;
  totalPrice: number;
  depositPaid: boolean;
  checkIn: string;
  checkOut: string;
  additionalNeeds: string;
}

export class BookingDataFactory {
  static createBookingData(overrides: Partial<BookingData> = {}): BookingData {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalPrice: faker.number.int({ min: 100, max: 1000 }),
      depositPaid: faker.datatype.boolean(),
      checkIn: faker.date.past({ years: 1 }) as unknown as string,
      checkOut: faker.date.future({ years: 1 }) as unknown as string,
      additionalNeeds: faker.string.sample(),
      ...overrides,
    };
  }
}
