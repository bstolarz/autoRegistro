import { APIRequestContext, APIResponse } from '@playwright/test';
import { AutoFormData } from '../data/AutoFormDataProvider';
import { TestHelpers } from '../utils/TestHelpers';

/**
 * API Client for Auto-related endpoints
 * Handles API interactions for testing
 */
export class AutoApiClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = 'https://frontend.wildar.dev') {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Create a new auto via API
   */
  async createAuto(data: AutoFormData): Promise<APIResponse> {
    const url = `${this.baseURL}/Autos/Crear`;
    const postData: Record<string, string | number> = {
      marca: data.marca || '',
      Modelo: data.modelo || '',
      NumeroChasis: data.numeroChasis || '',
      Anio: data.año || '',
      __Invariant: 'Anio',
      Precio: data.precio || '',
      Color: data.color || '',
      Estado: data.estado || '',
      __RequestVerificationToken: 'CfDJ8MBtWhMatANAuTIpbTkbSA6UXTyP4M5e370XR3ccmbAXG5Kn2r5cISiF5zbNOqS-Fd31perGmSRjMJ493yN_h3JB3kSRZoacDvlnWreu3YgchS8bD4GHKXxIMXjSgMEkvKbS7ioptyHhkSTyxMKKny8',
    };
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-AR,en-US;q=0.7,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://frontend.wildar.dev',
      'Connection': 'keep-alive',
      'Referer': 'https://frontend.wildar.dev/Autos/Crear',
      'Cookie': '.AspNetCore.Antiforgery.HU28zRzfRIg=CfDJ8MBtWhMatANAuTIpbTkbSA62UsvFQKNnZacIkAkUC4ovgzFGmwbgyMz40lZyw30W7eNNmDaOhulWAUr91QzGzsKIslpkI7ywJgIEVHjyr08e4rtFCjD8SzRQAlEH0hULrjrhYh-BQAA-eyqdwpctBes',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Priority': 'u=0, i',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'TE': 'trailers',
    };

    console.log('=== POST Request Details ===');
    console.log('URL:', url);
    console.log('POST Data:', JSON.stringify(postData, null, 2));
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('===========================');

    const response = await this.request.post(url, {
      form: postData,
      headers: headers,
    });

    // Log error response if status is not successful
    if (response.status() >= 400) {
      console.log('=== Error Response ===');
      console.log('Status:', response.status());
      console.log('Status Text:', response.statusText());
      console.log('Response Headers:', response.headers());
      console.log('Note: Check response body in test for detailed error message');
      console.log('======================');
    }

    return response;
  }

  /**
   * Get auto by ID
   */
  async getAutoById(id: string | number): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}/Autos/Detalle/${id}`);
  }

  /**
   * Get all autos
   */
  async getAllAutos(): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}/api/Autos`);
  }

  /**
   * Update an auto
   */
  async updateAuto(id: string | number, data: Partial<AutoFormData>): Promise<APIResponse> {
    return await this.request.put(`${this.baseURL}/api/Autos/${id}`, {
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Delete an auto
   */
  async deleteAuto(id: string | number): Promise<APIResponse> {
    return await this.request.delete(`${this.baseURL}/api/Autos/${id}`);
  }

  /**
   * Validate auto creation response
   */
  async validateCreateResponse(response: APIResponse, expectedData: AutoFormData): Promise<boolean> {
    if (response.status() !== 200 && response.status() !== 201) {
      console.log('xxx____response.status()', response.status());
      return false;
    }

    const responseBody = await TestHelpers.getJsonFromHtmlResponse(response);
    
    console.log('xxx____responseBody', responseBody);
    // Validate response contains expected data
    if (expectedData.marca && responseBody.marca !== expectedData.marca) {
      return false;
    }
    if (expectedData.modelo && responseBody.modelo !== expectedData.modelo) {
      return false;
    }
    if (expectedData.numeroChasis && responseBody.numeroChasis !== expectedData.numeroChasis) {
      return false;
    }

    return true;
  }
}

