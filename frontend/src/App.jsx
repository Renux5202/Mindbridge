import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WelcomeView from './components/WelcomeView';
import ChatView from './components/ChatView';
import UrgeSOSView from './components/UrgeSOSView';
import TrackerView from './components/TrackerView';
import HelpView from './components/HelpView';
import { getStoredUser, STORAGE_KEYS } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [nickname, setNickname] = useState(getStoredUser());
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F8] dark:bg-[#121816] text-[#212928] dark:text-[#E5EBE8] transition-colors duration-200">
      
      {/* Persistent Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        nickname={nickname}
        setNickname={setNickname}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'welcome' && (
          <WelcomeView 
            setActiveTab={setActiveTab} 
            nickname={nickname} 
            setNickname={setNickname} 
          />
        )}

        {activeTab === 'chat' && (
          <ChatView 
            nickname={nickname} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'sos' && (
          <UrgeSOSView />
        )}

        {activeTab === 'tracker' && (
          <TrackerView 
            nickname={nickname} 
          />
        )}

        {activeTab === 'help' && (
          <HelpView 
            nickname={nickname} 
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#E3EDE8] dark:border-[#203028] py-6 px-4 text-center text-xs text-[#7A9388] dark:text-[#6F887D]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#5C8979]">MindBridge</span>
            <span>•</span>
            <span>Anonymous Substance Addiction Companion</span>
          </div>
          <div>
            Need immediate crisis help? Call <a href="tel:14446" className="font-bold underline text-[#E26D5C]">14446</a> or <a href="tel:14416" className="font-bold underline text-[#E26D5C]">14416</a> (24/7 Toll-Free).
          </div>
        </div>
      </footer>

    </div>
  );
}
