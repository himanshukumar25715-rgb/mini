import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodAnalysis } from '../types';

const FoodScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFoodImage(image);
      if (result) {
        setAnalysis(result);
      } else {
        setError("Could not analyze image. Please try a clearer photo.");
      }
    } catch (err) {
      setError("An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-0">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">AI Food Scanner 🥗</h2>
        <p className="text-gray-500 mt-2">Snap a photo of your meal or a nutrition label to get instant facts.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        {/* Image Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
            {image ? (
                <div className="relative">
                    <img src={image} alt="Food preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                    <button 
                        onClick={() => { setImage(null); setAnalysis(null); }}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                    >
                        ❌
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-5xl mb-4">📸</div>
                    <p className="text-gray-600 font-medium mb-4">Click to upload or capture</p>
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                    >
                        Select Image
                    </button>
                </div>
            )}
        </div>

        {/* Analyze Button */}
        {image && !analysis && (
            <div className="mt-6 text-center">
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all transform hover:scale-105
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}
                >
                    {loading ? 'Analyzing...' : '🔍 Analyze Nutrition'}
                </button>
            </div>
        )}

        {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center">
                {error}
            </div>
        )}

        {/* Results */}
        {analysis && (
            <div className="mt-8 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Result: {analysis.foodName}</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-orange-600 font-semibold">CALORIES</div>
                        <div className="text-2xl font-bold text-gray-800">{analysis.calories}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-blue-600 font-semibold">PROTEIN</div>
                        <div className="text-2xl font-bold text-gray-800">{analysis.protein}g</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-yellow-600 font-semibold">CARBS</div>
                        <div className="text-2xl font-bold text-gray-800">{analysis.carbs}g</div>
                    </div>
                     <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-purple-600 font-semibold">FATS</div>
                        <div className="text-2xl font-bold text-gray-800">{analysis.fats}g</div>
                    </div>
                </div>

                <div className={`p-4 rounded-lg border ${analysis.healthy ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <strong className={`block mb-1 ${analysis.healthy ? 'text-green-700' : 'text-yellow-700'}`}>
                        {analysis.healthy ? '✅ Healthy Choice' : '⚠️ Consume in Moderation'}
                    </strong>
                    <p className="text-gray-700 text-sm">{analysis.advice}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FoodScanner;