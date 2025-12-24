/**
 * Test Helper Utilities
 * Common utility functions for tests
 */

import { APIResponse } from '@playwright/test';
import { Car } from '../models/Car';

export class TestHelpers {
  /**
   * Wait for a specific amount of time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a unique chasis number
   */
  static generateUniqueChasis(): string {
    return `CHAS${Date.now()}`.substring(0, 17) 
  }

  /**
   * Generate a random year between min and max
   */
  static generateRandomYear(min: number = 2000, max: number = new Date().getFullYear()): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random price between min and max
   */
  static generateRandomPrice(min: number = 10000, max: number = 50000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Format date to string
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Check if response is successful
   */
  static isSuccessResponse(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
  }

  /**
   * Extract error message from response
   */
  static async extractErrorMessage(response: { status: () => number; statusText: () => string; json: () => Promise<any> }): Promise<string> {
    try {
      const body = await response.json();
      return body.message || body.error || 'Unknown error';
    } catch {
      return response.statusText() || 'Unknown error';
    }
  }

  /**
   * Parse HTML response and extract car details into a Car model
   * Supports common HTML patterns: labels with values, table rows, definition lists
   */
  static async getJsonFromHtmlResponse(response: APIResponse): Promise<Car> {
    const bodyBuffer = await response.body();
    const html = bodyBuffer.toString('utf-8');
    
    return this.parseCarFromHtml(html);
  }

  /**
   * Parse HTML string and extract car details into a Car model
   * Handles various HTML structures commonly used in detail pages
   */
  static parseCarFromHtml(html: string): Car {
    const car = new Car();

    // Helper function to extract text content by label pattern
    const extractByLabel = (labelPattern: RegExp, html: string): string | undefined => {
      // Use the pattern directly for matching, don't escape alternation operators
      const patternSource = labelPattern.source;
      
      // Try multiple patterns: label followed by value in various HTML structures
      const patterns = [
        // Pattern 1: <label>Label</label><span>Value</span> or <div>Value</div>
        new RegExp(`<label[^>]*>\\s*${patternSource}[^<]*</label>\\s*<[^>]+>([^<]+)</`, 'i'),
        // Pattern 2: <dt>Label</dt><dd>Value</dd>
        new RegExp(`<dt[^>]*>\\s*${patternSource}[^<]*</dt>\\s*<dd[^>]*>([^<]+)</dd>`, 'i'),
        // Pattern 3: <th>Label</th><td>Value</td>
        new RegExp(`<th[^>]*>\\s*${patternSource}[^<]*</th>\\s*<td[^>]*>([^<]+)</td>`, 'i'),
        // Pattern 4: Label: Value (simple text pattern)
        new RegExp(`${patternSource}\\s*[:：]\\s*([^<\\n]+)`, 'i'),
        // Pattern 5: <strong>Label</strong> Value
        new RegExp(`<strong[^>]*>\\s*${patternSource}[^<]*</strong>\\s*([^<]+)`, 'i'),
        // Pattern 6: Input value with label (label before input)
        new RegExp(`<label[^>]*>\\s*${patternSource}[^<]*</label>[\\s\\S]*?<input[^>]*value=["']([^"']+)["']`, 'i'),
        // Pattern 7: Form-group structure: <div class="form-group">...<label>Label</label>...<input value="...">
        new RegExp(`<div[^>]*class=["'][^"']*form-group[^"']*["'][^>]*>[\\s\\S]*?<label[^>]*>\\s*${patternSource}[^<]*</label>[\\s\\S]*?<input[^>]*value=["']([^"']+)["']`, 'i'),
        // Pattern 8: Form-group with input first, then label
        new RegExp(`<div[^>]*class=["'][^"']*form-group[^"']*["'][^>]*>[\\s\\S]*?<input[^>]*value=["']([^"']+)["'][^>]*>[\\s\\S]*?<label[^>]*>\\s*${patternSource}[^<]*</label>`, 'i'),
        // Pattern 9: Input by ID (Anio, Anio, etc.)
        new RegExp(`<input[^>]*(?:id|name)=["'](?:Anio|Anio|Año)["'][^>]*value=["']([^"']+)["']`, 'i'),
        // Pattern 10: Input by ID case-insensitive
        new RegExp(`<input[^>]*(?:id|name)=["'][^"']*${patternSource}[^"']*["'][^>]*value=["']([^"']+)["']`, 'i'),
        // Pattern 11: Form-group div containing label text, then find input value
        new RegExp(`<div[^>]*class=["'][^"']*form-group[^"']*["'][^>]*>[\\s\\S]*?${patternSource}[\\s\\S]*?<input[^>]*value=["']([^"']+)["']`, 'i'),
      ];

      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        try {
          const match = html.match(pattern);
          if (match && match[1]) {
            const value = match[1].trim();
            if (value) {
              return value;
            }
          }
        } catch (e) {
          // Skip invalid patterns
          continue;
        }
      }
      return undefined;
    };

    // Helper function to extract number value
    const extractNumber = (labelPattern: RegExp, html: string): number | undefined => {
      const value = extractByLabel(labelPattern, html);
      if (value) {
        // Remove any non-numeric characters except decimal point and minus sign
        const numStr = value.replace(/[^\d.-]/g, '');
        const num = parseFloat(numStr);
        return isNaN(num) ? undefined : num;
      }
      return undefined;
    };

    // Extract marca
    car.marca = extractByLabel(/Marca/i, html);

    // Extract modelo
    car.modelo = extractByLabel(/Modelo/i, html);

    // Extract numeroChasis (try multiple label variations)
    car.numeroChasis = extractByLabel(/N[úu]mero\s+de\s+Chasis|Chasis|Número\s+Chasis/i, html) ||
                       extractByLabel(/NumeroChasis/i, html);

    // Extract año (year) - try multiple approaches
    let añoStr = extractByLabel(/A[ñn]o|Año|Anio/i, html);
    
    // Fallback: try to find input by common IDs/names if label search failed
    if (!añoStr) {
      const añoInputPatterns = [
        /<input[^>]*(?:id|name)=["']Anio["'][^>]*value=["']([^"']+)["']/i,
        /<input[^>]*(?:id|name)=["']Año["'][^>]*value=["']([^"']+)["']/i,
        /<input[^>]*(?:id|name)=["']Ano["'][^>]*value=["']([^"']+)["']/i,
        /<input[^>]*(?:id|name)=["'][^"']*anio[^"']*["'][^>]*value=["']([^"']+)["']/i,
      ];
      
      for (const pattern of añoInputPatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          añoStr = match[1].trim();
          break;
        }
      }
    }
    
    if (añoStr) {
      console.log('xxx____añoStr', añoStr);
      // Parse year: remove all non-digit characters and parse as integer
      const añoNum = parseInt(añoStr.replace(/\D/g, ''));
      car.año = isNaN(añoNum) ? undefined : añoNum;
    } else {
      // Debug: log a snippet of HTML to help diagnose
      const añoMatch = html.match(/A[ñn]o|Año|Anio/i);
      if (añoMatch) {
        const index = html.indexOf(añoMatch[0]);
        const snippet = html.substring(Math.max(0, index - 100), Math.min(html.length, index + 200));
        console.log('HTML snippet around año label:', snippet);
      }
    }

    // Extract precio (price)
    const precioStr = extractByLabel(/Precio/i, html);
    if (precioStr) {
      const precioNum = extractNumber(/Precio/i, html);
      car.precio = precioNum || parseFloat(precioStr.replace(/[^\d.-]/g, '')) || undefined;
    }

    // Extract color
    car.color = extractByLabel(/Color/i, html);

    // Extract estado (state/condition)
    const estadoStr = extractByLabel(/Estado/i, html);
    if (estadoStr) {
      const estadoLower = estadoStr.toLowerCase().trim();
      if (estadoLower === 'nuevo' || estadoLower === 'usado') {
        car.estado = estadoLower === 'nuevo' ? 'Nuevo' : 'Usado';
      }
    }

    // Try to extract ID from URL patterns in the HTML or from data attributes
    const idPatterns = [
      /data-id=["'](\d+)["']/i,
      /id=["'](\d+)["']/i,
      /\/Autos\/(?:Detalle|Modificar|Editar)\/(\d+)/i,
    ];

    for (const pattern of idPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        car.id = parseInt(match[1]) || match[1];
        break;
      }
    }

    return car;
  }
}

