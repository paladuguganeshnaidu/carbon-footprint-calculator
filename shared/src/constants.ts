// CO2e emission factors in kg CO2e per unit
export const EMISSION_FACTORS = {
  energy: {
    electricity: 0.38, // kg CO2e per kWh
    natural_gas: 0.18, // kg CO2e per kWh
  },
  transport: {
    petrol_car: 0.17, // kg CO2e per km
    diesel_car: 0.16, // kg CO2e per km
    electric_car: 0.05, // kg CO2e per km
    bus: 0.09, // kg CO2e per km
    train: 0.04, // kg CO2e per km
    flight_short: 0.24, // kg CO2e per km (< 3 hours / approx 1500 km)
    flight_long: 0.15, // kg CO2e per km
  },
  food: {
    beef: 27.0, // kg CO2e per kg
    poultry: 6.9, // kg CO2e per kg
    vegetarian: 2.0, // kg CO2e per kg
    vegan: 1.5, // kg CO2e per kg
  },
  waste: {
    landfill: 0.45, // kg CO2e per kg of general waste
    recycled: 0.02, // kg CO2e per kg of recycled waste
  }
} as const;

export type Category = keyof typeof EMISSION_FACTORS;

export const SIMULATED_PROJECTS = [
  {
    id: 'amazon_reforestation',
    name: 'Amazon Rainforest Reforestation',
    description: 'Restore degraded land in the Amazon basin. Planting native trees captures carbon and restores biodiversity.',
    factor: 100, // points needed per kg of CO2 offset
    costPerKg: 100,
    region: 'Brazil',
    type: 'Forestry'
  },
  {
    id: 'wind_energy_texas',
    name: 'Texas Clean Wind Infrastructure',
    description: 'Replace fossil-fuel grid electricity by building utility-scale wind farms in west Texas.',
    factor: 80, // points needed per kg of CO2 offset
    costPerKg: 80,
    region: 'United States',
    type: 'Renewables'
  },
  {
    id: 'clean_water_uganda',
    name: 'Ugandan Clean Water Access',
    description: 'Providing clean borehole water to communities, eliminating the need to boil water using firewood.',
    factor: 120, // points needed per kg of CO2 offset
    costPerKg: 120,
    region: 'Uganda',
    type: 'Community'
  }
] as const;

export const ECO_CHALLENGES = [
  {
    id: 'meatless_week',
    title: 'Meatless Week',
    description: 'Go vegetarian or vegan for a week (log vegetarian/vegan food logs only).',
    category: 'food',
    target: 7,
    pointsReward: 500
  },
  {
    id: 'car_free_commute',
    title: 'Car-Free Commute',
    description: 'Use public transit or electric cars for 3 travel logs instead of fossil fuel cars.',
    category: 'transport',
    target: 3,
    pointsReward: 350
  },
  {
    id: 'energy_saver',
    title: 'Vampire Draw Slayer',
    description: 'Log a home energy reading showing less than 100 kWh of total use.',
    category: 'energy',
    target: 100, // threshold
    pointsReward: 200
  },
  {
    id: 'waste_minimizer',
    title: 'Recycling Champion',
    description: 'Log recycled waste weight greater than general waste weight in a waste log.',
    category: 'waste',
    target: 1,
    pointsReward: 150
  }
] as const;
