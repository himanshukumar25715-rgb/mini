export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female' | 'other';
  goal: 'weight_loss' | 'maintain' | 'muscle_gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
}

export interface DailyLog {
  date: string;
  waterIntake: number; // ml
  sleepHours: number;
  steps: number;
  caloriesIn: number;
  caloriesBurned: number;
  mood: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: number;
}

export interface FoodAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthy: boolean;
  advice: string;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  TRACKER = 'TRACKER',
  CHAT = 'CHAT',
  SCANNER = 'SCANNER',
  MOOD = 'MOOD',
  PROFILE = 'PROFILE'
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Guest User',
  age: 30,
  weight: 70,
  height: 170,
  gender: 'male',
  goal: 'maintain',
  activityLevel: 'moderate'
};