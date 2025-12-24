import { Page, Locator } from '@playwright/test';

export class ListadoPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/Autos');
  }

  /**
   * Get the auto ID by finding the row that contains the specified chasis number
   * @param chasisNumber - The chasis number to search for
   * @returns The auto ID extracted from the row (link, button, or data attribute)
   */
  async getAutoId(chasisNumber: string): Promise<string | null> {
    // Find the row containing the chasis number
    // Try multiple strategies to find the row and extract the ID
    
    // Strategy 1: Find text containing chasis, then find the closest link/button with ID in href
    const chasisLocator = this.page.getByText(chasisNumber).first();
    
    // Try to find a link in the same row (table row, div, etc.)
    const rowLocator = chasisLocator.locator('..').first(); // Parent element
    
    // Look for links with ID patterns in the same row
    const linkPatterns = [
      rowLocator.locator('a[href*="/Autos/Editar/"]'),
      rowLocator.locator('a[href*="/Autos/Modificar/"]'),
      rowLocator.locator('a[href*="/Autos/Detalle/"]'),
      rowLocator.locator('button[onclick*="Editar"]'),
      rowLocator.locator('button[onclick*="Modificar"]'),
    ];

    for (const linkLocator of linkPatterns) {
      const count = await linkLocator.count();
      if (count > 0) {
        const href = await linkLocator.getAttribute('href');
        if (href) {
          // Extract ID from URL pattern like /Autos/Editar/123
          const match = href.match(/\/(?:Editar|Modificar|Detalle)\/(\d+)/);
          if (match && match[1]) {
            return match[1];
          }
        }
      }
    }

    // Strategy 2: Find by data attribute in the row
    const dataIdLocator = rowLocator.locator('[data-id]');
    const dataIdCount = await dataIdLocator.count();
    if (dataIdCount > 0) {
      const dataId = await dataIdLocator.getAttribute('data-id');
      if (dataId) {
        return dataId;
      }
    }

    // Strategy 3: Search the entire page for links near the chasis text
    const allLinks = this.page.locator(`a[href*="/Autos/Editar/"], a[href*="/Autos/Modificar/"], a[href*="/Autos/Detalle/"]`);
    const linkCount = await allLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = allLinks.nth(i);
      const href = await link.getAttribute('href');
      if (href) {
        // Check if this link is in the same row/container as the chasis
        const linkBox = await link.boundingBox();
        const chasisBox = await chasisLocator.boundingBox();
        
        if (linkBox && chasisBox) {
          // Check if they're in the same row (similar Y position)
          const yDiff = Math.abs(linkBox.y - chasisBox.y);
          if (yDiff < 50) { // Within 50px vertically
            const match = href.match(/\/(?:Editar|Modificar|Detalle)\/(\d+)/);
            if (match && match[1]) {
              return match[1];
            }
          }
        }
      }
    }

    return null;
  }
}