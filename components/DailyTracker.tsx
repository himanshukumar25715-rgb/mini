import React, { useState, useEffect } from 'react';
import { DailyLog, UserProfile } from '../types';
import { getTodayLog, saveLog } from '../services/storageService';
import { predictWaterNeeds } from '../services/geminiService';

interface TrackerProps {
  user: UserProfile;
}

const DailyTracker: React.FC<TrackerProps> = ({ user }) => {
  const [log, setLog] = useState<DailyLog>(getTodayLog());
  const [aiWaterGoal, setAiWaterGoal] = useState<number | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // Initial prediction on load
    const fetchPrediction = async () => {
        setLoadingAi(true);
        // Mocking "Sunny" climate for now, in real app use Weather API
        const goal = await predictWaterNeeds("Sunny and Warm", user.activityLevel, user.weight);
        setAiWaterGoal(goal);
        setLoadingAi(false);
    };
    fetchPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleChange = (field: keyof DailyLog, value: number | string) => {
    const newLog = { ...log, [field]: value };
    setLog(newLog);
    saveLog(newLog);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 pb-24 md:pb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Tracker</h2>
      <p className="text-gray-500 mb-8 text-sm">Log your daily activities to get better AI predictions.</p>

      <div className="space-y-8">
        {/* Water Section */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <label className="font-semibold text-blue-800 flex items-center gap-2">
                💧 Water Intake (ml)
            </label>
            {loadingAi ? (
                <span className="text-xs text-blue-400 animate-pulse">AI Calculating goal...</span>
            ) : (
                <span className="text-xs font-medium bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    AI Goal: {aiWaterGoal}ml
                </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => handleChange('waterIntake', Math.max(0, log.waterIntake - 250))}
                className="w-10 h-10 rounded-full bg-white text-blue-600 shadow-sm hover:bg-blue-100 font-bold"
            >-</button>
            <input 
                type="number" 
                value={log.waterIntake} 
                onChange={(e) => handleChange('waterIntake', parseInt(e.target.value) || 0)}
                className="flex-1 text-center text-2xl font-bold text-blue-700 bg-transparent border-b-2 border-blue-200 focus:border-blue-500 outline-none p-2"
            />
             <button 
                onClick={() => handleChange('waterIntake', log.waterIntake + 250)}
                className="w-10 h-10 rounded-full bg-white text-blue-600 shadow-sm hover:bg-blue-100 font-bold"
            >+</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sleep */}
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                <label className="block font-semibold text-indigo-800 mb-2">😴 Sleep (Hours)</label>
                <input 
                    type="range" 
                    min="0" 
                    max="12" 
                    step="0.5"
                    value={log.sleepHours} 
                    onChange={(e) => handleChange('sleepHours', parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 mb-2"
                />
                <div className="text-center font-bold text-indigo-600 text-xl">{log.sleepHours} hrs</div>
            </div>

            {/* Steps */}
            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                <label className="block font-semibold text-emerald-800 mb-2">👣 Steps</label>
                <input 
                    type="number" 
                    value={log.steps} 
                    onChange={(e) => handleChange('steps', parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                 <button 
                    onClick={() => handleChange('steps', log.steps + 1000)} // Simulation of syncing
                    className="mt-2 text-xs text-emerald-600 hover:underline w-full text-right"
                >
                    + Simulate Wearable Sync (1k)
                </button>
            </div>
        </div>

        {/* Calories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                <label className="block font-semibold text-orange-800 mb-2">🍔 Calories In</label>
                <input 
                    type="number" 
                    value={log.caloriesIn} 
                    onChange={(e) => handleChange('caloriesIn', parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
            </div>
            <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                <label className="block font-semibold text-red-800 mb-2">🔥 Calories Burned</label>
                <input 
                    type="number" 
                    value={log.caloriesBurned} 
                    onChange={(e) => handleChange('caloriesBurned', parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 outline-none"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;