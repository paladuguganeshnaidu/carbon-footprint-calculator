import { describe, it, expect } from 'vitest';
import { calculateCarbon } from '../utils/calculator.js';

describe('Carbon Calculation Math', () => {
  it('correctly calculates energy emissions', () => {
    // Electricity: 100 kWh * 0.38 = 38 kg CO2e
    const electricityResult = calculateCarbon('energy', 'electricity', 100);
    expect(electricityResult.carbonCo2eKg).toBe(38);
    expect(electricityResult.unit).toBe('kWh');

    // Natural Gas: 50 kWh * 0.18 = 9 kg CO2e
    const gasResult = calculateCarbon('energy', 'natural_gas', 50);
    expect(gasResult.carbonCo2eKg).toBe(9);
  });

  it('correctly calculates transit emissions', () => {
    // Petrol Car: 100 km * 0.17 = 17 kg CO2e
    const petrolResult = calculateCarbon('transport', 'petrol_car', 100);
    expect(petrolResult.carbonCo2eKg).toBe(17);
  });

  it('correctly calculates food emissions', () => {
    // Beef: 2 kg * 27.0 = 54 kg CO2e
    const beefResult = calculateCarbon('food', 'beef', 2);
    expect(beefResult.carbonCo2eKg).toBe(54);
  });

  it('throws on invalid subcategory', () => {
    expect(() => calculateCarbon('energy', 'non_existent_fuel', 100)).toThrow();
  });
});
