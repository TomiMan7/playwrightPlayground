import { APIRequestContext, APIResponse } from '@playwright/test';
import { SignUpData } from '../test-data/ui-sign-up-data-factory';

const url = 'https://automationexercise.com';

export interface ShoppingPayload extends Partial<SignUpData> {
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

export interface ShoppingApiClient {
  verifyLogin(email: string, password: string): Promise<APIResponse>;
  addItemToCart(itemId: number): Promise<APIResponse>;
}

class PlaywrightShoppingApiClient implements ShoppingApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string = url
  ) {}

  async verifyLogin(email: string, password: string) {
    return this.request.post(this.baseUrl + '/api/verifyLogin', {
      form: {
        email,
        password,
      },
    });
  }

  async addItemToCart(itemId: number) {
    return this.request.post(this.baseUrl + `/add_to_cart/${itemId}`, {
      form: {
        itemId,
      },
    });
  }
}

export const createShoppingApiClient = (request: APIRequestContext): ShoppingApiClient => new PlaywrightShoppingApiClient(request);

export const verifyLogin = async ({ request, email, password }: { request: APIRequestContext; email: string; password: string }) => {
  const client = createShoppingApiClient(request);
  return client.verifyLogin(email, password);
};

export const addItemToCartViaAPI = async ({ request, itemId }: { request: APIRequestContext; itemId: number }) => {
  const client = createShoppingApiClient(request);
  return client.addItemToCart(itemId);
};

module.exports = {
  createShoppingApiClient,
  verifyLogin,
  addItemToCartViaAPI,
};
