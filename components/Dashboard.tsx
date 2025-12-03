import React, { useMemo } from 'react';
import { DailyLog, UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  logs: DailyLog[];
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, user }) => {
  // Process data for charts
  const chartData = useMemo(() => {
    // Get last 7 entries or less
    return logs.slice(-7).map(log => ({
      name: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
      Water: log.waterIntake,
      Sleep: log.sleepHours,
      Steps: log.steps,
      Calories: log.caloriesIn
    }));
  }, [logs]);

  // BMI Calculation
  const bmi = (user.weight / ((user.height / 100) * (user.height / 100))).toFixed(1);
  const getBmiStatus = (bmi: string) => {
    const val = parseFloat(bmi);
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (val < 25) return { label: 'Healthy', color: 'text-green-500' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };
  const bmiStatus = getBmiStatus(bmi);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome back, {user.name} 👋</h2>
        <p className="text-gray-500 mt-1">Here is your health overview for today.</p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">BMI Score</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-gray-900">{bmi}</span>
            <span className={`text-sm font-medium ${bmiStatus.color}`}>{bmiStatus.label}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Avg. Sleep</div>
          <div className="mt-2">
             <span className="text-3xl font-bold text-indigo-600">
               {(logs.reduce((acc, l) => acc + l.sleepHours, 0) / (logs.length || 1)).toFixed(1)}
             </span>
             <span className="text-gray-400 text-sm ml-1">hrs/night</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Total Steps (7d)</div>
          <div className="mt-2">
             <span className="text-3xl font-bold text-emerald-600">
               {logs.slice(-7).reduce((acc, l) => acc + l.steps, 0).toLocaleString()}
             </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Streak</div>
          <div className="mt-2">
             <span className="text-3xl font-bold text-orange-500">{logs.length}</span>
             <span className="text-gray-400 text-sm ml-1">days tracked</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hydration & Sleep</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                <Bar yAxisId="left" dataKey="Water" name="Water (ml)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="Sleep" name="Sleep (hrs)" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Calories & Steps</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis yAxisId="left" orientation="left" stroke="#ef4444" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                <Line yAxisId="left" type="monotone" dataKey="Calories" stroke="#ef4444" strokeWidth={2} dot={{r: 4}} />
                <Line yAxisId="right" type="monotone" dataKey="Steps" stroke="#10b981" strokeWidth={2} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Quick Tip */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl text-white shadow-md">
        <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
                <h3 className="text-lg font-bold">Daily Insight</h3>
                <p className="opacity-90 text-sm mt-1">Based on your sleep patterns, try going to bed 30 minutes earlier tonight to improve your recovery score for tomorrow's workout.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;