import { Page } from '@playwright/test';
import { BaseAutoFormPage } from './BaseAutoFormPage';
import { AutoFormData } from '../data/AutoFormDataProvider';

/**
 * Page Object Model for the Auto Modification Form
 * URL: https://frontend.wildar.dev/Autos/Modificar/{id}
 * 
 * This page shares the same form structure as CrearAutoPage but has different behavior:
 * - Form is pre-filled with existing data
 * - Submit button may say "Guardar" or "Actualizar" instead of "Crear"
 * - Navigation URL is different
 */
export class ModificarAutoPage extends BaseAutoFormPage {
  constructor(page: Page) {
    super(page);
    
    // Override submit button locator if needed for modify page
    // The base class already handles multiple button text variations
  }

  /**
   * Navigate to the Auto modification form for a specific auto ID
   * @param autoId - The ID of the auto to modify
   */
  async goto(autoId?: number | string): Promise<void> {
    if (autoId) {
      await this.page.goto(`/Autos/Editar/${autoId}`);
    } else {
      // If no ID provided, navigate to modify page (adjust URL as needed)
      await this.page.goto('/Autos');
    }
    await this.page.waitForLoadState('networkidle');
    // Wait for form to be visible and pre-filled
    await this.page.waitForSelector('input, select', { timeout: 10000 });

    const linkEditar = this.page.locator('a:has-text("Editar")').first();
    await linkEditar.click();
  }

  /**
   * Verify that form fields are pre-filled with existing data
   * Useful for modify flows to ensure data loaded correctly
   */
  async verifyFormPreFilled(): Promise<boolean> {
    const values = await this.getFormValues();
    // Check if at least one field has a value (indicating form was pre-filled)
    return !!(values.numeroChasis && values.marca || values.modelo );
  }

  /**
   * Modify specific fields while keeping others unchanged
   * This is a modify-specific behavior that differs from create
   */
  async modifyFields(partialData: Partial<AutoFormData>): Promise<void> {
    // Only fill the fields that are provided, leaving others as-is
    if (partialData.marca) {
      await this.marcaInput.fill(partialData.marca);
    }
    
    if (partialData.modelo) {
      await this.modeloInput.fill(partialData.modelo);
    }
    
    if (partialData.numeroChasis) {
      await this.numeroChasisInput.fill(partialData.numeroChasis);
    }
    
    if (partialData.año) {
      await this.añoInput.fill(partialData.año.toString());
    }
    
    if (partialData.precio) {
      await this.precioInput.fill(partialData.precio.toString());
    }
    
    if (partialData.color) {
      await this.colorInput.fill(partialData.color);
    }
    
    if (partialData.estado) {
      await this.estadoSelect.selectOption(partialData.estado);
    }
  }
}

