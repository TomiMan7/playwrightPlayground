import { Page, Locator } from '@playwright/test';

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

export class LoginSignUpPOM {
  readonly page: Page;

  // Signup form locators (kept private for encapsulation)
  private readonly signupNameInput: Locator;
  private readonly signupEmailInput: Locator;
  private readonly signupButton: Locator;
  private readonly accountNameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipcodeInput: Locator;
  private readonly mobileNumberInput: Locator;
  private readonly createAccountButton: Locator;
  private readonly accountCreatedText: Locator;
  private readonly continueLink: Locator;
  private readonly consentButton: Locator;
  private readonly adCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.signupNameInput = page.getByRole('textbox', { name: 'Name' });
    this.signupEmailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    this.signupButton = page.getByRole('button', { name: 'Signup' });
    this.accountNameInput = page.getByRole('textbox', {
      name: 'Name *',
      exact: true,
    });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.firstNameInput = page.getByRole('textbox', {
      name: 'First name *',
    });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name *' });
    this.addressInput = page.getByRole('textbox', {
      name: 'Address * (Street address, P.',
    });
    this.stateInput = page.getByRole('textbox', { name: 'State *' });
    this.cityInput = page.getByRole('textbox', { name: 'City *' });
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.getByRole('textbox', {
      name: 'Mobile Number *',
    });
    this.createAccountButton = page.getByRole('button', {
      name: 'Create Account',
    });
    this.accountCreatedText = page.getByText('Account Created!');
    this.continueLink = page.getByRole('link', { name: 'Continue' });
    this.consentButton = page.getByRole('button', { name: 'Consent' });
    this.adCloseButton = page.locator('iframe').locator('button').filter({ hasText: /close/i }).first();
  }

  async gotoLoginPage() {
    await this.page.goto('https://automationexercise.com/login');
  }

  async fillField(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  async closeAdIfVisible(): Promise<void> {
    if (await this.isVisible(this.adCloseButton)) {
      await this.clickElement(this.adCloseButton);
    }
  }

  async handleConsent(isCI: boolean): Promise<void> {
    if (!isCI) {
      await this.consentButton.waitFor({ state: 'visible' });
      await this.clickElement(this.consentButton);
    }
  }

  async initialSignup(name: string, email: string): Promise<void> {
    await this.fillField(this.signupNameInput, name);
    await this.fillField(this.signupEmailInput, email);
    await this.clickElement(this.signupButton);
  }

  async fillAccountDetails(data: SignUpData): Promise<void> {
    await this.fillField(this.accountNameInput, data.name);
    await this.fillField(this.passwordInput, data.password);
    await this.fillField(this.firstNameInput, data.firstName);
    await this.fillField(this.lastNameInput, data.lastName);
    await this.fillField(this.addressInput, data.address);
    await this.fillField(this.stateInput, data.state);
    await this.fillField(this.cityInput, data.city);
    await this.fillField(this.zipcodeInput, data.zipcode);
    await this.fillField(this.mobileNumberInput, data.mobileNumber);
    await this.clickElement(this.createAccountButton);
  }

  async verifyAndContinue(): Promise<void> {
    await this.accountCreatedText.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await this.clickElement(this.continueLink);
  }

  async completeSignup(data: SignUpData, isCI: boolean): Promise<void> {
    await this.gotoLoginPage();
    await this.handleConsent(isCI);
    await this.initialSignup(data.name, data.email);
    await this.fillAccountDetails(data);
    await this.verifyAndContinue();
    await this.closeAdIfVisible();
  }

  async goToLoginWithoutAuth(isCI: boolean): Promise<void> {
    await this.gotoLoginPage();
    await this.handleConsent(isCI);
    await this.closeAdIfVisible();
  }
}
