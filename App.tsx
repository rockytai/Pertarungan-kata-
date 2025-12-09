
import React, { useState, useEffect } from 'react';
import UserSelect from './features/UserSelect';
import VersusSetup from './features/VersusSetup';
import VersusGame from './features/VersusGame';
import SinglePlayerBattle from './features/SinglePlayerBattle';
import SinglePlayerMatch from './features/SinglePlayerMatch';
import Card from './components/Card';
import Button from './components/Button';
import PlayerAvatar from './components/PlayerAvatar';
import { Sword, Users, Home, ArrowLeft, Star, ArrowRight, RefreshCcw, Lock, Puzzle, Trophy } from './components/Icons';
import { Player, AppState, VersusConfig, BattleResult, BattleMode } from './types';
import { AVATARS, WORLDS, TOTAL_LEVELS } from './constants';
import { saveScore, getLeaderboard, formatTime, saveVersusWin, getVersusLeaderboard } from './utils/leaderboard';

function App() {
  const [appState, setAppState] = useState<AppState>('SPLASH'); 
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  const [selectedWorld, setSelectedWorld] = useState(1);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [battleMode, setBattleMode] = useState<BattleMode>('QUIZ');
  const [lbTab, setLbTab] = useState<'SINGLE'|'VERSUS'>('SINGLE');
  
  const [versusConfig, setVersusConfig] = useState<VersusConfig | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  useEffect(() => {
      const savedPlayers = JSON.parse(localStorage.getItem('clash_players') || '[]');
      if (savedPlayers.length > 0) setPlayers(savedPlayers);
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
          stars: {}
      };
      const updatedPlayers = [...players, newPlayer];
      savePlayers(updatedPlayers);
      setCurrentPlayer(newPlayer);
      setAppState('MENU');
  };

  const updatePlayerProgress = (pid: number, level: number, stars: number) => {
      const updated = players.map(p => {
          if (p.id === pid) {
              const newStars = { ...p.stars };
              if (!newStars[level] || stars > newStars[level]) {
                  newStars[level] = stars;
              }
              const nextLevel = level + 1;
              const maxLvl = Math.max(p.maxUnlockedLevel, stars > 0 ? nextLevel : p.maxUnlockedLevel);
              return { ...p, stars: newStars, maxUnlockedLevel: Math.min(maxLvl, TOTAL_LEVELS) };
          }
          return p;
      });
      savePlayers(updated);
      if (currentPlayer && currentPlayer.id === pid) {
          setCurrentPlayer(updated.find(p => p.id === pid) || null);
      }
  };

  const handleResetGame = () => {
      localStorage.removeItem('clash_players');
      localStorage.removeItem('clash_leaderboard');
      localStorage.removeItem('clash_leaderboard_versus');
      setPlayers([]);
      setCurrentPlayer(null);
      if (appState !== 'USER_SELECT') setAppState('USER_SELECT');
  };

  if (appState === 'SPLASH') {
      return (
          <div className="h-[100dvh] w-full bg-amber-500 flex flex-col items-center justify-center animate-fadeIn select-none overflow-hidden cursor-pointer" onClick={() => setAppState('USER_SELECT')}>
              <div className="text-8xl mb-6 animate-bounce drop-shadow-2xl">⚔️</div>
              <h1 className="text-4xl font-black text-white uppercase tracking-widest drop-shadow-md mb-2 text-center">Pertarungan Kata</h1>
              <div className="text-amber-800 font-bold uppercase tracking-wide text-sm mb-8">Edisi Bahasa Melayu</div>
              <div className="animate-pulse text-white font-bold">Tekan untuk Mula</div>
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
      return (
          <div className="h-[100dvh] bg-sky-400 flex items-center justify-center p-4">
              <Card className="max-w-md w-full p-8 text-center bg-orange-50">
                  <div className="mb-4 flex justify-center">
                      <PlayerAvatar avatar={currentPlayer.avatar} size="lg" className="border-4 border-amber-500" />
                  </div>
                  <h1 className="text-3xl font-black text-amber-900 mb-2">Hai, {currentPlayer.name}!</h1>
                  <p className="text-amber-700 mb-8 font-bold">Sedia untuk berjuang?</p>
                  
                  <div className="space-y-4">
                      <Button onClick={() => setAppState('WORLD_SELECT')} className="w-full text-xl py-4 shadow-xl">
                          <Sword size={24} /> Pemain Tunggal
                      </Button>
                      <Button onClick={() => setAppState('VERSUS_SETUP')} variant="danger" className="w-full text-xl py-4 shadow-xl">
                          <Users size={24} /> Dua Pemain (Versus)
                      </Button>
                      
                      <Button onClick={() => { setCurrentLevel(1); setLbTab('SINGLE'); setAppState('LEADERBOARD_VIEW'); }} variant="info" className="w-full text-xl py-4 shadow-xl">
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
                      return (
                          <button 
                              key={w.id} 
                              onClick={() => { if(isUnlocked) { setSelectedWorld(w.id); setAppState('LEVEL_SELECT'); } }}
                              disabled={!isUnlocked}
                              className={`w-full relative rounded-xl overflow-hidden shadow-lg border-b-4 text-left transition-transform active:scale-95 ${isUnlocked ? 'border-black/20' : 'bg-gray-600 border-gray-800 grayscale opacity-80'}`}
                          >
                              <div className={`p-6 ${w.theme} text-white flex items-center gap-4`}>
                                  <PlayerAvatar avatar={w.img} size="md" className="shrink-0 border-white" />
                                  <div className="min-w-0">
                                      <div className="text-2xl font-black uppercase leading-tight">{w.name}</div>
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
              <div className="bg-black/30 p-4 text-white flex items-center justify-between backdrop-blur-md">
                  <Button variant="secondary" onClick={() => setAppState('WORLD_SELECT')} className="px-3"><ArrowLeft/></Button>
                  <h2 className="text-xl font-bold uppercase truncate px-2">{world.name}</h2>
                  <PlayerAvatar avatar={world.img} size="sm" className="border-white" />
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {levels.map(lvl => {
                          const isUnlocked = lvl <= currentPlayer.maxUnlockedLevel;
                          const stars = currentPlayer.stars[lvl] || 0;
                          return (
                              <button 
                                  key={lvl}
                                  onClick={() => { if(isUnlocked) { setCurrentLevel(lvl); setAppState('MODE_SELECT'); } }}
                                  disabled={!isUnlocked}
                                  className={`aspect-square rounded-xl border-b-8 flex flex-col items-center justify-center relative shadow-lg active:scale-95 transition-transform ${isUnlocked ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-gray-400 border-gray-600 text-gray-200'}`}
                              >
                                  <span className="text-3xl font-black mb-1">{lvl}</span>
                                  <div className="flex gap-0.5">
                                      {[1,2,3].map(s => (
                                          <Star key={s} size={12} className={s <= stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"} />
                                      ))}
                                  </div>
                                  {!isUnlocked && <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center"><Lock className="text-white/80"/></div>}
                              </button>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  if (appState === 'MODE_SELECT' && currentLevel) {
      return (
          <div className="h-[100dvh] bg-sky-500/90 flex items-center justify-center p-4 fixed inset-0 z-50">
              <Card className="max-w-sm w-full p-6 text-center bg-white animate-fadeIn">
                  <h2 className="text-2xl font-black uppercase mb-2">Pilih Cara Main</h2>
                  <p className="text-gray-600 font-bold mb-6">Level {currentLevel}</p>
                  
                  <div className="space-y-4">
                      <Button onClick={() => { setBattleMode('QUIZ'); setAppState('BATTLE'); }} className="w-full py-4 text-xl">
                          <Sword size={24}/> Kuiz (Quiz)
                      </Button>
                      <Button onClick={() => { setBattleMode('MATCH'); setAppState('BATTLE'); }} variant="info" className="w-full py-4 text-xl">
                          <Puzzle size={24}/> Padanan (Match)
                      </Button>
                      
                      <button 
                        onClick={() => { setLbTab('SINGLE'); setAppState('LEADERBOARD_VIEW'); }}
                        className="w-full py-2 flex items-center justify-center gap-2 text-yellow-600 font-bold hover:text-yellow-700"
                      >
                          <Trophy size={18}/> Lihat Carta (Leaderboard)
                      </button>

                      <Button onClick={() => setAppState('LEVEL_SELECT')} variant="secondary" className="w-full">
                          Batal
                      </Button>
                  </div>
              </Card>
          </div>
      );
  }

  if (appState === 'LEADERBOARD_VIEW' && currentLevel && currentPlayer) {
      const lbSingle = getLeaderboard(currentLevel);
      const lbVersus = getVersusLeaderboard();
      
      return (
          <div className="h-[100dvh] bg-black/90 flex items-center justify-center p-4 fixed inset-0 z-50">
               <Card className="max-w-md w-full p-6 text-center bg-white flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b-4 border-black pb-2 mb-2">
                        <button 
                            onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
                            disabled={currentLevel <= 1 || lbTab === 'VERSUS'}
                            className={`p-2 ${lbTab === 'VERSUS' ? 'opacity-0' : 'disabled:opacity-30'}`}
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                <Trophy className="text-yellow-500" />
                                Carta
                            </h2>
                            <p className="font-bold text-gray-500 text-sm">{lbTab === 'SINGLE' ? `Tahap ${currentLevel}` : 'Dua Pemain'}</p>
                        </div>
                        <button 
                            onClick={() => setCurrentLevel(Math.min(TOTAL_LEVELS, currentLevel + 1))}
                            disabled={currentLevel >= TOTAL_LEVELS || lbTab === 'VERSUS'}
                            className={`p-2 ${lbTab === 'VERSUS' ? 'opacity-0' : 'disabled:opacity-30'}`}
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button 
                            onClick={() => setLbTab('SINGLE')} 
                            className={`flex-1 py-2 font-bold border-2 rounded-sm text-sm ${lbTab === 'SINGLE' ? 'bg-blue-500 text-white border-black' : 'bg-gray-100 border-gray-300'}`}
                        >
                            Pemain Tunggal
                        </button>
                        <button 
                            onClick={() => setLbTab('VERSUS')} 
                            className={`flex-1 py-2 font-bold border-2 rounded-sm text-sm ${lbTab === 'VERSUS' ? 'bg-red-500 text-white border-black' : 'bg-gray-100 border-gray-300'}`}
                        >
                            Versus
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-100 border-2 border-black rounded-sm p-2 mb-4">
                        {lbTab === 'SINGLE' ? (
                            lbSingle.length > 0 ? (
                                <table className="w-full text-left text-sm md:text-base">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300">
                                            <th className="p-2">#</th>
                                            <th className="p-2">Nama</th>
                                            <th className="p-2 text-right">Masa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lbSingle.map((entry, i) => (
                                            <tr key={i} className={`border-b border-gray-200 ${entry.playerName === currentPlayer.name ? 'bg-yellow-200 font-bold' : ''}`}>
                                                <td className="p-2 font-bold">{i+1}</td>
                                                <td className="p-2">
                                                    <span className="truncate w-full block">{entry.playerName}</span>
                                                </td>
                                                <td className="p-2 text-right font-mono font-bold">{formatTime(entry.timeMs)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-8 text-gray-400 font-bold italic">
                                    Belum ada rekod.
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
                                            <tr key={i} className={`border-b border-gray-200 ${entry.playerName === currentPlayer.name ? 'bg-yellow-200 font-bold' : ''}`}>
                                                <td className="p-2 font-bold">{i+1}</td>
                                                <td className="p-2">
                                                    <span className="truncate w-full block">{entry.playerName}</span>
                                                </td>
                                                <td className="p-2 text-right font-mono font-bold text-red-600">{entry.wins}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-8 text-gray-400 font-bold italic">
                                    Belum ada rekod Versus.
                                </div>
                            )
                        )}
                    </div>

                    <Button onClick={() => appState === 'MENU' ? setAppState('MENU') : setAppState('MODE_SELECT')} variant="secondary" className="w-full">
                        Tutup
                    </Button>
               </Card>
          </div>
      );
  }

  if (appState === 'BATTLE' && currentLevel && currentPlayer) {
      if (battleMode === 'QUIZ') {
          return <SinglePlayerBattle 
              level={currentLevel} 
              currentPlayer={currentPlayer}
              onWin={(mistakes) => {
                  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
                  updatePlayerProgress(currentPlayer.id, currentLevel, stars);
                  setBattleResult({ status: 'WIN', stars });
                  setAppState('RESULT');
              }}
              onLose={() => {
                  setBattleResult({ status: 'LOSE', stars: 0 });
                  setAppState('RESULT');
              }}
              onExit={() => setAppState('LEVEL_SELECT')}
          />;
      } else {
          return <SinglePlayerMatch 
              level={currentLevel}
              currentPlayer={currentPlayer}
              onWin={(mistakes, timeMs) => {
                  const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
                  updatePlayerProgress(currentPlayer.id, currentLevel, stars);
                  saveScore(currentLevel, currentPlayer, timeMs);
                  setBattleResult({ status: 'WIN', stars, timeMs });
                  setAppState('RESULT');
              }}
              onLose={() => {
                  setBattleResult({ status: 'LOSE', stars: 0 });
                  setAppState('RESULT');
              }}
              onExit={() => setAppState('LEVEL_SELECT')}
          />
      }
  }

  if (appState === 'RESULT' && battleResult) {
      const isWin = battleResult.status === 'WIN';
      const leaderboard = (isWin && battleResult.timeMs && currentLevel) ? getLeaderboard(currentLevel) : [];

      return (
          <div className="h-[100dvh] bg-black/90 flex items-center justify-center p-4">
              <Card className={`max-w-md w-full p-6 text-center ${isWin ? 'bg-yellow-50' : 'bg-gray-200'} flex flex-col max-h-[90vh]`}>
                  <div className="text-6xl mb-2 animate-bounce">{isWin ? '🏆' : '💀'}</div>
                  <h2 className="text-4xl font-black mb-1 uppercase roblox-text-shadow text-white">{isWin ? 'MENANG!' : 'KALAH'}</h2>
                  
                  {isWin && (
                      <>
                        <div className="flex justify-center gap-2 mb-2">
                            {[1,2,3].map(s => (
                                <Star key={s} size={32} className={s <= battleResult.stars ? "text-yellow-500 fill-yellow-500" : "text-gray-400 fill-gray-400"} />
                            ))}
                        </div>
                        {battleResult.timeMs && (
                            <div className="text-xl font-bold bg-black text-yellow-300 px-4 py-1 rounded-sm inline-block mx-auto mb-4 border-2 border-white">
                                MASA: {formatTime(battleResult.timeMs)}
                            </div>
                        )}
                      </>
                  )}

                  {isWin && leaderboard.length > 0 && (
                      <div className="flex-1 overflow-y-auto bg-white border-2 border-black rounded-sm p-2 mb-4">
                          <h3 className="text-lg font-black uppercase border-b-2 border-black mb-2 flex items-center justify-center gap-2"><Trophy size={16}/> Papan Pendahulu</h3>
                          <table className="w-full text-left text-sm">
                              <thead>
                                  <tr className="bg-gray-100">
                                      <th className="p-1">#</th>
                                      <th className="p-1">Nama</th>
                                      <th className="p-1 text-right">Masa</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {leaderboard.map((entry, i) => (
                                      <tr key={i} className={`border-b ${entry.playerName === currentPlayer?.name && entry.timeMs === battleResult.timeMs ? 'bg-yellow-100 font-bold' : ''}`}>
                                          <td className="p-1 font-bold">{i+1}</td>
                                          <td className="p-1">
                                              <span className="truncate w-full block">{entry.playerName}</span>
                                          </td>
                                          <td className="p-1 text-right font-mono">{formatTime(entry.timeMs)}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}

                  <div className="space-y-2 mt-auto">
                      {isWin && (
                          <Button onClick={() => setAppState('LEVEL_SELECT')} variant="success" className="w-full text-lg py-2">
                              Teruskan <ArrowRight/>
                          </Button>
                      )}
                      {!isWin && (
                          <Button onClick={() => setAppState('BATTLE')} variant="primary" className="w-full text-lg py-2">
                              Cuba Lagi <RefreshCcw/>
                          </Button>
                      )}
                      <Button onClick={() => setAppState('LEVEL_SELECT')} variant="secondary" className="w-full py-2">
                          Kembali ke Peta
                      </Button>
                  </div>
              </Card>
          </div>
      );
  }

  return <div>Ralat tidak dijangka.</div>;
}

export default App;
