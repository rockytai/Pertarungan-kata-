
export interface Word {
  id: number;
  word: string;
  meaning: string;
  level: number;
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  condition: (player: Player) => boolean;
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
  maxUnlockedLevel: number;
  stars: Record<number, number>;
  scores: Record<number, number>; 
  mistakes: number[]; 
  achievements: string[]; // List of unlocked achievement IDs
  
  xp: number;         
  playerLevel: number; 

  score?: number;
  hp?: number;
  isComputer?: boolean;
}

export interface World {
  id: number;
  name: string;
  enemy: string;
  hp: number;
  img: string;
  theme: string;
  bgPattern: string;
  desc: string;
  textColor: string;
}

export interface VersusConfig {
  p1: Player;
  p2: Player;
  words: Word[];
  mode: 'RACE_TO_10' | 'TIME_ATTACK';
  difficultyAI: 'EASY' | 'MEDIUM' | 'HARD'; 
}

export type AppState = 
  | 'SPLASH' 
  | 'USER_SELECT' 
  | 'MENU' 
  | 'WORLD_SELECT' 
  | 'LEVEL_SELECT' 
  | 'STUDY_PHASE'
  | 'MODE_SELECT'
  | 'LEADERBOARD_VIEW'
  | 'BATTLE' 
  | 'MISTAKE_REVIEW'
  | 'VERSUS_SETUP' 
  | 'VERSUS_GAME' 
  | 'ACHIEVEMENTS'
  | 'RESULT';

export type BattleMode = 'QUIZ' | 'MATCH';

export interface LeaderboardEntry {
  playerName: string;
  avatar: string;
  timeMs: number;
  score: number;
  date: number;
}

export interface VersusLeaderboardEntry {
  playerName: string;
  avatar: string;
  wins: number;
  lastPlayed: number;
}

export interface BattleResult {
  status: 'WIN' | 'LOSE';
  stars: number;
  timeMs?: number;
  score?: number;
  xpGained: number;
  isLevelUp: boolean;
  newAchievements?: string[];
}
