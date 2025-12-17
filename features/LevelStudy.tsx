
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { ArrowLeft, ArrowRight, Volume2, Sword, Puzzle } from '../components/Icons';
import { getWordsForLevel } from '../constants';
import { AudioEngine } from '../utils/audio';
import { BattleMode } from '../types';

interface LevelStudyProps {
  level: number;
  mode: BattleMode;
  onStart: () => void;
  onBack: () => void;
}

const LevelStudy: React.FC<LevelStudyProps> = ({ level, mode, onStart, onBack }) => {
    const words = getWordsForLevel(level);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentWord = words[currentIndex];
    const isLast = currentIndex === words.length - 1;
    const isFirst = currentIndex === 0;

    // Auto-play audio when word changes
    useEffect(() => {
        const timer = setTimeout(() => {
             AudioEngine.speak(currentWord.word);
        }, 300);
        return () => clearTimeout(timer);
    }, [currentWord]);

    const playAudio = () => {
        AudioEngine.speak(currentWord.word);
    };

    const handleNext = () => {
        if (isLast) {
            onStart();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirst) setCurrentIndex(prev => prev - 1);
    };

    return (
        <div className="h-[100dvh] bg-orange-100 flex flex-col">
            {/* Header */}
            <div className="bg-orange-500 p-2 md:p-4 border-b-4 border-black text-white flex items-center justify-between shadow-lg z-10 shrink-0 gap-2">
                <Button variant="secondary" onClick={onBack} className="px-3 py-1 h-10 mb-0 shrink-0"><ArrowLeft size={20}/></Button>
                
                <div className="text-center flex-1 overflow-hidden">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-widest roblox-text-shadow leading-none truncate">KELAS (学习)</h2>
                    <p className="text-[10px] md:text-xs font-bold text-orange-100 uppercase mt-1 truncate">Tahap {level} • {currentIndex + 1}/{words.length}</p>
                </div>

                <Button variant="info" onClick={onStart} className="px-3 py-1 h-10 mb-0 text-xs font-bold whitespace-nowrap shrink-0">
                    LANGKAU
                </Button>
            </div>

            {/* Main Flashcard Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="w-full max-w-md aspect-[4/5] md:aspect-square relative transition-all duration-300">
                    {/* Card Stack Effect */}
                    <div className="absolute inset-0 bg-black/10 rounded-sm transform translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4"></div>
                    <div className="absolute inset-0 bg-white border-4 border-black rounded-sm roblox-shadow flex flex-col items-center justify-center p-6 text-center shadow-xl">
                        
                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 tracking-[0.2em] bg-gray-100 px-3 py-1 rounded-full">Perkataan</h3>
                            
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 roblox-text-shadow text-white tracking-wide break-words w-full leading-tight select-none">
                                {currentWord.word}
                            </h1>
                            
                            <div className="w-full h-1 bg-gray-200 mb-6 rounded-full max-w-[200px]"></div>

                            <h2 className="text-3xl md:text-5xl font-bold text-gray-600 mb-8 select-none">
                                {currentWord.meaning}
                            </h2>

                            <button 
                                onClick={playAudio}
                                className="group bg-blue-500 text-white w-20 h-20 rounded-full border-4 border-black flex items-center justify-center hover:bg-blue-400 active:scale-95 transition-all roblox-shadow"
                            >
                                <Volume2 size={40} className="group-active:scale-90 transition-transform" />
                            </button>
                            <div className="text-gray-400 text-xs font-bold mt-2 uppercase">Tekan untuk Dengar</div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-white/90 backdrop-blur-sm border-t-4 border-black z-20">
                <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
                    <Button 
                        onClick={handlePrev} 
                        variant="secondary" 
                        disabled={isFirst}
                        className="w-full text-sm md:text-base"
                    >
                        <ArrowLeft className="mr-2"/> SEBELUM
                    </Button>

                    {isLast ? (
                        <Button 
                            onClick={onStart} 
                            variant="success" 
                            className="w-full animate-bounce text-sm md:text-base"
                        >
                            {mode === 'QUIZ' ? <Sword className="mr-2"/> : <Puzzle className="mr-2"/>}
                            MULA
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleNext} 
                            variant="primary" 
                            className="w-full text-sm md:text-base"
                        >
                            SETERUSNYA <ArrowRight className="ml-2"/>
                        </Button>
                    )}
                </div>
                
                {/* Progress Dots */}
                <div className="flex justify-center gap-1.5 mt-4 flex-wrap px-4 max-w-md mx-auto">
                    {words.map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-black transition-all ${i === currentIndex ? 'bg-yellow-400 scale-125' : i < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LevelStudy;
