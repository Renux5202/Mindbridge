// Utilities for anonymous user storage and nickname generation

const ADJECTIVES = [
  'Calm', 'Gentle', 'Silent', 'Peaceful', 'Brave', 'Kind', 'Quiet', 'Patient',
  'Resilient', 'Serene', 'Steady', 'Hopeful', 'Healing', 'Clear', 'Mindful'
];

const NOUNS = [
  'River', 'Breeze', 'Mountain', 'Harbor', 'Sky', 'Haven', 'Forest', 'Valley',
  'Dawn', 'Clover', 'Echo', 'Meadow', 'Horizon', 'Pebble', 'Lantern'
];

export function generateRandomNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${adj}${noun}${num}`;
}

export const STORAGE_KEYS = {
  NICKNAME: 'mindbridge_nickname',
  THEME: 'mindbridge_theme',
  CHAT_HISTORY: 'mindbridge_chat_history',
  MOOD_LOGS: 'mindbridge_mood_logs',
  HABITS: 'mindbridge_habits',
  URGE_LOGS: 'mindbridge_urge_surfs'
};

export function getStoredUser() {
  let nick = localStorage.getItem(STORAGE_KEYS.NICKNAME);
  if (!nick) {
    nick = generateRandomNickname();
    localStorage.setItem(STORAGE_KEYS.NICKNAME, nick);
  }
  return nick;
}

export function wipeAllSessionData() {
  localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  localStorage.removeItem(STORAGE_KEYS.MOOD_LOGS);
  localStorage.removeItem(STORAGE_KEYS.HABITS);
  localStorage.removeItem(STORAGE_KEYS.URGE_LOGS);
  // generate fresh anonymous identity
  const newNick = generateRandomNickname();
  localStorage.setItem(STORAGE_KEYS.NICKNAME, newNick);
  return newNick;
}

export function quickExit() {
  window.location.replace('https://www.google.com');
}
