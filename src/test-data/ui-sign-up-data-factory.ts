import { faker } from '@faker-js/faker';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export class SignUpDataFactory {
  static createSignUpData(overrides: Partial<SignUpData> = {}): SignUpData {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address: faker.location.streetAddress(true),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.string.numeric(10),
      ...overrides,
    };
  }
}
