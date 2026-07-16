import { APIRequestContext, APIResponse } from '@playwright/test';
import { SignUpData } from '../test-data/ui-sign-up-data-factory';

const url = process.env.UI_URL;

export interface ShoppingPayload extends Partial<SignUpData> {
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

export interface ShoppingApiClient {
  verifyLogin(email: string, password: string): Promise<APIResponse>;
  addItemToCart(itemId: number): Promise<APIResponse>;
}

class PlaywrightShoppingApiClient implements ShoppingApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string = url as string
  ) {}

  /**
   * Returns the login state of a given user
   * @param email email of a user
   * @param password password for the user
   * @returns api response based on wheter the user is logged in or not
   */
  async verifyLogin(email: string, password: string) {
    return this.request.post(this.baseUrl + '/api/verifyLogin', {
      form: {
        email,
        password,
      },
    });
  }

  /**
   * Adds an item to the cart via an API call
   * @param itemId id of the item added to cart
   * @returns api response of the added item to cart
   */
  async addItemToCart(itemId: number) {
    return this.request.post(this.baseUrl + `/add_to_cart/${itemId}`, {
      form: {
        itemId,
      },
    });
  }
}

/**
 * Creates a ShoppingApiClient instance
 * @param request - API request context used to make HTTP calls
 * @returns a ShoppingApiClient for interacting with the shopping API
 */
export const createShoppingApiClient = (request: APIRequestContext): ShoppingApiClient => new PlaywrightShoppingApiClient(request);

/**
 * Returns the login state of a given user
 * @param options - request context, email, and password used to verify login
 * @returns the API response of the login verification
 */
export const verifyLogin = async ({ request, email, password }: { request: APIRequestContext; email: string; password: string }) => {
  const client = createShoppingApiClient(request);
  return client.verifyLogin(email, password);
};

/**
 * Adds an item to the cart via the API
 * @param options - request context and the id of the item to add
 * @returns the API response of the added item to cart
 */
export const addItemToCartViaAPI = async ({ request, itemId }: { request: APIRequestContext; itemId: number }) => {
  const client = createShoppingApiClient(request);
  return client.addItemToCart(itemId);
};
