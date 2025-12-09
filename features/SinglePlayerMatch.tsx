
import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import ProgressBar from '../components/ProgressBar';
import { ArrowLeft, Trophy, Heart } from '../components/Icons';
import { Player } from '../types';
import { WORLDS, getWordsForLevel } from '../constants';
import { AudioEngine } from '../utils/audio';

interface SinglePlayerMatchProps {
  level: number;
  currentPlayer: Player;
  onWin: (mistakes: number, timeMs: number) => void;
  onLose: () => void;
  onExit: () => void;
}

interface Card {
  id: string; // Unique ID for key
  wordId: number; // To match pair
  content: string; // Text to display
  type: 'word' | 'meaning';
  isMatched: boolean;
}

const NameTag = ({ name }: { name: string }) => (
    <div className="mb-0.5 text-center pointer-events-none">
        <span className="text-white font-black text-sm md:text-xl tracking-wide roblox-text-shadow leading-none filter drop-shadow-md truncate max-w-[80px] md:max-w-full block">
            {name}
        </span>
    </div>
);

const SinglePlayerMatch: React.FC<SinglePlayerMatchProps> = ({ level, currentPlayer, onWin, onLose, onExit }) => {
    const world = WORLDS.find(w => w.id === Math.ceil(level / 10));
    if (!world) return <div>World not found</div>;

    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [errorCardIds, setErrorCardIds] = useState<string[]>([]);
    
    // Timer
    const startTimeRef = useRef(Date.now());
    const [currentTime, setCurrentTime] = useState(0);
    const timerRef = useRef<number | null>(null);

    // Battle Stats
    const totalPairs = 6;
    const enemyMaxHp = world.hp; 
    const [hp, setHp] = useState(100);
    const [enemyHp, setEnemyHp] = useState(enemyMaxHp);
    const [mistakes, setMistakes] = useState(0);
    const [matchesFound, setMatchesFound] = useState(0);
    
    // Animations
    const [message, setMessage] = useState("");
    const [anim, setAnim] = useState<'damage' | 'attack' | 'win' | null>(null);
    const [shake, setShake] = useState(false);

    // Init Game
    useEffect(() => {
        const pool = getWordsForLevel(level).sort(() => 0.5 - Math.random()).slice(0, totalPairs);
        const deck: Card[] = [];
        pool.forEach((w, i) => {
            deck.push({ id: `w-${i}`, wordId: w.id, content: w.word, type: 'word', isMatched: false });
            deck.push({ id: `m-${i}`, wordId: w.id, content: w.meaning, type: 'meaning', isMatched: false });
        });
        setCards(deck.sort(() => 0.5 - Math.random()));
        
        // Start Timer
        startTimeRef.current = Date.now();
        timerRef.current = window.setInterval(() => {
            setCurrentTime(Date.now() - startTimeRef.current);
        }, 50);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [level]);

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleCardClick = (clickedCard: Card) => {
        if (clickedCard.isMatched || anim === 'win' || errorCardIds.length > 0) return;

        // If clicking the same card, deselect
        if (selectedCardId === clickedCard.id) {
            setSelectedCardId(null);
            return;
        }

        AudioEngine.playTone(400, 'sine', 0.1);

        // If no card selected, select this one
        if (!selectedCardId) {
            setSelectedCardId(clickedCard.id);
            return;
        }

        // If one card already selected, check match
        const firstCard = cards.find(c => c.id === selectedCardId);
        if (!firstCard) return;

        if (firstCard.wordId === clickedCard.wordId) {
            // MATCH!
            handleMatch(firstCard, clickedCard);
        } else {
            // MISMATCH!
            handleMismatch(firstCard, clickedCard);
        }
    };

    const handleMatch = (c1: Card, c2: Card) => {
        AudioEngine.playAttack();
        setSelectedCardId(null);

        // Mark matched
        setCards(prev => prev.map(c => 
            (c.id === c1.id || c.id === c2.id) ? { ...c, isMatched: true } : c
        ));

        setMatchesFound(prev => {
            const newCount = prev + 1;
            const dmg = enemyMaxHp / totalPairs;
            setEnemyHp(Math.max(0, enemyMaxHp - (newCount * dmg)));
            
            if (newCount === totalPairs) {
                 stopTimer();
                 setAnim('win');
                 setMessage("MENANG! (胜利!)");
                 setTimeout(() => {
                     AudioEngine.playWin();
                     onWin(mistakes, currentTime);
                 }, 1000);
            } else {
                setAnim('attack');
                setTimeout(() => setAnim(null), 300);
            }
            return newCount;
        });
    };

    const handleMismatch = (c1: Card, c2: Card) => {
        AudioEngine.playDamage();
        setErrorCardIds([c1.id, c2.id]);
        
        setMistakes(m => m + 1);
        setHp(prev => {
            const newHp = Math.max(0, prev - 15);
            if (newHp <= 0) {
                stopTimer();
                setTimeout(onLose, 500);
            }
            return newHp;
        });
        
        setMessage("SALAH! (错!)");
        setAnim('damage');
        setShake(true);

        // Reset state after delay
        setTimeout(() => {
            setMessage("");
            setAnim(null);
            setShake(false);
            setSelectedCardId(null);
            setErrorCardIds([]);
        }, 800);
    };

    return (
        <div className={`h-[100dvh] bg-sky-300 flex flex-col overflow-hidden select-none ${shake ? 'animate-shake' : ''}`}>
             {/* Top Bar */}
             <div className="bg-gray-900 border-b-4 border-black text-white p-1 px-2 flex justify-between items-center z-10 shadow-lg shrink-0 h-12 md:h-16">
                  <div className="flex items-center gap-2">
                      <Button variant="secondary" onClick={onExit} className="px-2 py-1 text-xs mb-0 h-8 md:h-10"><ArrowLeft size={16}/></Button>
                      <div className="font-bold text-yellow-400 flex items-center gap-2 text-lg md:text-xl font-mono"><Trophy size={18}/> {level}</div>
                  </div>
                  
                  {/* Timer Display */}
                  <div className="bg-black border-2 border-white px-2 md:px-4 py-0.5 rounded-sm font-mono text-lg md:text-2xl text-yellow-300 shadow-lg">
                      {(currentTime / 1000).toFixed(2)}s
                  </div>

                  <div className="flex gap-1">
                      {[1,2,3].map(h => (
                          <div key={h} className="transform hover:scale-110 transition-transform">
                             <Heart size={20} className={h <= (3 - mistakes) ? "text-red-500 fill-red-500 drop-shadow-md" : "text-gray-700 fill-gray-700"} />
                          </div>
                      ))}
                  </div>
              </div>

              {/* Battle Arena (Compact Header) */}
              <div className={`relative flex items-center justify-between px-2 md:px-6 py-1 ${world.bgPattern} shrink-0 border-b-8 border-black h-20 md:h-28`}>
                   
                   {/* Message Toast */}
                  {message && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-yellow-400 px-6 py-2 border-4 border-white font-bold animate-bounce z-40 whitespace-nowrap text-xl roblox-shadow font-mono">
                          {message}
                      </div>
                  )}

                  {/* PLAYER */}
                  <div className={`flex items-center gap-2 transition-transform duration-100 ${anim === 'attack' ? 'translate-x-4 rotate-3' : ''} ${anim === 'damage' ? '-translate-x-2 opacity-80' : ''}`}>
                       <PlayerAvatar avatar={currentPlayer.avatar} size="sm" className="border-2 border-black shadow-lg bg-white hidden sm:block w-12 h-12 md:w-20 md:h-20" />
                       <div className="flex flex-col">
                           <NameTag name={currentPlayer.name} />
                           <div className="w-20 md:w-32">
                               <ProgressBar current={hp} max={100} color="bg-green-500" />
                           </div>
                       </div>
                  </div>

                  {/* VS */}
                  <div className="font-black text-white text-lg md:text-3xl opacity-50">VS</div>

                  {/* ENEMY */}
                  <div className={`flex items-center gap-2 transition-transform duration-100 ${anim === 'attack' ? '-translate-x-2 brightness-150' : ''} ${anim === 'win' ? 'scale-0 rotate-180 opacity-0' : ''}`}>
                      <div className="flex flex-col items-end">
                          <NameTag name={world.enemy} />
                          <div className="w-20 md:w-32">
                              <ProgressBar current={enemyHp} max={enemyMaxHp} color="bg-red-500" reverse />
                          </div>
                      </div>
                      <PlayerAvatar avatar={world.img} size="sm" className="border-2 border-black shadow-lg bg-white hidden sm:block w-12 h-12 md:w-20 md:h-20" />
                  </div>
              </div>

              {/* Game Grid */}
              <div className="flex-1 bg-gray-200 p-2 md:p-4 overflow-hidden flex flex-col">
                  <div className="grid grid-cols-3 gap-2 md:gap-4 w-full h-full max-w-7xl mx-auto">
                      {cards.map(card => {
                          const isSelected = selectedCardId === card.id;
                          const isError = errorCardIds.includes(card.id);

                          return (
                            <button
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                disabled={card.isMatched}
                                className={`
                                    relative rounded-sm border-b-4 md:border-b-8 
                                    text-2xl sm:text-4xl md:text-6xl lg:text-7xl 
                                    font-bold roblox-shadow transition-all duration-150 transform flex items-center justify-center p-1 md:p-2 leading-tight break-words h-full w-full
                                    ${card.isMatched 
                                        ? 'opacity-0 pointer-events-none' 
                                        : isError
                                            ? 'bg-red-500 border-red-900 text-white animate-shake'
                                            : isSelected 
                                                ? 'bg-yellow-300 border-yellow-600 text-black -translate-y-1' 
                                                : 'bg-white border-black text-black hover:bg-gray-50 active:translate-y-1 active:border-b-4 active:shadow-none'
                                    }
                                `}
                            >
                                <span className={`roblox-text-shadow-none text-center block w-full`}>
                                    {card.content}
                                </span>
                            </button>
                          );
                      })}
                  </div>
              </div>
        </div>
    );
};

export default SinglePlayerMatch;
    