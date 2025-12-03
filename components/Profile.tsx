import React, { useState } from 'react';
import { UserProfile } from '../types';
import { saveProfile } from '../services/storageService';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (u: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(formData);
    onUpdate(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200 pb-24 md:pb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input 
                    type="number" 
                    required
                    value={formData.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input 
                    type="number" 
                    required
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input 
                    type="number" 
                    required
                    value={formData.height}
                    onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Goal</label>
                <select
                    value={formData.goal}
                    onChange={(e) => handleChange('goal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                    <option value="weight_loss">Lose Weight</option>
                    <option value="maintain">Maintain</option>
                    <option value="muscle_gain">Build Muscle</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                <select
                    value={formData.activityLevel}
                    onChange={(e) => handleChange('activityLevel', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Activity</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Very Active</option>
                </select>
            </div>
        </div>

        <button 
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
            Save Profile
        </button>
        {saved && <p className="text-center text-green-600 text-sm animate-bounce">Profile updated successfully!</p>}
      </form>
    </div>
  );
};

export default Profile;