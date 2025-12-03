import { DailyLog, UserProfile, DEFAULT_PROFILE } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'vitalsync_profile',
  DAILY_LOGS: 'vitalsync_logs',
  AUTH_TOKEN: 'vitalsync_token'
};

export const getProfile = (): UserProfile => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getLogs = (): DailyLog[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  return stored ? JSON.parse(stored) : [];
};

export const saveLog = (log: DailyLog): void => {
  const logs = getLogs();
  const index = logs.findIndex(l => l.date === log.date);
  if (index >= 0) {
    logs[index] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
};

export const getTodayLog = (): DailyLog => {
  const today = new Date().toISOString().split('T')[0];
  const logs = getLogs();
  return logs.find(l => l.date === today) || {
    date: today,
    waterIntake: 0,
    sleepHours: 0,
    steps: 0,
    caloriesIn: 0,
    caloriesBurned: 0,
    mood: ''
  };
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const login = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};