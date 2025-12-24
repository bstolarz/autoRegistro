import { Page, Locator } from '@playwright/test';

export class CarPage {
  constructor(private readonly page: Page) {}

  /* --------------------------------
     Generic helpers
  -------------------------------- */

  private async getValueByDtLabel(
    labelMatchers: RegExp[]
  ): Promise<string | undefined> {
    const dts = this.page.locator('dl dt');

    const count = await dts.count();
    for (let i = 0; i < count; i++) {
      const dt = dts.nth(i);
      const labelText = (await dt.innerText()).trim();

      if (labelMatchers.some(r => r.test(labelText))) {
        const dd = dt.locator('xpath=following-sibling::dd[1]');
        return (await dd.innerText()).trim();
      }
    }

    return undefined;
  }

  private parseNumber(value?: string): number | undefined {
    if (!value) return undefined;
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? undefined : parsed;
  }

  /* --------------------------------
     Domain getters
  -------------------------------- */

  async getMarca(): Promise<string | undefined> {
    return this.getValueByDtLabel([/marca/i]);
  }

  async getModelo(): Promise<string | undefined> {
    return this.getValueByDtLabel([/modelo/i]);
  }

  async getNumeroChasis(): Promise<string | undefined> {
    return this.getValueByDtLabel([
      /n[uú]mero\s+de\s+chasis/i,
      /chasis/i,
    ]);
  }

  async getAnio(): Promise<number | undefined> {
    const raw = await this.getValueByDtLabel([
      /a[nñ]o/i,
    ]);
    return raw ? parseInt(raw.replace(/\D/g, ''), 10) : undefined;
  }

  async getPrecio(): Promise<number | undefined> {
    const raw = await this.getValueByDtLabel([
      /precio/i,
      /presio/i, // typo in HTML
    ]);
    return this.parseNumber(raw);
  }

  async getColor(): Promise<string | undefined> {
    return this.getValueByDtLabel([/color/i]);
  }

  async getEstado(): Promise<'Nuevo' | 'Usado' | undefined> {
    const raw = await this.getValueByDtLabel([/estado/i]);
    if (!raw) return undefined;

    const normalized = raw.toLowerCase();
    if (normalized.includes('nuevo')) return 'Nuevo';
    if (normalized.includes('usado')) return 'Usado';

    return undefined;
  }
}
