import { EMISSION_FACTORS, Category } from '@carbon/shared';

export function calculateCarbon(
  category: Category,
  subCategory: string,
  value: number
): { carbonCo2eKg: number; unit: string } {
  let factor = 0;
  let unit = '';

  switch (category) {
    case 'energy':
      if (subCategory === 'electricity') {
        factor = EMISSION_FACTORS.energy.electricity;
        unit = 'kWh';
      } else if (subCategory === 'natural_gas') {
        factor = EMISSION_FACTORS.energy.natural_gas;
        unit = 'kWh';
      } else {
        throw new Error(`Invalid subCategory ${subCategory} for category energy`);
      }
      break;
    case 'transport':
      if (subCategory === 'petrol_car') {
        factor = EMISSION_FACTORS.transport.petrol_car;
        unit = 'km';
      } else if (subCategory === 'diesel_car') {
        factor = EMISSION_FACTORS.transport.diesel_car;
        unit = 'km';
      } else if (subCategory === 'electric_car') {
        factor = EMISSION_FACTORS.transport.electric_car;
        unit = 'km';
      } else if (subCategory === 'bus') {
        factor = EMISSION_FACTORS.transport.bus;
        unit = 'km';
      } else if (subCategory === 'train') {
        factor = EMISSION_FACTORS.transport.train;
        unit = 'km';
      } else if (subCategory === 'flight_short') {
        factor = EMISSION_FACTORS.transport.flight_short;
        unit = 'km';
      } else if (subCategory === 'flight_long') {
        factor = EMISSION_FACTORS.transport.flight_long;
        unit = 'km';
      } else {
        throw new Error(`Invalid subCategory ${subCategory} for category transport`);
      }
      break;
    case 'food':
      if (subCategory === 'beef') {
        factor = EMISSION_FACTORS.food.beef;
        unit = 'kg';
      } else if (subCategory === 'poultry') {
        factor = EMISSION_FACTORS.food.poultry;
        unit = 'kg';
      } else if (subCategory === 'vegetarian') {
        factor = EMISSION_FACTORS.food.vegetarian;
        unit = 'kg';
      } else if (subCategory === 'vegan') {
        factor = EMISSION_FACTORS.food.vegan;
        unit = 'kg';
      } else {
        throw new Error(`Invalid subCategory ${subCategory} for category food`);
      }
      break;
    case 'waste':
      if (subCategory === 'landfill') {
        factor = EMISSION_FACTORS.waste.landfill;
        unit = 'kg';
      } else if (subCategory === 'recycled') {
        factor = EMISSION_FACTORS.waste.recycled;
        unit = 'kg';
      } else {
        throw new Error(`Invalid subCategory ${subCategory} for category waste`);
      }
      break;
    default:
      throw new Error(`Invalid category ${category}`);
  }

  return {
    carbonCo2eKg: parseFloat((value * factor).toFixed(2)),
    unit,
  };
}
