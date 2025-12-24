import { test as base, Page } from '@playwright/test';
import { CarPage } from '../pages/CarPage.js';

type CarPageFixture = {
  carPage: CarPage;
};

export const test = base.extend<CarPageFixture>({
  carPage: async ({ page }: { page: Page }, use) => {
    await use(new CarPage(page));
  },
});

export { expect } from '@playwright/test';
