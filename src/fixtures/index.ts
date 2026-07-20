import { mergeTests } from '@playwright/test';
import { test as apiTest } from './api';
import { test as pomTest } from './auth';

export const test = mergeTests(apiTest, pomTest);
export const expect = test.expect;
