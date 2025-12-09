
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import { VersusConfig, Word, Player } from '../types';
import { generateOptions } from '../constants';
import { AudioEngine } from '../utils/audio';

interface VersusGameProps {
  config: VersusConfig;
  onExit: () => void;
  onGameOver: (winner: Player) => void;
}

const OPTION_THEMES = [
    { bg: "bg-red-500", hover: "hover:bg-red-400", border: "border-red-900", text: "text-white" },
    { bg: "bg-blue-500", hover: "hover:bg-blue-400", border: "border-blue-900", text: "text-white" },
    { bg: "bg-green-500", hover: "hover:bg-green-400", border: "border-green-900", text: "text-white" },
    { bg: "bg-yellow-400", hover: "hover:bg-yellow-300", border: "border-yellow-700", text: "text-yellow-900" },
];

const NameTag = ({ name, score }: { name: string, score: number }) => (
    <div className="flex flex-col items-start w-full">
        <span className="text-white font-black text-xl md:text-2xl tracking-wide roblox-text-shadow leading-none filter drop-shadow-md truncate max-w-full">
            {name}
        </span>
        <div className="bg-black/50 px-2 rounded-sm text-yellow-300 font-mono font-bold text-sm md:text-base border border-white/20">
            SCORE: {score}
        </div>
    </div>
);

const VersusGame: React.FC<VersusGameProps> = ({ config, onExit, onGameOver }) => {
    const [versusState, setVersusState] = useState({
        p1: config.p1,
        p2: config.p2,
        words: config.words,
        currentIndex: 0,
        gameWinner: null as 'p1' | 'p2' | 'draw' | null
    });
    
    const [timeLeft, setTimeLeft] = useState(config.mode === 'TIME_ATTACK' ? 60 : 0);
    const [options, setOptions] = useState<Word[]>([]);
    const [roundResult, setRoundResult] = useState<string | null>(null);

    const currentWord = versusState.words[versusState.currentIndex];

    // Timer Logic for Time Attack
    useEffect(() => {
        if (config.mode !== 'TIME_ATTACK' || versusState.gameWinner) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Determine winner based on score
                    const s1 = versusState.p1.score || 0;
                    const s2 = versusState.p2.score || 0;
                    let winner: 'p1' | 'p2' | 'draw' = 'draw';
                    if (s1 > s2) winner = 'p1';
                    else if (s2 > s1) winner = 'p2';
                    setVersusState(curr => ({ ...curr, gameWinner: winner }));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [config.mode, versusState.gameWinner, versusState.p1.score, versusState.p2.score]);

    // Check Win Condition for Race Mode
    useEffect(() => {
        if (config.mode !== 'RACE_TO_10' || versusState.gameWinner) return;
        
        // 10 correct answers = 100 points
        if ((versusState.p1.score || 0) >= 100) {
            setVersusState(curr => ({ ...curr, gameWinner: 'p1' }));
        } else if ((versusState.p2.score || 0) >= 100) {
            setVersusState(curr => ({ ...curr, gameWinner: 'p2' }));
        }
    }, [config.mode, versusState.p1.score, versusState.p2.score, versusState.gameWinner]);

    // Handle Game Over Side Effect
    useEffect(() => {
        if (versusState.gameWinner && versusState.gameWinner !== 'draw') {
            const winner = versusState.gameWinner === 'p1' ? versusState.p1 : versusState.p2;
            onGameOver(winner);
        }
    }, [versusState.gameWinner]);

    // Setup Options
    useEffect(() => {
        if (!currentWord) return;
        setOptions(generateOptions(currentWord));
        setRoundResult(null);
        AudioEngine.speak(currentWord.word);
    }, [versusState.currentIndex, currentWord]);

    // AI Logic
    useEffect(() => {
        const isComputer = versusState.p2.isComputer;
        if (!isComputer || versusState.gameWinner || roundResult || options.length === 0 || timeLeft === 0 && config.mode === 'TIME_ATTACK') return;

        let minDelay = 2000, maxDelay = 4000;
        let accuracy = 0.7;

        if (config.difficultyAI === 'MEDIUM') {
            minDelay = 1500; maxDelay = 3000;
            accuracy = 0.85;
        } else if (config.difficultyAI === 'HARD') {
            minDelay = 800; maxDelay = 1800;
            accuracy = 0.95;
        }

        const reactionTime = Math.random() * (maxDelay - minDelay) + minDelay;

        const timer = setTimeout(() => {
            const isCorrect = Math.random() < accuracy;
            let answer = currentWord;
            
            if (!isCorrect) {
                const wrongOptions = options.filter(o => o.id !== currentWord.id);
                if (wrongOptions.length > 0) {
                    answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
                }
            }
            handleAnswer('p2', answer);
        }, reactionTime);

        return () => clearTimeout(timer);
    }, [versusState.currentIndex, versusState.p2.isComputer, roundResult, options, config.difficultyAI, currentWord, versusState.gameWinner]);


    const handleAnswer = (player: 'p1' | 'p2', answer: Word) => {
        if (roundResult || versusState.gameWinner) return;
        
        const isCorrect = answer.id === currentWord.id;

        if (isCorrect) {
            AudioEngine.playAttack();
            
            setVersusState(prev => {
                const p1Score = (prev.p1.score || 0) + (player === 'p1' ? 10 : 0);
                const p2Score = (prev.p2.score || 0) + (player === 'p2' ? 10 : 0);
                
                return {
                    ...prev,
                    p1: { ...prev.p1, score: p1Score },
                    p2: { ...prev.p2, score: p2Score }
                };
            });
            
            setRoundResult(`${player === 'p1' ? versusState.p1.name : versusState.p2.name} +10`);

            // Next Question Delay
            setTimeout(() => {
                 setVersusState(prev => {
                     // If we run out of words, loop back or shuffle
                     const nextIndex = (prev.currentIndex + 1) % prev.words.length;
                     return { ...prev, currentIndex: nextIndex };
                 });
            }, 1000);
        } else {
             if (player === 'p1' || !versusState.p2.isComputer) {
                AudioEngine.playDamage();
            }
        }
    };

    if (versusState.gameWinner) {
        return (
            <div className="h-[100dvh] bg-gray-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center bg-yellow-50">
                    <h1 className="text-4xl font-black mb-4 roblox-text-shadow text-white">🏆 PEMENANG 🏆</h1>
                    {versusState.gameWinner === 'draw' ? (
                        <h2 className="text-3xl font-bold">SERI! (DRAW)</h2>
                    ) : (
                        <>
                            <div className="flex justify-center mb-6">
                                <PlayerAvatar 
                                    avatar={versusState.gameWinner === 'p1' ? versusState.p1.avatar : versusState.p2.avatar} 
                                    size="lg" 
                                    className="scale-150 border-4 border-yellow-500"
                                />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">
                                {versusState.gameWinner === 'p1' ? versusState.p1.name : versusState.p2.name}
                            </h2>
                            <div className="text-xl font-mono bg-black text-white p-2 rounded inline-block">
                                SKOR: {versusState.gameWinner === 'p1' ? versusState.p1.score : versusState.p2.score}
                            </div>
                        </>
                    )}
                    <Button onClick={onExit} className="w-full mt-8">Kembali ke Menu</Button>
                </Card>
            </div>
        );
    }

    if (!currentWord) return <div>Memuatkan...</div>;

    const isComputer = versusState.p2.isComputer;

    return (
        <div className="h-[100dvh] w-full flex flex-col bg-gray-800 overflow-hidden relative">
            {roundResult && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-yellow-400 text-black px-8 py-4 rounded-sm font-black text-3xl animate-bounce border-4 border-black text-center roblox-shadow">
                        {roundResult}
                    </div>
                </div>
            )}

            {/* PLAYER 2 AREA */}
            <div className={`flex-1 bg-red-200 flex flex-col relative rotate-180 border-t-8 border-gray-900 ${isComputer ? 'pointer-events-none' : ''}`}>
                 <div className="flex justify-between items-start p-2 bg-red-400 border-b-4 border-red-600 h-20 md:h-24">
                    <div className="flex items-center gap-2 w-full">
                         <PlayerAvatar avatar={versusState.p2.avatar} size="sm" />
                         <NameTag name={versusState.p2.name} score={versusState.p2.score || 0} />
                    </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-center p-2">
                     <div className="flex-1 flex items-center justify-center">
                        <div className="text-7xl md:text-9xl font-black text-gray-900 font-mono text-center leading-none roblox-text-shadow text-white truncate max-w-full">
                            {currentWord.word}
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2 w-full h-1/2">
                         {options.map((opt, i) => {
                             const theme = OPTION_THEMES[i % 4];
                             return (
                                 <button 
                                     key={i} 
                                     onClick={() => handleAnswer('p2', opt)} 
                                     className={`${theme.bg} ${theme.text} ${theme.border} border-b-8 rounded-sm font-bold roblox-shadow active:scale-95 text-3xl md:text-5xl flex items-center justify-center active:border-b-4 active:translate-y-1 transition-all h-full w-full p-2 leading-none break-words text-center`}
                                 >
                                     {opt.meaning}
                                 </button>
                             );
                         })}
                     </div>
                 </div>
            </div>

            {/* CENTER INFO BAR */}
            <div className="h-10 md:h-12 bg-gray-900 z-10 flex items-center justify-between px-4 border-y-4 border-black text-white font-mono font-bold shrink-0">
                <div>
                    {config.mode === 'RACE_TO_10' ? (
                         <span className="text-yellow-400">RACE: 10</span>
                    ) : (
                         <span className={`${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                             TIME: {timeLeft}s
                         </span>
                    )}
                </div>
                <div className="bg-white text-black px-2 rounded-sm text-xs font-black border-2 border-black tracking-widest">VS</div>
                <div>LEVEL: {config.words[0]?.level || '?'}</div>
            </div>

            {/* PLAYER 1 AREA */}
            <div className="flex-1 bg-blue-200 flex flex-col relative">
                <div className="flex justify-between items-start p-2 bg-blue-400 border-b-4 border-blue-600 h-20 md:h-24">
                    <div className="flex items-center gap-2 w-full">
                        <PlayerAvatar avatar={versusState.p1.avatar} size="sm" />
                        <NameTag name={versusState.p1.name} score={versusState.p1.score || 0} />
                    </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-center p-2">
                     <div className="flex-1 flex items-center justify-center">
                        <div className="text-7xl md:text-9xl font-black text-gray-900 font-mono text-center leading-none roblox-text-shadow text-white truncate max-w-full">
                            {currentWord.word}
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2 w-full h-1/2">
                         {options.map((opt, i) => {
                             const theme = OPTION_THEMES[i % 4];
                             return (
                                 <button 
                                     key={i} 
                                     onClick={() => handleAnswer('p1', opt)} 
                                     className={`${theme.bg} ${theme.text} ${theme.border} border-b-8 rounded-sm font-bold roblox-shadow active:scale-95 text-3xl md:text-5xl flex items-center justify-center active:border-b-4 active:translate-y-1 transition-all h-full w-full p-2 leading-none break-words text-center`}
                                 >
                                     {opt.meaning}
                                 </button>
                             );
                         })}
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default VersusGame;
