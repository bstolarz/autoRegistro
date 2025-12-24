import { test, expect } from '@playwright/test';
import { ModificarAutoPage } from '../../pages/modificarAutoPage';
import { AutoFormDataProvider } from '../../data/AutoFormDataProvider';
import { AutoApiClient } from '../../api/AutoApiClient';
import { TestHelpers } from '../../utils/TestHelpers';

/**
 * UI Tests Para Sistema de Gestion de Autos
 * Modificar Auto en https://frontend.wildar.dev/Autos/Modificar/{id}
 */

test.describe('Modificar Auto Form - UI Tests', () => {
    let modificarAutoPage: ModificarAutoPage;
    test.beforeEach(async ({ page }) => {
        modificarAutoPage = new ModificarAutoPage(page);
        await modificarAutoPage.goto();
      });

    test('Modificar un auto', async ({page, request}) => {
        // Verify form is pre-filled with existing data
        const isPreFilled = await modificarAutoPage.verifyFormPreFilled();
        expect(isPreFilled, 'Form is not pre-filled').toBe(true);
        
        // Get auto ID from URL before modifying
        const autoId = TestHelpers.getAutoIdFromUrl(page);
        expect(autoId, 'Auto ID should be present in URL').toBeTruthy();
        
        // Get current marca value and create new value
        const marcaValue = await modificarAutoPage.marcaInput.inputValue();
        const newMarcaValue = marcaValue + 'T';
        
        // Modify the marca field
        await modificarAutoPage.modifyFields({ marca: newMarcaValue });
        
        // Submit the form
        await modificarAutoPage.submitForm();
        
        // Verify redirect to list page
        await expect(page, 'No se redirigio a la pagina de listado de autos').toHaveURL(new RegExp(`/Autos`));
        
        // Wait a moment for server to process the update
        await page.waitForTimeout(1000);
        
        // Retrieve the car from API to verify the change was saved
        const response = await AutoApiClient.getAutoById(request, autoId);
        expect(response.status(), 'API response should be successful').toBeGreaterThanOrEqual(200);
        expect(response.status(), 'API response should be successful').toBeLessThan(300);
        
        // Parse HTML response and verify marca was updated
        const responseCar = await TestHelpers.getJsonFromHtmlResponse(response);
        expect(responseCar.marca, 'Marca no modificada').toBe(newMarcaValue);
    });
});