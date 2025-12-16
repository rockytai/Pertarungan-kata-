
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import ProgressBar from '../components/ProgressBar';
import { ArrowLeft, Trophy, Heart, Volume2, Star } from '../components/Icons';
import { Player, Word } from '../types';
import { WORLDS, getWordsForLevel, generateOptions } from '../constants';
import { AudioEngine } from '../utils/audio';

interface SinglePlayerBattleProps {
  level: number;
  currentPlayer: Player;
  highScore: number;
  onWin: (mistakes: number, score: number) => void;
  onLose: () => void;
  onExit: () => void;
  onAddMistake: (wordId: number) => void;
}

const OPTION_THEMES = [
    { bg: "bg-red-600", hover: "hover:bg-red-500", border: "border-black", text: "text-white" },
    { bg: "bg-blue-600", hover: "hover:bg-blue-500", border: "border-black", text: "text-white" },
    { bg: "bg-green-600", hover: "hover:bg-green-500", border: "border-black", text: "text-white" },
    { bg: "bg-yellow-400", hover: "hover:bg-yellow-300", border: "border-black", text: "text-black" },
];

const NameTag = ({ name }: { name: string }) => (
    <div className="mb-1 text-center pointer-events-none">
        <span className="text-white font-black text-sm md:text-xl tracking-wide roblox-text-shadow leading-none filter drop-shadow-md bg-black/30 px-2 rounded-sm">
            {name}
        </span>
    </div>
);

const SinglePlayerBattle: React.FC<SinglePlayerBattleProps> = ({ level, currentPlayer, highScore, onWin, onLose, onExit, onAddMistake }) => {
    const world = WORLDS.find(w => w.id === Math.ceil(level / 10));
    if (!world) return <div>World not found</div>;

    const startLvl = (world.id - 1) * 10 + 1;
    const enemyMaxHP = world.hp + ((level - startLvl) * 5);
    
    const [battleState, setBattleState] = useState({
        hp: 100,
        enemyHp: enemyMaxHP,
        words: getWordsForLevel(level).sort(() => 0.5 - Math.random()),
        currentIndex: 0,
        mistakes: 0,
        message: "",
        anim: null as 'damage' | 'attack' | 'win' | null,
        shake: false,
        score: 0,
        combo: 0,
        addedScore: 0
    });
    
    const [options, setOptions] = useState<Word[]>([]);
    
    const currentWord = battleState.words[battleState.currentIndex];

    useEffect(() => {
        if (!currentWord) return;
        setOptions(generateOptions(currentWord));
        setTimeout(() => AudioEngine.speak(currentWord.word), 500);
    }, [battleState.currentIndex, currentWord]);

    const handleAnswer = (ans: Word) => {
        if (battleState.anim === 'win') return;

        if (ans.id === currentWord.id) {
            AudioEngine.playAttack();
            const dmg = Math.ceil(enemyMaxHP / 10 * 1.2);
            const newEnemyHp = Math.max(0, battleState.enemyHp - dmg);

            // Scoring Logic
            const basePoints = 1000;
            const comboBonus = battleState.combo * 200;
            const points = basePoints + comboBonus;

            setBattleState(prev => ({
                ...prev,
                enemyHp: newEnemyHp,
                message: "CRITICAL HIT! (暴击!)",
                anim: 'attack',
                score: prev.score + points,
                combo: prev.combo + 1,
                addedScore: points
            }));

            // Clear added score anim after delay
            setTimeout(() => {
                setBattleState(prev => ({ ...prev, addedScore: 0 }));
            }, 800);

            setTimeout(() => {
                 setBattleState(prev => ({ ...prev, anim: null }));
            }, 300);

            if (newEnemyHp <= 0) {
                setBattleState(prev => ({ ...prev, anim: 'win', message: "BOSS TEWAS! (击败!)" }));
                setTimeout(() => {
                    AudioEngine.playWin();
                    // Pass score to onWin
                    onWin(battleState.mistakes, battleState.score + points); // +points because state update is async, or we use new state. Wait, setBattleState updates are batched.
                }, 1000);
            } else {
                setTimeout(() => {
                    setBattleState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1, message: "" }));
                }, 800);
            }
        } else {
            AudioEngine.playDamage();
            // Record mistake
            onAddMistake(currentWord.id);

            const dmg = 34; 
            const newHp = Math.max(0, battleState.hp - dmg);
            
            setBattleState(prev => ({
                ...prev,
                hp: newHp,
                mistakes: prev.mistakes + 1,
                message: `SALAH! (错了!)`,
                anim: 'damage',
                shake: true,
                combo: 0 // Reset Combo
            }));

            setTimeout(() => {
                setBattleState(prev => ({ ...prev, shake: false, anim: null }));
                if (newHp <= 0) {
                    AudioEngine.playFail();
                    onLose();
                } else {
                    setOptions(generateOptions(currentWord));
                    setBattleState(prev => ({ ...prev, message: "" }));
                }
            }, 1000);
        }
    };

    if (!currentWord) return <div>Memuatkan...</div>;

    return (
          <div className={`h-[100dvh] bg-sky-300 flex flex-col overflow-hidden select-none ${battleState.shake ? 'animate-shake' : ''}`}>
              {/* Top Bar - Compact */}
              <div className="bg-gray-900 border-b-4 border-black text-white p-1 flex justify-between items-center z-10 shadow-lg shrink-0 h-12">
                  <div className="flex items-center gap-2">
                      <Button variant="secondary" onClick={onExit} className="px-2 py-1 text-xs mb-0 h-8"><ArrowLeft size={16}/></Button>
                      <div className="font-bold text-yellow-400 flex items-center gap-2 text-lg font-mono"><Trophy size={18}/> LVL {level}</div>
                  </div>
                  
                  {/* Score Display */}
                  <div className="flex-1 text-center flex flex-col items-center">
                     <div className="inline-block bg-black/50 px-4 rounded border-2 border-white/20 text-yellow-300 font-black font-mono text-xl tracking-widest relative">
                        {battleState.score.toLocaleString()}
                        {battleState.addedScore > 0 && (
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-green-400 text-sm font-bold animate-[moveUp_0.8s_ease-out_forwards] pointer-events-none">
                                +{battleState.addedScore}
                            </span>
                        )}
                     </div>
                     {highScore > 0 && (
                        <div className="text-[10px] text-gray-300 font-bold -mt-1 tracking-wider uppercase">
                            Rekod: {highScore.toLocaleString()}
                        </div>
                     )}
                  </div>

                  <div className="flex gap-1 pr-2">
                      {[1,2,3].map(h => (
                          <div key={h} className="transform hover:scale-110 transition-transform">
                             <Heart size={20} className={h <= (3 - battleState.mistakes) ? "text-red-500 fill-red-500 drop-shadow-md" : "text-gray-700 fill-gray-700"} />
                          </div>
                      ))}
                  </div>
              </div>

              {/* Battle Arena - Smaller visual area (approx 40% height minus header) */}
              <div className={`flex-1 relative flex flex-col justify-end pb-2 px-4 ${world.bgPattern} overflow-hidden`}>
                  
                  {/* Floor */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-700 border-t-8 border-green-900 opacity-80"></div>

                  {/* Message Toast */}
                  {battleState.message && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 border-4 border-black font-black animate-bounce z-40 whitespace-nowrap text-3xl roblox-shadow font-mono rotate-[-5deg]">
                          {battleState.message}
                      </div>
                  )}

                  {/* Combo Indicator */}
                  {battleState.combo > 1 && (
                      <div className="absolute top-20 left-10 z-50 animate-bounce">
                          <div className="text-4xl md:text-6xl font-black text-yellow-400 roblox-text-shadow rotate-12 border-4 border-black bg-red-500 px-4 py-2 rounded-sm transform skew-x-12">
                              x{battleState.combo} COMBO!
                          </div>
                      </div>
                  )}

                  <div className="flex justify-between items-end w-full max-w-5xl mx-auto z-20 mb-2">
                      {/* PLAYER - Attack Animation moves far right */}
                      <div className={`flex flex-col items-center transition-transform duration-200 ease-out ${battleState.anim === 'attack' ? 'translate-x-32 md:translate-x-64 rotate-12 scale-110 z-30' : ''} ${battleState.anim === 'damage' ? '-translate-x-4 opacity-80 grayscale' : ''}`}>
                           <NameTag name={currentPlayer.name} />
                           <div className="mb-1 w-24 md:w-32">
                               <ProgressBar current={battleState.hp} max={100} color="bg-green-500" />
                           </div>
                           <PlayerAvatar avatar={currentPlayer.avatar} size="md" className="border-4 border-black shadow-2xl bg-white" />
                      </div>

                      {/* ENEMY - Hit Animation */}
                      <div className={`flex flex-col items-center transition-transform duration-100 ${battleState.anim === 'attack' ? 'translate-x-4 brightness-200 saturate-0' : ''} ${battleState.anim === 'win' ? 'scale-0 rotate-180 opacity-0' : ''}`}>
                          <NameTag name={world.enemy} />
                          <div className="mb-1 w-24 md:w-32">
                              <ProgressBar current={battleState.enemyHp} max={enemyMaxHP} color="bg-red-500" reverse />
                          </div>
                          <PlayerAvatar avatar={world.img} size="md" className="border-4 border-black shadow-2xl bg-white" />
                      </div>
                  </div>
              </div>

              {/* Controls Area - Enlarged to 60% Height */}
              <div className="bg-gray-200 p-2 border-t-8 border-black flex flex-col justify-end h-[60%]">
                  <div className="flex flex-col items-center mb-2 shrink-0">
                      <div className="flex items-center justify-center gap-4 w-full">
                        <h2 className="text-7xl md:text-9xl font-black text-gray-900 text-center roblox-text-shadow font-mono text-white tracking-widest leading-none drop-shadow-xl truncate max-w-full px-2">
                            {currentWord.word}
                        </h2>
                        <button onClick={() => AudioEngine.speak(currentWord.word)} className="bg-blue-600 text-white border-2 border-black p-2 rounded-sm roblox-shadow active:translate-y-1 active:shadow-none transition-all shrink-0">
                            <Volume2 size={32}/>
                        </button>
                      </div>
                  </div>
                  {/* Expanded Grid to w-full */}
                  <div className="grid grid-cols-2 gap-2 w-full flex-1 mb-1 px-1">
                      {options.map((opt, i) => {
                          const theme = OPTION_THEMES[i % 4];
                          return (
                              <button 
                                  key={i} 
                                  onClick={() => handleAnswer(opt)} 
                                  className={`${theme.bg} ${theme.hover} ${theme.text} ${theme.border} border-b-8 rounded-sm text-4xl md:text-6xl font-bold roblox-shadow active:border-b-2 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center p-2 leading-none h-full w-full break-words text-center`}
                              >
                                  {opt.meaning}
                              </button>
                          );
                      })}
                  </div>
              </div>
          </div>
    );
};

export default SinglePlayerBattle;
