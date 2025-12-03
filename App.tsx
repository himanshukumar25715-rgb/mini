import React, { useState, useEffect } from 'react';
import Sidebar, { MobileNav } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DailyTracker from './components/DailyTracker';
import FoodScanner from './components/FoodScanner';
import ChatAssistant from './components/ChatAssistant';
import MoodTracker from './components/MoodTracker';
import Profile from './components/Profile';
import Auth from './components/Auth';
import { ViewState, UserProfile } from './types';
import { isAuthenticated, getProfile, getLogs, logout } from './services/storageService';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [user, setUser] = useState<UserProfile>(getProfile());
  const [logs, setLogs] = useState(getLogs());

  // Check auth on mount
  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setUser(getProfile());
    setLogs(getLogs());
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setView(ViewState.LOGIN);
  };

  // Refresh logs/user when view changes to ensure fresh data from local storage
  useEffect(() => {
    if (loggedIn) {
      setLogs(getLogs());
    }
  }, [view, loggedIn]);

  const renderView = () => {
    switch (view) {
      case ViewState.DASHBOARD:
        return <Dashboard logs={logs} user={user} />;
      case ViewState.TRACKER:
        return <DailyTracker user={user} />;
      case ViewState.SCANNER:
        return <FoodScanner />;
      case ViewState.CHAT:
        return <ChatAssistant user={user} />;
      case ViewState.MOOD:
        return <MoodTracker />;
      case ViewState.PROFILE:
        return <Profile user={user} onUpdate={setUser} />;
      default:
        return <Dashboard logs={logs} user={user} />;
    }
  };

  if (!loggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar currentView={view} setView={setView} onLogout={handleLogout} />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
        {renderView()}
      </main>

      {/* Mobile Nav */}
      <MobileNav currentView={view} setView={setView} onLogout={handleLogout} />
    </div>
  );
};

export default App;