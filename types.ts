export interface Word {
  id: number;
  word: string;
  meaning: string;
  level: number;
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
  maxUnlockedLevel: number;
  stars: Record<number, number>;
  // Runtime properties for versus mode
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
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'MANUAL';
}

export type AppState = 
  | 'SPLASH' 
  | 'USER_SELECT' 
  | 'MENU' 
  | 'WORLD_SELECT' 
  | 'LEVEL_SELECT' 
  | 'BATTLE' 
  | 'VERSUS_SETUP' 
  | 'VERSUS_GAME' 
  | 'RESULT';

export interface BattleResult {
  status: 'WIN' | 'LOSE';
  stars: number;
}