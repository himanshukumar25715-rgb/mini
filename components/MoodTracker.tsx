import React, { useState } from 'react';
import { analyzeMoodAndSuggest } from '../services/geminiService';
import { saveLog, getTodayLog } from '../services/storageService';

const MoodTracker: React.FC = () => {
  const [diary, setDiary] = useState('');
  const [result, setResult] = useState<{ sentiment: string; suggestion: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!diary.trim()) return;
    setLoading(true);
    
    const analysis = await analyzeMoodAndSuggest(diary);
    setResult(analysis);
    
    // Save sentiment to today's log
    const todayLog = getTodayLog();
    saveLog({ ...todayLog, mood: analysis.sentiment });
    
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-0">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Mental Well-being 🧠</h2>
        <p className="text-gray-500 mt-2">Write down how you feel. AI will detect your mood and offer helpful suggestions.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling right now?
        </label>
        <textarea
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
          placeholder="I am feeling a bit stressed because..."
          className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
        />
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !diary.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Mood'}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 md:col-span-1 text-center">
                <div className="text-sm text-indigo-500 font-bold uppercase tracking-wider mb-1">Detected Mood</div>
                <div className="text-2xl font-bold text-indigo-900">{result.sentiment}</div>
             </div>
             <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 md:col-span-2">
                <div className="text-sm text-purple-500 font-bold uppercase tracking-wider mb-1">AI Suggestion</div>
                <p className="text-gray-800 text-lg italic">"{result.suggestion}"</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;