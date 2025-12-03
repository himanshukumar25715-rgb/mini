import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: ViewState.TRACKER, label: 'Daily Tracker', icon: '📝' },
    { id: ViewState.SCANNER, label: 'Food Scanner', icon: '🍎' },
    { id: ViewState.MOOD, label: 'Mood AI', icon: '🧠' },
    { id: ViewState.CHAT, label: 'AI Assistant', icon: '💬' },
    { id: ViewState.PROFILE, label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
          <span>⚕️</span> VitalSync
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
              ${currentView === item.id 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export const MobileNav: React.FC<SidebarProps> = ({ currentView, setView }) => {
    const navItems = [
    { id: ViewState.DASHBOARD, label: 'Home', icon: '📊' },
    { id: ViewState.TRACKER, label: 'Track', icon: '📝' },
    { id: ViewState.SCANNER, label: 'Scan', icon: '🍎' },
    { id: ViewState.CHAT, label: 'Chat', icon: '💬' },
    { id: ViewState.PROFILE, label: 'Me', icon: '👤' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50 shadow-lg">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium ${currentView === item.id ? 'text-emerald-600' : 'text-gray-500'}`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            {item.label}
          </button>
        ))}
    </div>
  )
}

export default Sidebar;