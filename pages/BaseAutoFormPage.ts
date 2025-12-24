import { Page, Locator } from '@playwright/test';
import { AutoFormData } from '../data/AutoFormDataProvider';

/**
 * Base Page Object Model for Auto Form Pages
 * Contains common functionality shared between Create and Modify pages
 */
export abstract class BaseAutoFormPage {
  readonly page: Page;
  
  // Form fields (common to both create and modify)
  readonly marcaInput: Locator;
  readonly modeloInput: Locator;
  readonly numeroChasisInput: Locator;
  readonly añoInput: Locator;
  readonly precioInput: Locator;
  readonly colorInput: Locator;
  readonly estadoSelect: Locator;
  
  // Buttons
  readonly submitButton: Locator;
  readonly volverButton: Locator;
  
  // Navigation
  readonly listadoLink: Locator;
  readonly registrarLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize form field locators - using getByLabel for better reliability
    this.marcaInput = page.getByLabel('Marca', { exact: false });
    this.modeloInput = page.getByLabel('Modelo', { exact: false });
    // this.numeroChasisInput = page.getByLabel('Chasis', { exact: false });
    this.numeroChasisInput = page
        .locator('.form-group')
        .filter({ hasText: 'Número de Chasis' })
        .locator('input');
    this.añoInput = page.getByLabel('Año', { exact: false });
    this.precioInput = page.getByLabel('Precio', { exact: false });
    this.colorInput = page.getByLabel('Color', { exact: false });
    this.estadoSelect = page.getByLabel('Estado', { exact: false });
    
    // Initialize button locators
    this.submitButton = page.locator('button:has-text("Crear"), button:has-text("Guardar"), button:has-text("Registrar"), button[type="submit"], input[type="submit"]').first();
    this.volverButton = page.locator('a:has-text("Volver"), a:has-text("Volver a la lista"), button:has-text("Volver")').first();
    
    // Navigation links
    this.listadoLink = page.locator('a:has-text("Listado de Autos")').first();
    this.registrarLink = page.locator('a:has-text("Registrar Auto")').first();
  }

  /**
   * Navigate to the page - must be implemented by subclasses
   */
  abstract goto(): Promise<void>;

  /**
   * Fill the form with provided data
   */
  async fillForm(data: AutoFormData): Promise<void> {
    if (data.marca) {
      await this.marcaInput.fill(data.marca);
    }
    
    if (data.modelo) {
      await this.modeloInput.fill(data.modelo);
    }
    
    if (data.numeroChasis) {
      await this.numeroChasisInput.fill(data.numeroChasis);
    }
    
    if (data.año) {
      await this.añoInput.fill(data.año.toString());
    }
    
    if (data.precio) {
      await this.precioInput.fill(data.precio.toString());
    }
    
    if (data.color) {
      await this.colorInput.fill(data.color);
    }
    
    if (data.estado) {
      await this.estadoSelect.selectOption(data.estado);
    }
  }

  /**
   * Submit the form
   */
  async submitForm(): Promise<void> {
    await this.submitButton.click();
    // Wait for navigation or response
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill and submit the form in one action
   */
  async fillAndSubmitForm(data: AutoFormData): Promise<void> {
    await this.fillForm(data);
    await this.submitForm();
  }

  /**
   * Helper method to safely get input value only if element exists
   */
  private async safeGetInputValue(locator: Locator): Promise<string | undefined> {
    const count = await locator.count();
    if (count === 0) {
      return undefined;
    }
    try {
      return await locator.inputValue();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Helper method to safely get inner text only if element exists
   */
  private async safeGetInnerText(locator: Locator): Promise<string | undefined> {
    const count = await locator.count();
    if (count === 0) {
      return undefined;
    }
    try {
      return await locator.innerText();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Helper method to safely get select value only if element exists
   */
  private async safeGetSelectValue(locator: Locator): Promise<string | undefined> {
    const count = await locator.count();
    if (count === 0) {
      return undefined;
    }
    try {
      return await locator.inputValue();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Get form field values
   * Verifies each DOM element exists before attempting to read its value
   */
  async getFormValues(): Promise<Partial<AutoFormData>> {
    const marcaValue = await this.safeGetInputValue(this.marcaInput);
    const modeloValue = await this.safeGetInputValue(this.modeloInput);
    // Get numeroChasis value with existence check using placeholder
   
   //const chasisLocator = await this.page.locator('div').locator('#NumeroChasis').inputValue();
   //WORKS  const chasisValue = await this.page.locator('#NumeroChasis').nth(1).inputValue();
    //const chasisCount = await chasisLocator.count();
    //const chasisValue = await this.page.locator('#NumeroChasis').inputValue();
    // WORKconst chasisValue = await this.page.locator('.form-group').getByLabel('Número de Chasis').inputValue();
    //console.log('xxx____numeroChasis_COUNT', chasisCount);

    // Get numeroChasis value - find the form-group containing the label, then get the associated input
    //NOT WORK const chasisValue = await this.page.locator('.form-group').filter({ has: this.page.getByText('Número de Chasis', { exact: true }) }).getByLabel('Número de Chasis', { exact: true }).inputValue();
    const numeroChasis = await this.page
        .locator('.form-group')
        .filter({ hasText: 'Número de Chasis' })
        .locator('input');

    const numeroChasisValue = await numeroChasis.inputValue();
    const añoValue = await this.safeGetInputValue(this.añoInput);
    const precioValue = await this.safeGetInputValue(this.precioInput);
    const colorValue = await this.safeGetInputValue(this.colorInput);
    const estadoValue = await this.safeGetSelectValue(this.estadoSelect);

    return {
      marca: marcaValue,
      modelo: modeloValue,
      numeroChasis: numeroChasisValue,
      año: añoValue ? parseInt(añoValue) || undefined : undefined,
      precio: precioValue ? parseFloat(precioValue) || undefined : undefined,
      color: colorValue,
      estado: estadoValue as 'Nuevo' | 'Usado' | undefined,
    };
  }

  /**
   * Check if form is visible
   */
  async isFormVisible(): Promise<boolean> {
    return await this.marcaInput.isVisible();
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.marcaInput.clear();
    await this.modeloInput.clear();
    await this.numeroChasisInput.clear();
    await this.añoInput.clear();
    await this.precioInput.clear();
    await this.colorInput.clear();
  }

  /**
   * Navigate back to list
   */
  async goBackToList(): Promise<void> {
    await this.volverButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

