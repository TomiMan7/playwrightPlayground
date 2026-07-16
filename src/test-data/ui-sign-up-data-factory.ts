import { faker } from '@faker-js/faker';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
}

export class SignUpDataFactory {
  static createSignUpData(overrides: Partial<SignUpData> = {}): SignUpData {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      address: faker.location.streetAddress(true),
      state: faker.location.state(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      mobileNumber: faker.string.numeric(10),
      ...overrides,
    };
  }

  static createProductId(min: number, max: number) {
    return faker.number.int({ min: min, max: max });
  }
}
