export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: number;
  points: number;
  currentStreak: number;
  lastActiveDate: string | null;
}

export interface FootprintEntry {
  id: string;
  userId: string;
  entryDate: string; // YYYY-MM-DD
  category: 'energy' | 'transport' | 'food' | 'waste';
  inputValue: number;
  inputUnit: string;
  carbonCo2eKg: number;
  metadata: string; // JSON Stringified details (e.g. transitMode, subCategory)
  createdAt: number;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  startedAt: number;
  completedAt: number | null;
}

export interface UserAchievement {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: number;
}

export interface OffsetPurchase {
  id: string;
  userId: string;
  projectId: string;
  offsetAmountCo2eKg: number;
  costSimulatedCurrency: number;
  purchasedAt: number;
}

export interface CarbonCalculationRequest {
  category: 'energy' | 'transport' | 'food' | 'waste';
  subCategory: string; // e.g. electricity, gas, petrol_car, beef, landfill
  value: number; // raw value
}

export interface CarbonCalculationResponse {
  carbonCo2eKg: number;
  unit: string;
}

export interface DashboardSummaryResponse {
  user: User;
  kpis: {
    totalCarbonThisMonthKg: number;
    pointsEarned: number;
    activeStreak: number;
    challengesCompleted: number;
  };
  breakdown: {
    category: string;
    value: number;
    percentage: number;
  }[];
  monthlyHistory: {
    month: string;
    carbonKg: number;
    offsetKg: number;
    targetKg: number;
  }[];
  goals?: UserGoal[];
}

export interface UserGoal {
  id: string;
  userId: string;
  category: string;
  targetValue: number;
  targetMonth: string;
  createdAt: number;
}
