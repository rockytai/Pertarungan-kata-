
import React, { useState, useEffect } from 'react';
import UserSelect from './features/UserSelect';
import VersusSetup from './features/VersusSetup';
import VersusGame from './features/VersusGame';
import SinglePlayerBattle from './features/SinglePlayerBattle';
import SinglePlayerMatch from './features/SinglePlayerMatch';
import MistakeReview from './features/MistakeReview';
import LevelStudy from './features/LevelStudy';
import AchievementView from './features/AchievementView';
import Card from './components/Card';
import Button from './components/Button';
import PlayerAvatar from './components/PlayerAvatar';
import { Sword, Users, Home, ArrowLeft, Star, ArrowRight, RefreshCcw, Lock, Puzzle, Trophy, Shield, Award, Zap } from './components/Icons';
import { Player, AppState, VersusConfig, BattleResult, BattleMode } from './types';
import { AVATARS, WORLDS, TOTAL_LEVELS, getNextLevelXp, ACHIEVEMENTS, getPlayerRank } from './constants';
import { saveScore, getLeaderboard, formatTime, saveVersusWin, getVersusLeaderboard } from './utils/leaderboard';

function App() {
  const [appState, setAppState] = useState<AppState>('SPLASH'); 
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  const [selectedWorld, setSelectedWorld] = useState(1);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [battleMode, setBattleMode] = useState<BattleMode>('QUIZ');
  
  // Leaderboard State
  const [lbTab, setLbTab] = useState<'SINGLE'|'VERSUS'>('SINGLE');
  const [lbSubTab, setLbSubTab] = useState<'QUIZ'|'MATCH'>('QUIZ');
  
  const [versusConfig, setVersusConfig] = useState<VersusConfig | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  useEffect(() => {
      const savedPlayers = JSON.parse(localStorage.getItem('clash_players') || '[]');
      const migratedPlayers = savedPlayers.map((p: any) => ({
          ...p,
          scores: p.scores || {},
          mistakes: p.mistakes || [],
          xp: p.xp || 0,
          playerLevel: p.playerLevel || 1,
          achievements: p.achievements || []
      }));
      if (migratedPlayers.length > 0) setPlayers(migratedPlayers);
  }, []);

  const savePlayers = (newPlayers: Player[]) => {
      setPlayers(newPlayers);
      localStorage.setItem('clash_players', JSON.stringify(newPlayers));
  };

  const createPlayer = (name: string, avatar: string) => {
      const newPlayer: Player = {
          id: Date.now(),
          name,
          avatar,
          maxUnlockedLevel: 1,
          stars: {},
          scores: {},
          mistakes: [],
          xp: 0,
          playerLevel: 1,
          achievements: []
      };
      const updatedPlayers = [...players, newPlayer];
      savePlayers(updatedPlayers);
      setCurrentPlayer(newPlayer);
      setAppState('MENU');
  };

  const processBattleResult = (
      pid: number, 
      level: number, 
      stars: number, 
      score: number, 
      timeMs: number | undefined,
      isWin: boolean,
      mode: BattleMode
  ) => {
      let xpGained = 0;
      let isLevelUp = false;

      if (isWin) {
          xpGained = 100 + (stars * 50);
          if (mode === 'MATCH') xpGained += 50; 
      } else {
          xpGained = 20; 
      }

      let newUnlockedAchievements: string[] = [];

      const updated = players.map(p => {
          if (p.id === pid) {
              const newStars = { ...p.stars };
              if (isWin && (!newStars[level] || stars > newStars[level])) {
                  newStars[level] = stars;
              }
              
              const newScores = { ...(p.scores || {}) };
              if (score > 0 && (!newScores[level] || score > newScores[level])) {
                  newScores[level] = score;
              }

              const nextLevel = level + 1;
              const maxLvl = Math.max(p.maxUnlockedLevel, (isWin && stars > 0) ? nextLevel : p.maxUnlockedLevel);
              
              let currentXp = (p.xp || 0) + xpGained;
              let currentLvl = p.playerLevel || 1;
              
              let required = getNextLevelXp(currentLvl);
              while (currentXp >= required) {
                  currentXp -= required;
                  currentLvl++;
                  isLevelUp = true;
                  required = getNextLevelXp(currentLvl);
              }

              const updatedPlayerBeforeAch = { 
                  ...p, 
                  stars: newStars, 
                  scores: newScores,
                  maxUnlockedLevel: Math.min(maxLvl, TOTAL_LEVELS),
                  xp: currentXp,
                  playerLevel: currentLvl
              };

              // Check for new achievements
              const currentAchievements = p.achievements || [];
              newUnlockedAchievements = ACHIEVEMENTS
                .filter(a => !currentAchievements.includes(a.id) && a.condition(updatedPlayerBeforeAch))
                .map(a => a.id);

              return {
                  ...updatedPlayerBeforeAch,
                  achievements: [...currentAchievements, ...newUnlockedAchievements]
              };
          }
          return p;
      });

      savePlayers(updated);
      
      const updatedPlayer = updated.find(p => p.id === pid) || null;
      if (currentPlayer && currentPlayer.id === pid) {
          setCurrentPlayer(updatedPlayer);
      }

      if (isWin) {
          saveScore(level, updatedPlayer!, timeMs || 0, score, mode);
      }

      setBattleResult({
          status: isWin ? 'WIN' : 'LOSE',
          stars,
          score,
          timeMs,
          xpGained,
          isLevelUp,
          newAchievements: newUnlockedAchievements
      });
      setAppState('RESULT');
  };

  const addMistake = (wordId: number) => {
      if (!currentPlayer) return;
      const currentMistakes = currentPlayer.mistakes || [];
      if (!currentMistakes.includes(wordId)) {
          const updatedPlayer = {
              ...currentPlayer,
              mistakes: [...currentMistakes, wordId]
          };
          const updatedPlayers = players.map(p => p.id === currentPlayer.id ? updatedPlayer : p);
          savePlayers(updatedPlayers);
          setCurrentPlayer(updatedPlayer);
      }
  };

  const removeMistake = (wordId: number) => {
       if (!currentPlayer) return;
       const updatedPlayer = {
           ...currentPlayer,
           mistakes: currentPlayer.mistakes.filter(id => id !== wordId)
       };
       const updatedPlayers = players.map(p => p.id === currentPlayer.id ? updatedPlayer : p);
       savePlayers(updatedPlayers);
       setCurrentPlayer(updatedPlayer);
  };

  const handleResetGame = () => {
      localStorage.removeItem('clash_players');
      localStorage.removeItem('clash_lb_quiz');
      localStorage.removeItem('clash_lb_match');
      localStorage.removeItem('clash_leaderboard_versus');
      setPlayers([]);
      setCurrentPlayer(null);
      setAppState('USER_SELECT');
  };

  const getTotalScore = (p: Player) => {
      if (!p.scores) return 0;
      return Object.values(p.scores).reduce((acc, curr) => acc + curr, 0);
  };

  if (appState === 'SPLASH') {
      return (
          <div 
            className="h-[100dvh] w-full bg-sky-500 flex flex-col items-center justify-center animate-fadeIn select-none overflow-hidden cursor-pointer relative" 
            onClick={() => setAppState('USER_SELECT')}
            style={{
                backgroundImage: 'radial-gradient(#00000033 20%, transparent 20%), radial-gradient(#00000033 20%, transparent 20%)',
                backgroundPosition: '0 0, 10px 10px',
                backgroundSize: '20px 20px'
            }}
          >
              <div className="absolute top-10 left-10 animate-[bounce_3s_infinite] rotate-12">
                   <PlayerAvatar avatar="noob" size="lg" className="border-4 border-black" />
              </div>
              <div className="absolute bottom-20 right-10 animate-[bounce_4s_infinite] -rotate-12">
                   <PlayerAvatar avatar="bacon" size="lg" className="border-4 border-black" />
              </div>

              <div className="transform -rotate-6 mb-12 relative z-10">
                  <div className="bg-white border-4 border-black p-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]">
                      <h1 className="text-6xl md:text-8xl font-black text-gray-900 uppercase tracking-widest leading-none" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                          KATA<br/>
                          <span className="text-red-600">BLOX</span>
                      </h1>
                  </div>
              </div>

              <div className="bg-black/80 px-4 py-2 rounded-sm mb-12 backdrop-blur-sm transform rotate-2">
                  <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-xl md:text-2xl font-mono">
                      Edisi Bahasa Melayu
                  </span>
              </div>

              <button 
                className="animate-pulse bg-[#00b06f] hover:bg-[#009e63] text-white font-black text-3xl md:text-5xl px-12 py-6 rounded-lg border-b-8 border-[#008253] active:border-b-0 active:translate-y-2 transition-all shadow-xl font-sans"
              >
                  TEKAN MULA ▶
              </button>
              
              <div className="absolute bottom-4 text-white/50 text-xs font-bold uppercase tracking-widest">
                  Inspired by Roblox • Educational Game
              </div>
          </div>
      );
  }

  if (appState === 'USER_SELECT') {
      return <UserSelect 
          players={players} 
          avatars={AVATARS} 
          onSelect={(p) => { setCurrentPlayer(p); setAppState('MENU'); }} 
          onCreate={createPlayer} 
          onReset={handleResetGame}
      />;
  }

  if (appState === 'MENU' && currentPlayer) {
      const totalScore = getTotalScore(currentPlayer);
      const mistakeCount = currentPlayer.mistakes?.length || 0;
      
      const currentLevel = currentPlayer.playerLevel || 1;
      const currentXp = currentPlayer.xp || 0;
      const requiredXp = getNextLevelXp(currentLevel);
      const xpPercent = Math.min(100, (currentXp / requiredXp) * 100);
      const rank = getPlayerRank(currentLevel);

      return (
          <div className="h-[100dvh] bg-sky-400 flex items-center justify-center p-4">
              <Card className="max-w-md w-full p-6 text-center bg-orange-50 flex flex-col gap-4 overflow-y-auto max-h-[95vh]">
                  
                  <div className="flex items-center gap-4 bg-white/50 p-3 rounded-lg border-2 border-black/10">
                      <div className="relative">
                           <PlayerAvatar avatar={currentPlayer.avatar} size="md" className="border-4 border-amber-500 shadow-xl" />
                           <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white font-black border-2 border-white rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10 text-sm">
                               {currentLevel}
                           </div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2">
                             <h1 className="text-2xl font-black text-amber-900 truncate">{currentPlayer.name}</h1>
                          </div>
                          <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase border-2 border-black/10 ${rank.bg} ${rank.color} mb-1`}>
                              {rank.name}
                          </div>
                          
                          <div className="w-full mt-1">
                              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                                  <span>XP</span>
                                  <span>{Math.floor(currentXp)} / {requiredXp}</span>
                              </div>
                              <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden border border-gray-400">
                                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black rounded-lg p-2 border-2 border-yellow-500 flex flex-col items-center">
                        <div className="text-yellow-400 font-bold text-[10px] uppercase tracking-wider">Skor Total</div>
                        <div className="flex items-center gap-1">
                             <Trophy size={16} className="text-yellow-400" />
                             <span className="font-black text-xl text-white font-mono">{totalScore.toLocaleString()}</span>
                        </div>
                    </div>
                    <button 
                      onClick={() => setAppState('ACHIEVEMENTS')}
                      className="bg-black rounded-lg p-2 border-2 border-purple-500 flex flex-col items-center hover:scale-105 transition-transform"
                    >
                        <div className="text-purple-400 font-bold text-[10px] uppercase tracking-wider">Pencapaian</div>
                        <div className="flex items-center gap-1">
                             <Award size={16} className="text-purple-400" />
                             <span className="font-black text-xl text-white font-mono">{currentPlayer.achievements?.length || 0}</span>
                        </div>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                      <Button onClick={() => setAppState('WORLD_SELECT')} className="w-full text-xl py-3 shadow-xl">
                          <Sword size={24} /> Pemain Tunggal
                      </Button>
                      
                      <div className="relative">
                          <Button 
                            onClick={() => setAppState('MISTAKE_REVIEW')} 
                            variant="success" 
                            className="w-full text-xl py-3 shadow-xl"
                            disabled={mistakeCount === 0}
                          >
                             <Shield size={24} /> Bank Soalan Salah
                          </Button>
                          {mistakeCount > 0 && (
                             <div className="absolute -top-2 -right-2 bg-red-600 text-white font-black rounded-full w-8 h-8 flex items-center justify-center border-2 border-white animate-bounce">
                                 {mistakeCount}
                             </div>
                          )}
                      </div>

                      <Button onClick={() => setAppState('VERSUS_SETUP')} variant="danger" className="w-full text-xl py-3 shadow-xl">
                          <Users size={24} /> Dua Pemain (Versus)
                      </Button>
                      
                      <Button onClick={() => { setCurrentLevel(1); setLbTab('SINGLE'); setLbSubTab('QUIZ'); setAppState('LEADERBOARD_VIEW'); }} variant="info" className="w-full text-xl py-3 shadow-xl">
                          <Trophy size={24} /> Papan Pendahulu
                      </Button>

                      <Button onClick={() => { setCurrentPlayer(null); setAppState('USER_SELECT'); }} variant="secondary" className="w-full">
                          Tukar Pemain
                      </Button>
                  </div>
              </Card>
          </div>
      );
  }

  if (appState === 'ACHIEVEMENTS' && currentPlayer) {
      return (
          <AchievementView 
            player={currentPlayer} 
            onBack={() => setAppState('MENU')} 
          />
      );
  }

  if (appState === 'MISTAKE_REVIEW' && currentPlayer) {
      return (
          <MistakeReview 
            player={currentPlayer}
            onRemoveMistake={removeMistake}
            onExit={() => setAppState('MENU')}
          />
      );
  }

  if (appState === 'VERSUS_SETUP' && currentPlayer) {
      return <VersusSetup 
          currentPlayer={currentPlayer} 
          avatars={AVATARS}
          onBack={() => setAppState('MENU')}
          onStart={(config) => {
              setVersusConfig(config);
              setAppState('VERSUS_GAME');
          }}
      />;
  }

  if (appState === 'VERSUS_GAME' && versusConfig) {
      return <VersusGame 
          config={versusConfig} 
          onExit={() => setAppState('MENU')}
          onGameOver={(winner) => saveVersusWin(winner)}
      />;
  }

  if (appState === 'WORLD_SELECT' && currentPlayer) {
      return (
          <div className="h-[100dvh] bg-sky-800 flex flex-col">
              <div className="bg-sky-900 p-4 text-white flex items-center justify-between shadow-lg z-10">
                  <Button variant="secondary" onClick={() => setAppState('MENU')} className="px-3"><Home size={20}/></Button>
                  <h2 className="text-xl font-bold uppercase truncate">Pilih Dunia</h2>
                  <div className="bg-black/30 px-3 py-1 rounded flex items-center gap-2">
                      <Star className="text-yellow-400" size={16}/>
                      <span>{currentPlayer.maxUnlockedLevel-1}/{TOTAL_LEVELS}</span>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {WORLDS.map(w => {
                      const startLvl = (w.id - 1) * 10 + 1;
                      const isUnlocked = currentPlayer.maxUnlockedLevel >= startLvl;
                      const worldScore = Array.from({length: 10}, (_, i) => startLvl + i)
                          .reduce((sum, lvl) => sum + (currentPlayer.scores[lvl] || 0), 0);

                      return (
                          <button 
                              key={w.id} 
                              onClick={() => { if(isUnlocked) { setSelectedWorld(w.id); setAppState('LEVEL_SELECT'); } }}
                              disabled={!isUnlocked}
                              className={`w-full relative rounded-xl overflow-hidden shadow-lg border-b-4 text-left transition-transform active:scale-95 ${isUnlocked ? 'border-black/20' : 'bg-gray-600 border-gray-800 grayscale opacity-80'}`}
                          >
                              <div className={`p-6 ${w.theme} text-white flex items-center gap-4`}>
                                  <PlayerAvatar avatar={w.img} size="md" className="shrink-0 border-white" />
                                  <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2 mb-1">
                                          <div className="text-2xl font-black uppercase leading-tight">{w.name}</div>
                                          {worldScore > 0 && (
                                              <div className="bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-sm text-yellow-300 font-mono font-bold text-sm flex items-center gap-1 border border-white/20">
                                                  <Trophy size={14}/> {worldScore.toLocaleString()}
                                              </div>
                                          )}
                                      </div>
                                      <div className={`text-sm font-bold ${w.textColor}`}>{w.desc}</div>
                                      <div className="mt-2 text-xs bg-black/20 inline-block px-2 py-1 rounded">
                                          Tahap {startLvl}-{startLvl+9}
                                      </div>
                                  </div>
                                  {!isUnlocked && <Lock className="ml-auto text-gray-400 shrink-0" size={32} />}
                              </div>
                          </button>
                      );
                  })}
              </div>
          </div>
      );
  }

  if (appState === 'LEVEL_SELECT' && currentPlayer) {
      const world = WORLDS.find(w => w.id === selectedWorld);
      if (!world) return <div>World not found</div>;
      const startLvl = (selectedWorld - 1) * 10 + 1;
      const levels = Array.from({length: 10}, (_, i) => startLvl + i);

      return (
          <div className={`h-[100dvh] ${world.theme} flex flex-col`}>
              <div className="bg-black/30 p-4 text-white flex items-center justify-between backdrop-blur-md shadow-lg z-10 shrink-0">
                  <Button variant="secondary" onClick={() => setAppState('WORLD_SELECT')} className="px-3 py-1 h-10 mb-0"><ArrowLeft/></Button>
                  <h2 className="text-xl font-bold uppercase truncate px-2 text-shadow-md">{world.name}</h2>
                  <PlayerAvatar avatar={world.img} size="sm" className="border-white" />
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {levels.map(lvl => {
                          const isUnlocked = lvl <= currentPlayer.maxUnlockedLevel;
                          const stars = currentPlayer.stars[lvl] || 0;
                          const quizLb = getLeaderboard(lvl, 'QUIZ');
                          const bestQuiz = quizLb.length > 0 ? quizLb[0] : null;
                          const matchLb = getLeaderboard(lvl, 'MATCH');
                          const bestMatch = matchLb.length > 0 ? matchLb[0] : null;

                          return (
                              <div key={lvl} className={`relative rounded-sm border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transition-transform overflow-hidden flex flex-col ${isUnlocked ? 'bg-white border-black' : 'bg-gray-300 border-gray-600 text-gray-500'}`}>
                                  <div className={`p-2 flex justify-between items-center border-b-4 ${isUnlocked ? 'bg-amber-400 border-black' : 'bg-gray-500 border-gray-600'}`}>
                                      <span className={`text-2xl font-black font-mono tracking-widest ${isUnlocked ? 'text-black' : 'text-gray-300'}`}>LEVEL {lvl}</span>
                                      <div className="flex gap-1">
                                          {[1,2,3].map(s => (
                                              <Star key={s} size={20} className={s <= stars ? "text-white fill-white stroke-black stroke-2" : "text-black/20 fill-black/20"} />
                                          ))}
                                      </div>
                                  </div>

                                  <div className="p-3 grid grid-cols-2 gap-3 bg-opacity-50">
                                      <button 
                                          onClick={() => { if(isUnlocked) { setCurrentLevel(lvl); setBattleMode('QUIZ'); setAppState('STUDY_PHASE'); }}}
                                          disabled={!isUnlocked}
                                          className={`group flex flex-col items-center justify-between p-2 rounded-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all h-32 ${isUnlocked ? 'bg-orange-100 hover:bg-orange-200 border-orange-400' : 'bg-gray-200 border-gray-400'}`}
                                      >
                                          <div className="text-orange-600 font-bold text-xs uppercase flex items-center gap-1 mb-1"><Sword size={14}/> Kuiz</div>
                                          {bestQuiz ? (
                                              <div className="flex flex-col items-center w-full">
                                                  <div className="text-3xl font-black text-orange-900 font-mono leading-none tracking-tighter scale-110">
                                                    {bestQuiz.score >= 10000 ? (bestQuiz.score/1000).toFixed(1) + 'k' : bestQuiz.score.toLocaleString()}
                                                  </div>
                                                  <div className="text-[10px] font-bold text-orange-700 uppercase mt-1 bg-orange-200/50 px-2 rounded-full max-w-full truncate">{bestQuiz.playerName}</div>
                                              </div>
                                          ) : (
                                              <div className="text-gray-400 text-xs font-bold">- Tiada -</div>
                                          )}
                                          <div className={`mt-auto text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${isUnlocked ? 'bg-orange-500' : 'bg-gray-400'}`}>Mula</div>
                                      </button>

                                      <button 
                                          onClick={() => { if(isUnlocked) { setCurrentLevel(lvl); setBattleMode('MATCH'); setAppState('STUDY_PHASE'); }}}
                                          disabled={!isUnlocked}
                                          className={`group flex flex-col items-center justify-between p-2 rounded-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all h-32 ${isUnlocked ? 'bg-sky-100 hover:bg-sky-200 border-sky-400' : 'bg-gray-200 border-gray-400'}`}
                                      >
                                          <div className="text-sky-600 font-bold text-xs uppercase flex items-center gap-1 mb-1"><Puzzle size={14}/> Padanan</div>
                                          {bestMatch ? (
                                              <div className="flex flex-col items-center w-full">
                                                  <div className="text-3xl font-black text-sky-900 font-mono leading-none tracking-tighter scale-110">
                                                    {formatTime(bestMatch.timeMs).replace('s','')}
                                                    <span className="text-sm ml-0.5">s</span>
                                                  </div>
                                                  <div className="text-[10px] font-bold text-sky-700 uppercase mt-1 bg-sky-200/50 px-2 rounded-full max-w-full truncate">{bestMatch.playerName}</div>
                                              </div>
                                          ) : (
                                              <div className="text-gray-400 text-xs font-bold">- Tiada -</div>
                                          )}
                                          <div className={`mt-auto text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${isUnlocked ? 'bg-sky-500' : 'bg-gray-400'}`}>Mula</div>
                                      </button>
                                  </div>
                                  {!isUnlocked && (
                                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px] z-20">
                                          <Lock className="text-white w-16 h-16 opacity-80"/>
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  if (appState === 'STUDY_PHASE' && currentLevel) {
      return (
          <LevelStudy 
              level={currentLevel}
              mode={battleMode}
              onBack={() => setAppState('LEVEL_SELECT')}
              onStart={() => setAppState('BATTLE')}
          />
      );
  }

  if (appState === 'LEADERBOARD_VIEW' && currentLevel && currentPlayer) {
      const lbSingle = getLeaderboard(currentLevel, lbSubTab);
      const lbVersus = getVersusLeaderboard();
      
      return (
          <div className="h-[100dvh] bg-black/90 flex items-center justify-center p-4 fixed inset-0 z-50">
               <Card className="max-w-md w-full p-4 text-center bg-white flex flex-col max-h-[95vh]">
                    <div className="flex items-center justify-between border-b-4 border-black pb-2 mb-2">
                        <button onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))} disabled={currentLevel <= 1 || lbTab === 'VERSUS'} className={`p-2 ${lbTab === 'VERSUS' ? 'opacity-0' : 'disabled:opacity-30'}`}><ArrowLeft size={24} /></button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2"><Trophy className="text-yellow-500" />Carta</h2>
                            <p className="font-bold text-gray-500 text-sm">{lbTab === 'SINGLE' ? `Tahap ${currentLevel}` : 'Dua Pemain'}</p>
                        </div>
                        <button onClick={() => setCurrentLevel(Math.min(TOTAL_LEVELS, currentLevel + 1))} disabled={currentLevel >= TOTAL_LEVELS || lbTab === 'VERSUS'} className={`p-2 ${lbTab === 'VERSUS' ? 'opacity-0' : 'disabled:opacity-30'}`}><ArrowRight size={24} /></button>
                    </div>

                    <div className="flex gap-2 mb-2">
                        <button onClick={() => setLbTab('SINGLE')} className={`flex-1 py-2 font-bold border-b-4 text-sm uppercase transition-all ${lbTab === 'SINGLE' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Pemain Tunggal</button>
                        <button onClick={() => setLbTab('VERSUS')} className={`flex-1 py-2 font-bold border-b-4 text-sm uppercase transition-all ${lbTab === 'VERSUS' ? 'border-red-500 text-red-600 bg-red-50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Versus</button>
                    </div>

                    {lbTab === 'SINGLE' && (
                        <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                             <button onClick={() => setLbSubTab('QUIZ')} className={`flex-1 py-1 rounded-md text-sm font-bold transition-all ${lbSubTab === 'QUIZ' ? 'bg-white shadow text-black' : 'text-gray-400'}`}>
                                 <div className="flex items-center justify-center gap-2"><Sword size={14}/> Kuiz</div>
                             </button>
                             <button onClick={() => setLbSubTab('MATCH')} className={`flex-1 py-1 rounded-md text-sm font-bold transition-all ${lbSubTab === 'MATCH' ? 'bg-white shadow text-black' : 'text-gray-400'}`}>
                                 <div className="flex items-center justify-center gap-2"><Puzzle size={14}/> Padanan</div>
                             </button>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto bg-gray-50 border-2 border-black rounded-sm p-2 mb-4">
                        {lbTab === 'SINGLE' ? (
                            lbSingle.length > 0 ? (
                                <table className="w-full text-left text-sm md:text-base">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300 text-gray-500">
                                            <th className="p-2">#</th>
                                            <th className="p-2">Nama</th>
                                            <th className="p-2 text-right">{lbSubTab === 'QUIZ' ? 'Skor' : 'Masa'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lbSingle.map((entry, i) => (
                                            <tr key={i} className={`border-b border-gray-200 ${entry.playerName === currentPlayer.name ? 'bg-yellow-100 font-bold' : ''}`}>
                                                <td className="p-2 font-bold">{i+1}</td>
                                                <td className="p-2"><span className="truncate w-full block">{entry.playerName}</span></td>
                                                <td className="p-2 text-right font-mono font-bold">{lbSubTab === 'QUIZ' ? (entry.score ? entry.score.toLocaleString() : '-') : (entry.timeMs ? formatTime(entry.timeMs) : '-')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-8 text-gray-400 font-bold italic flex flex-col items-center">
                                    <div>Tiada rekod {lbSubTab === 'QUIZ' ? 'Kuiz' : 'Padanan'}.</div>
                                    <div className="text-xs font-normal">Jadilah yang pertama!</div>
                                </div>
                            )
                        ) : (
                            lbVersus.length > 0 ? (
                                <table className="w-full text-left text-sm md:text-base">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300">
                                            <th className="p-2">#</th>
                                            <th className="p-2">Nama</th>
                                            <th className="p-2 text-right">Menang</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lbVersus.map((entry, i) => (
                                            <tr key={i} className={`border-b border-gray-200 ${entry.playerName === currentPlayer.name ? 'bg-yellow-100 font-bold' : ''}`}>
                                                <td className="p-2 font-bold">{i+1}</td>
                                                <td className="p-2"><span className="truncate w-full block">{entry.playerName}</span></td>
                                                <td className="p-2 text-right font-mono font-bold text-red-600">{entry.wins}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-8 text-gray-400 font-bold italic">Belum ada rekod Versus.</div>
                            )
                        )}
                    </div>

                    <Button onClick={() => appState === 'MENU' ? setAppState('MENU') : setAppState('LEVEL_SELECT')} variant="secondary" className="w-full">Tutup</Button>
               </Card>
          </div>
      );
  }

  if (appState === 'BATTLE' && currentLevel && currentPlayer) {
      const highScore = currentPlayer.scores?.[currentLevel] || 0;
      if (battleMode === 'QUIZ') {
          return <SinglePlayerBattle 
              level={currentLevel} 
              currentPlayer={currentPlayer}
              highScore={highScore}
              onWin={(mistakes, score) => {
                  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
                  processBattleResult(currentPlayer.id, currentLevel, stars, score, 0, true, 'QUIZ');
              }}
              onLose={() => {
                  processBattleResult(currentPlayer.id, currentLevel, 0, 0, 0, false, 'QUIZ');
              }}
              onExit={() => setAppState('LEVEL_SELECT')}
              onAddMistake={addMistake}
          />;
      } else {
          const matchLb = getLeaderboard(currentLevel, 'MATCH');
          const userMatchEntry = matchLb.find((e: any) => e.playerName === currentPlayer.name);
          const bestTimeMs = userMatchEntry ? userMatchEntry.timeMs : 0;

          return <SinglePlayerMatch 
              level={currentLevel}
              currentPlayer={currentPlayer}
              bestTimeMs={bestTimeMs}
              onWin={(mistakes, timeMs) => {
                  const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
                  processBattleResult(currentPlayer.id, currentLevel, stars, 0, timeMs, true, 'MATCH');
              }}
              onLose={() => {
                  processBattleResult(currentPlayer.id, currentLevel, 0, 0, 0, false, 'MATCH');
              }}
              onExit={() => setAppState('LEVEL_SELECT')}
              onAddMistake={addMistake}
          />
      }
  }

  if (appState === 'RESULT' && battleResult) {
      const isWin = battleResult.status === 'WIN';
      const leaderboard = (isWin && currentLevel) ? getLeaderboard(currentLevel, battleMode) : [];

      return (
          <div className="h-[100dvh] bg-black/90 flex items-center justify-center p-4">
              <Card className={`max-w-md w-full p-6 text-center ${isWin ? 'bg-yellow-50' : 'bg-gray-200'} flex flex-col max-h-[95vh] overflow-y-auto`}>
                  <div className="text-6xl mb-2 animate-bounce">{isWin ? '🏆' : '💀'}</div>
                  <h2 className="text-4xl font-black mb-1 uppercase roblox-text-shadow text-white">{isWin ? 'MENANG!' : 'KALAH'}</h2>
                  
                  {isWin ? (
                      <>
                        <div className="flex justify-center gap-2 mb-2">
                            {[1,2,3].map(s => (
                                <Star key={s} size={32} className={s <= battleResult.stars ? "text-yellow-500 fill-yellow-500" : "text-gray-400 fill-gray-400"} />
                            ))}
                        </div>
                        {battleResult.score !== undefined && battleResult.score > 0 && (
                             <div className="mb-2">
                                <div className="text-sm font-bold text-gray-500">TOTAL SCORE</div>
                                <div className="text-4xl font-black font-mono text-yellow-600 tracking-widest">{battleResult.score.toLocaleString()}</div>
                             </div>
                        )}
                        {battleResult.timeMs !== undefined && battleResult.timeMs > 0 && (
                            <div className="text-sm font-bold bg-black text-white px-2 py-1 rounded-sm inline-block mx-auto mb-4 border-2 border-gray-600">
                                MASA: {formatTime(battleResult.timeMs)}
                            </div>
                        )}
                      </>
                  ) : (
                       <div className="mb-4 text-gray-500 font-bold">Jangan putus asa! Cuba lagi.</div>
                  )}

                  <div className="bg-blue-100 border-2 border-blue-400 p-2 rounded-lg mb-4 flex flex-col items-center relative overflow-visible">
                      <div className="text-xs font-black text-blue-800 uppercase">Ganjaran (Rewards)</div>
                      <div className="text-2xl font-black text-blue-600">+{battleResult.xpGained} XP</div>
                      {battleResult.isLevelUp && (
                          <div className="absolute -top-6 -right-6 bg-yellow-400 border-4 border-white text-black font-black p-2 rounded-full animate-bounce shadow-xl rotate-12 z-10 text-xs md:text-sm whitespace-nowrap">LEVEL UP!</div>
                      )}
                  </div>

                  {battleResult.newAchievements && battleResult.newAchievements.length > 0 && (
                      <div className="mb-4 space-y-2">
                          {battleResult.newAchievements.map(id => {
                              const ach = ACHIEVEMENTS.find(a => a.id === id);
                              return ach ? (
                                  <div key={id} className="bg-purple-600 text-white p-2 rounded border-2 border-black flex items-center gap-3 animate-bounce">
                                      <span className="text-2xl">{ach.icon}</span>
                                      <div className="text-left">
                                          <div className="text-[10px] font-black uppercase">Pencapaian Baru!</div>
                                          <div className="text-sm font-black">{ach.name}</div>
                                      </div>
                                  </div>
                              ) : null;
                          })}
                      </div>
                  )}

                  {isWin && leaderboard.length > 0 && (
                      <div className="flex-1 overflow-y-auto bg-white border-2 border-black rounded-sm p-2 mb-4">
                          <h3 className="text-lg font-black uppercase border-b-2 border-black mb-2 flex items-center justify-center gap-2"><Trophy size={16}/> Carta {battleMode === 'QUIZ' ? 'Kuiz' : 'Padanan'}</h3>
                          <table className="w-full text-left text-sm">
                              <thead>
                                  <tr className="bg-gray-100"><th className="p-1">#</th><th className="p-1">Nama</th><th className="p-1 text-right">{battleMode === 'QUIZ' ? 'Skor' : 'Masa'}</th></tr>
                              </thead>
                              <tbody>
                                  {leaderboard.map((entry, i) => (
                                      <tr key={i} className={`border-b ${entry.playerName === currentPlayer?.name && (battleMode === 'QUIZ' ? entry.score === battleResult.score : entry.timeMs === battleResult.timeMs) ? 'bg-yellow-100 font-bold' : ''}`}>
                                          <td className="p-1 font-bold">{i+1}</td>
                                          <td className="p-1"><span className="truncate w-full block">{entry.playerName}</span></td>
                                          <td className="p-1 text-right font-mono">{battleMode === 'QUIZ' ? (entry.score ? entry.score.toLocaleString() : '-') : (entry.timeMs ? formatTime(entry.timeMs) : '-')}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}

                  <div className="space-y-2 mt-auto">
                      {isWin && <Button onClick={() => setAppState('LEVEL_SELECT')} variant="success" className="w-full text-lg py-2">Teruskan <ArrowRight/></Button>}
                      {!isWin && <Button onClick={() => setAppState('BATTLE')} variant="primary" className="w-full text-lg py-2">Cuba Lagi <RefreshCcw/></Button>}
                      <Button onClick={() => setAppState('LEVEL_SELECT')} variant="secondary" className="w-full py-2">Kembali ke Peta</Button>
                  </div>
              </Card>
          </div>
      );
  }

  return <div>Ralat tidak dijangka.</div>;
}

export default App;
