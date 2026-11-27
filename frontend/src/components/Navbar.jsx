import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Trash2, 
  LogOut, 
  HeartHandshake, 
  MessageSquareHeart, 
  Flame, 
  Activity, 
  HelpCircle,
  Menu,
  X,
  Download
} from 'lucide-react';
import { quickExit, wipeAllSessionData } from '../utils/storage';

export default function Navbar({ activeTab, setActiveTab, nickname, setNickname, theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Listen for PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  // Esc key listener for Quick Exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        quickExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWipe = () => {
    const newNick = wipeAllSessionData();
    setNickname(newNick);
    setShowWipeModal(false);
    window.location.reload();
  };

  const navItems = [
    { id: 'welcome', label: 'Home', icon: HeartHandshake },
    { id: 'chat', label: 'AI Companion', icon: MessageSquareHeart },
    { id: 'sos', label: 'Urge SOS', icon: Flame, badge: 'Craving Help' },
    { id: 'tracker', label: 'Mood & Habits', icon: Activity },
    { id: 'help', label: 'Helplines & Rehab', icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F7F9F8]/90 dark:bg-[#121816]/90 backdrop-blur-md border-b border-[#E3EDE8] dark:border-[#24352F] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Identity */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('welcome')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5C8979] to-[#3D7879] flex items-center justify-center text-white shadow-sm shadow-[#5C8979]/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="font-semibold text-lg tracking-tight text-[#212928] dark:text-[#E5EBE8] flex items-center gap-1.5">
                  MindBridge
                </span>
                <span className="hidden sm:inline-block text-xs text-[#5C8979] dark:text-[#88BBA7] font-medium">
                  Anonymous Support
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              {/* Mobile Install App Button */}
            {installPrompt && !isInstalled && (
              <button
                onClick={() => {
                  handleInstallClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 mb-2 rounded-xl bg-[#5C8979] text-white text-xs font-semibold shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Install MindBridge App on Device</span>
              </button>
            )}

            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'bg-[#E3EDE8] dark:bg-[#1D2B25] text-[#395B4E] dark:text-[#9DD1BE] shadow-xs'
                        : 'text-[#4A5D56] dark:text-[#A7BCB3] hover:bg-[#F3F7F5] dark:hover:bg-[#19241F]'
                    } ${item.id === 'sos' && !isActive ? 'text-[#D96B5B] hover:text-[#C75A4A]' : ''}`}
                  >
                    <Icon className={`w-4 h-4 ${item.id === 'sos' ? 'text-[#E26D5C]' : ''}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-[#E26D5C]/15 text-[#E26D5C] ml-1">
                        SOS
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions & Privacy Controls */}
            <div className="flex items-center gap-2">
              
              {/* User Anonymous Pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E3EDE8]/60 dark:bg-[#1C2924] border border-[#D5E4DC] dark:border-[#2C4037] text-xs text-[#4A5D56] dark:text-[#9EC0B3]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5C8979]" />
                <span className="font-mono text-[11px] font-medium">{nickname}</span>
              </div>

              {/* Optional Install App Button (Desktop & Mobile) */}
              {installPrompt && !isInstalled && (
                <button
                  onClick={handleInstallClick}
                  title="Install MindBridge App"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5C8979] hover:bg-[#4A7364] text-white text-xs font-semibold shadow-xs transition-all animate-in fade-in"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Install App</span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-xl text-[#4A5D56] dark:text-[#A7BCB3] hover:bg-[#E3EDE8] dark:hover:bg-[#1C2924] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Wipe Session Button */}
              <button
                onClick={() => setShowWipeModal(true)}
                title="Wipe My Session (Clears all chats and data)"
                className="p-2 rounded-xl text-[#8E9F97] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                aria-label="Wipe my session"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Persistent Quick Exit (Esc) Shield */}
              <button
                onClick={quickExit}
                title="Quick Exit (Immediately opens Google) - Press Esc anytime"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E26D5C] hover:bg-[#D05B4A] text-white text-xs font-semibold shadow-sm shadow-[#E26D5C]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Quick Exit</span>
                <span className="hidden sm:inline-block px-1 py-0.2 bg-black/20 rounded text-[10px] font-mono">Esc</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-[#4A5D56] dark:text-[#A7BCB3] hover:bg-[#E3EDE8] dark:hover:bg-[#1C2924]"
                aria-label="Open mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E3EDE8] dark:border-[#24352F] bg-[#F7F9F8] dark:bg-[#121816] px-4 pt-2 pb-4 space-y-1">
            <div className="flex items-center justify-between py-2 px-3 mb-2 rounded-lg bg-[#E3EDE8]/50 dark:bg-[#1A2621] text-xs text-[#4A5D56] dark:text-[#A7BCB3]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#5C8979]" /> Anonymous Identity:
              </span>
              <span className="font-mono font-semibold text-[#395B4E] dark:text-[#88BBA7]">{nickname}</span>
            </div>

            {/* Mobile Install App Button */}
            {installPrompt && !isInstalled && (
              <button
                onClick={() => {
                  handleInstallClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 mb-2 rounded-xl bg-[#5C8979] text-white text-xs font-semibold shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Install MindBridge App on Device</span>
              </button>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#E3EDE8] dark:bg-[#1D2B25] text-[#395B4E] dark:text-[#9DD1BE]'
                      : 'text-[#4A5D56] dark:text-[#A7BCB3] hover:bg-[#F3F7F5] dark:hover:bg-[#19241F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.id === 'sos' ? 'text-[#E26D5C]' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#E26D5C]/15 text-[#E26D5C]">
                      SOS
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Wipe Confirmation Modal */}
      {showWipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1A2621] rounded-2xl p-6 max-w-sm w-full shadow-xl border border-[#E3EDE8] dark:border-[#2C4037] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-[#212928] dark:text-[#E5EBE8] mb-2">
              Wipe Session Data?
            </h3>
            <p className="text-sm text-center text-[#6A7F77] dark:text-[#9EBAAE] mb-6">
              This will permanently delete your chat conversations, mood logs, and habit streaks from your browser. A fresh anonymous profile will be generated.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWipeModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#D5E4DC] dark:border-[#2C4037] text-sm font-medium text-[#4A5D56] dark:text-[#A7BCB3] hover:bg-[#F3F7F5] dark:hover:bg-[#16201B]"
              >
                Cancel
              </button>
              <button
                onClick={handleWipe}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-all"
              >
                Confirm Wipe
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
