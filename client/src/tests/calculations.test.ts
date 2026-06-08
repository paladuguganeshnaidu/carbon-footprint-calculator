import { describe, it, expect } from 'vitest';
import { EMISSION_FACTORS } from '@carbon/shared';

describe('Client Emission Factors Check', () => {
  it('resolves correct emission factors from the shared workspace', () => {
    expect(EMISSION_FACTORS.energy.electricity).toBe(0.38);
    expect(EMISSION_FACTORS.transport.petrol_car).toBe(0.17);
    expect(EMISSION_FACTORS.food.beef).toBe(27.0);
    expect(EMISSION_FACTORS.waste.landfill).toBe(0.45);
  });
});
