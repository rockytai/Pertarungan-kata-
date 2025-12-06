import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import ProgressBar from '../components/ProgressBar';
import { VersusConfig, Word } from '../types';
import { generateOptions } from '../constants';
import { AudioEngine } from '../utils/audio';

interface VersusGameProps {
  config: VersusConfig;
  onExit: () => void;
}

const VersusGame: React.FC<VersusGameProps> = ({ config, onExit }) => {
    const [versusState, setVersusState] = useState({
        p1: config.p1,
        p2: config.p2,
        words: config.words,
        currentIndex: 0,
        gameWinner: null as 'p1' | 'p2' | null
    });
    
    const [options, setOptions] = useState<Word[]>([]);
    const [roundResult, setRoundResult] = useState<string | null>(null);

    const currentWord = versusState.words[versusState.currentIndex];

    useEffect(() => {
        if (!currentWord) return;
        setOptions(generateOptions(currentWord));
        setRoundResult(null);
        AudioEngine.speak(currentWord.word);
    }, [versusState.currentIndex, currentWord]);

    // AI Logic
    useEffect(() => {
        const isComputer = versusState.p2.isComputer;
        if (!isComputer || versusState.gameWinner || roundResult || options.length === 0) return;

        // AI Parameters based on difficulty
        let minDelay = 2000, maxDelay = 4000;
        let accuracy = 0.7;

        if (config.difficulty === 'MEDIUM') {
            minDelay = 1500; maxDelay = 3000;
            accuracy = 0.85;
        } else if (config.difficulty === 'HARD') {
            minDelay = 1000; maxDelay = 2000;
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
    }, [versusState.currentIndex, versusState.p2.isComputer, roundResult, options, config.difficulty, currentWord]);


    const handleAnswer = (player: 'p1' | 'p2', answer: Word) => {
        if (roundResult) return;
        
        if (answer.id === currentWord.id) {
            AudioEngine.playAttack();
            const damage = 20;
            const newState = { ...versusState };
            
            let winnerKey = '';
            if (player === 'p1') {
                newState.p2 = { ...newState.p2, hp: Math.max(0, (newState.p2.hp || 0) - damage) };
                newState.p1 = { ...newState.p1, score: (newState.p1.score || 0) + 10 };
                winnerKey = 'P1_WIN';
            } else {
                newState.p1 = { ...newState.p1, hp: Math.max(0, (newState.p1.hp || 0) - damage) };
                newState.p2 = { ...newState.p2, score: (newState.p2.score || 0) + 10 };
                winnerKey = 'P2_WIN';
            }
            
            setVersusState(newState);
            setRoundResult(winnerKey);

            setTimeout(() => {
                if ((newState.p1.hp || 0) <= 0 || (newState.p2.hp || 0) <= 0) {
                     setVersusState(prev => ({ ...prev, gameWinner: (prev.p1.hp || 0) > 0 ? 'p1' : 'p2' }));
                } else {
                     setVersusState(prev => ({
                        ...prev,
                        currentIndex: (prev.currentIndex + 1) % prev.words.length
                     }));
                }
            }, 1500);
        } else {
            if (player === 'p1' || !versusState.p2.isComputer) {
                // Only play damage sound for human mistakes to avoid noise confusion
                AudioEngine.playDamage();
            }
        }
    };

    if (versusState.gameWinner) {
        return (
            <div className="h-[100dvh] bg-gray-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center bg-yellow-50">
                    <h1 className="text-4xl font-black mb-4">🏆 PEMENANG 🏆</h1>
                    <div className="flex justify-center mb-6">
                        <PlayerAvatar 
                            avatar={versusState.gameWinner === 'p1' ? versusState.p1.avatar : versusState.p2.avatar} 
                            size="lg" 
                            className="scale-150 border-4 border-yellow-500"
                        />
                    </div>
                    <h2 className="text-2xl font-bold mb-8">
                        {versusState.gameWinner === 'p1' ? versusState.p1.name : versusState.p2.name}
                    </h2>
                    <Button onClick={onExit} className="w-full">Kembali ke Menu</Button>
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
                    <div className="bg-black/80 text-white px-8 py-4 rounded-xl font-black text-4xl animate-bounce border-4 border-white text-center">
                        {roundResult === 'P1_WIN' ? `${versusState.p1.name} MENANG!` : `${versusState.p2.name} MENANG!`}
                    </div>
                </div>
            )}

            {/* PLAYER 2 AREA */}
            <div className={`flex-1 bg-red-100 flex flex-col relative rotate-180 border-t-8 border-gray-900 ${isComputer ? 'pointer-events-none opacity-90' : ''}`}>
                 <div className="flex justify-between items-center p-2 bg-red-200">
                    <div className="flex items-center gap-2">
                        <PlayerAvatar avatar={versusState.p2.avatar} size="sm" />
                        <span className="font-bold">{versusState.p2.name}</span>
                        {isComputer && <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded animate-pulse">AI</span>}
                    </div>
                    <div className="w-1/2">
                        <ProgressBar current={versusState.p2.hp || 0} max={100} color="bg-red-500" label="HP" />
                    </div>
                 </div>
                 <div className="flex-1 flex flex-col items-center justify-center p-4">
                     <div className="text-4xl font-black mb-4 text-gray-800">{currentWord.word}</div>
                     <div className="grid grid-cols-2 gap-2 w-full">
                         {options.map((opt, i) => (
                             <button key={i} onClick={() => handleAnswer('p2', opt)} className="bg-white p-4 rounded-xl border-b-4 border-gray-300 font-bold shadow-sm active:scale-95">
                                 {opt.meaning}
                             </button>
                         ))}
                     </div>
                 </div>
            </div>

            <div className="h-2 bg-black z-10 flex items-center justify-center">
                <div className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">VS</div>
            </div>

            {/* PLAYER 1 AREA */}
            <div className="flex-1 bg-blue-100 flex flex-col relative">
                <div className="flex justify-between items-center p-2 bg-blue-200">
                    <div className="flex items-center gap-2">
                        <PlayerAvatar avatar={versusState.p1.avatar} size="sm" />
                        <span className="font-bold">{versusState.p1.name}</span>
                    </div>
                    <div className="w-1/2">
                        <ProgressBar current={versusState.p1.hp || 0} max={100} color="bg-blue-500" label="HP" />
                    </div>
                 </div>
                 <div className="flex-1 flex flex-col items-center justify-center p-4">
                     <div className="text-4xl font-black mb-4 text-gray-800">{currentWord.word}</div>
                     <div className="grid grid-cols-2 gap-2 w-full">
                         {options.map((opt, i) => (
                             <button key={i} onClick={() => handleAnswer('p1', opt)} className="bg-white p-4 rounded-xl border-b-4 border-gray-300 font-bold shadow-sm active:scale-95">
                                 {opt.meaning}
                             </button>
                         ))}
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default VersusGame;