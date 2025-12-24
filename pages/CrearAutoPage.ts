import { Page } from '@playwright/test';
import { BaseAutoFormPage } from './BaseAutoFormPage';

/**
 * Page Object Model for the Auto Registration Form
 * URL: https://frontend.wildar.dev/Autos/Crear
 */
export class CrearAutoPage extends BaseAutoFormPage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the Auto creation form
   */
  async goto(): Promise<void> {
    await this.page.goto('/Autos/Crear');
    await this.page.waitForLoadState('networkidle');
    // Wait for form to be visible
    await this.page.waitForSelector('input, select', { timeout: 10000 });
  }
}

