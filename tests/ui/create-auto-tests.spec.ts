import { test, expect } from '@playwright/test';
import { CrearAutoPage } from '../../pages/CrearAutoPage';
import { AutoFormDataProvider } from '../../data/AutoFormDataProvider';
import { AutoApiClient } from '../../api/AutoApiClient';
import { ListadoPage } from '../../pages/ListadoPage';

/**
 * UI Tests for Auto Registration Form
 * Tests the form at https://frontend.wildar.dev/Autos/Crear
 */
test.describe('Auto Registration Form - UI Tests', () => {
  let autoFormPage: CrearAutoPage;

  test.beforeEach(async ({ page }) => {
    autoFormPage = new CrearAutoPage(page);
    await autoFormPage.goto();
  });

  test('should display the form correctly', async () => {
    // Verify form is visible
    await expect(autoFormPage.isFormVisible()).resolves.toBe(true);
    await expect(autoFormPage.marcaInput).toBeVisible();
    await expect(autoFormPage.modeloInput).toBeVisible();
    await expect(autoFormPage.numeroChasisInput).toBeVisible();
    await expect(autoFormPage.añoInput).toBeVisible();
    await expect(autoFormPage.precioInput).toBeVisible();
    await expect(autoFormPage.colorInput).toBeVisible();
    await expect(autoFormPage.estadoSelect).toBeVisible();
  });

  test('should fill and submit form with valid data', async ({ page }) => {
    const testData = AutoFormDataProvider.getValidData();
    
    // Fill the form
    await autoFormPage.fillForm(testData);
    
    // Verify form values are filled correctly
    const formValues = await autoFormPage.getFormValues();
    expect(formValues.marca).toBe(testData.marca);
    expect(formValues.modelo).toBe(testData.modelo);
    expect(formValues.numeroChasis).toBe(testData.numeroChasis);
    
    // Submit the form
    await autoFormPage.submitForm();
    
    // Wait for navigation or success message
    // Adjust these assertions based on actual behavior after submission
    await page.waitForTimeout(2000);
    
    // Verify we're no longer on the form page or check for success message
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/Autos/Crear');
  });

  test('should fill form with multiple valid data sets', async ({ page }) => {
    const dataSets = AutoFormDataProvider.getValidDataSets();
    
    for (const data of dataSets) {
      await autoFormPage.goto();
      await autoFormPage.fillForm(data);
      
      // Verify data is filled
      const formValues = await autoFormPage.getFormValues();
      expect(formValues.marca).toBe(data.marca);
      expect(formValues.modelo).toBe(data.modelo);
      
      // Clear form for next iteration
      await autoFormPage.clearForm();
    }
  });

  test('should handle form submission with Nuevo estado', async ({ page }) => {
    const testData = AutoFormDataProvider.getValidData();
    testData.estado = 'Nuevo';
    
    await autoFormPage.fillAndSubmitForm(testData);
    
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/Autos/Crear');
  });

  test('should handle form submission with Usado estado', async ({ page }) => {
    const testData = AutoFormDataProvider.getValidData();
    testData.estado = 'Usado';
    
    await autoFormPage.fillAndSubmitForm(testData);
    
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/Autos/Crear');
  });

  test('should navigate back to list', async ({ page }) => {
    await autoFormPage.goBackToList();
    
    // Verify navigation occurred
    const currentUrl = page.url();
    expect(currentUrl).toContain('/Autos');
  });

  test('should handle special characters in form fields', async () => {
    const testData = AutoFormDataProvider.getSpecialCharactersData();
    
    await autoFormPage.fillForm(testData);
    
    const formValues = await autoFormPage.getFormValues();
    expect(formValues.marca).toBe(testData.marca);
    expect(formValues.modelo).toBe(testData.modelo);
  });

  test('should validate form fields are required', async ({ page }) => {
    // Try to submit empty form
    await autoFormPage.submitForm();
    
    // Wait a bit to see if validation messages appear
    await page.waitForTimeout(1000);
    
    // Check if we're still on the form page (indicating validation prevented submission)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/Autos/Crear');
  });

  test('should fill form with random generated data', async () => {
    const randomData = AutoFormDataProvider.generateRandomData();
    
    await autoFormPage.fillForm(randomData);
    
    const formValues = await autoFormPage.getFormValues();
    expect(formValues.marca).toBe(randomData.marca);
    expect(formValues.modelo).toBe(randomData.modelo);
  });

  test.only('Agregar un auto', async ( {page} ) => {
    const testData = AutoFormDataProvider.getValidData();
    
    // Fill all form fields
    // Marca (textbox)
    await autoFormPage.marcaInput.fill(testData.marca!);
    
    // Modelo (textbox)
    await autoFormPage.modeloInput.fill(testData.modelo!);
    
    // Numero chasis (textbox)
    await autoFormPage.numeroChasisInput.fill(testData.numeroChasis!);
    
    // Año (textbox, numbers)
    await autoFormPage.añoInput.fill(testData.año!.toString());
    
    // Precio (decimal numbers)
    await autoFormPage.precioInput.fill(testData.precio!.toString());
    
    // Color (textbox)
    await autoFormPage.colorInput.fill(testData.color!);
    
    // Estado (dropdown with values "Usado", "Nuevo")
    await autoFormPage.estadoSelect.selectOption(testData.estado!);
    
    // Click "Crear" button
    await autoFormPage.submitButton.click();

    // Consultar en el listado que el Auto se haya guardado correctamente
    await expect(page, 'No se redirigio a la pagina de listado de autos').toHaveURL(new RegExp(`/Autos`));


    // Consultar por UI que el Auto se haya guardado correctamente
    const chasisValueNuevoAuto = testData.numeroChasis!;

    const chasisLocator = page.getByText(chasisValueNuevoAuto);
    const chasisText = await chasisLocator.textContent();
    console.log('xxx____chasisText value', chasisText);
    expect(chasisText, 'Auto no guardado').toContain(chasisValueNuevoAuto);

      
    // Ir a Listado para obtener el autoId
    const listadoPage = new ListadoPage(page);
    const autoId = await listadoPage.getAutoId(chasisValueNuevoAuto);
    console.log('xxx____autoId value', autoId);
    await page.waitForTimeout(2000);
  });
});

