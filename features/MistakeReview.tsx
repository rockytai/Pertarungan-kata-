
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import { ArrowLeft, RefreshCcw, Volume2, Shield } from '../components/Icons';
import { Player, Word } from '../types';
import { FULL_WORD_LIST, generateOptions } from '../constants';
import { AudioEngine } from '../utils/audio';

interface MistakeReviewProps {
  player: Player;
  onRemoveMistake: (wordId: number) => void;
  onExit: () => void;
}

const MistakeReview: React.FC<MistakeReviewProps> = ({ player, onRemoveMistake, onExit }) => {
    // Filter full word list to find mistake objects
    const [mistakeWords, setMistakeWords] = useState<Word[]>([]);
    
    // Game state
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [options, setOptions] = useState<Word[]>([]);
    const [anim, setAnim] = useState<'shake' | 'success' | null>(null);
    const [message, setMessage] = useState("");

    // Initialize list
    useEffect(() => {
        const words = FULL_WORD_LIST.filter(w => player.mistakes.includes(w.id));
        setMistakeWords(words.sort(() => 0.5 - Math.random())); // Shuffle
    }, [player.mistakes]);

    // Pick next word
    useEffect(() => {
        if (mistakeWords.length > 0 && !currentWord) {
            const next = mistakeWords[0];
            setCurrentWord(next);
            setOptions(generateOptions(next));
            setTimeout(() => AudioEngine.speak(next.word), 500);
        } else if (mistakeWords.length === 0) {
            setCurrentWord(null);
        }
    }, [mistakeWords, currentWord]);

    const handleAnswer = (selected: Word) => {
        if (!currentWord || anim) return;

        if (selected.id === currentWord.id) {
            // Correct
            AudioEngine.playAttack();
            setAnim('success');
            setMessage("BETUL! (正确!)");
            
            setTimeout(() => {
                onRemoveMistake(currentWord.id); // This will update parent state, but we need to update local state to feel snappy
                setMistakeWords(prev => prev.filter(w => w.id !== currentWord.id));
                setCurrentWord(null); // Triggers selection of next word
                setAnim(null);
                setMessage("");
            }, 1000);
        } else {
            // Wrong
            AudioEngine.playDamage();
            setAnim('shake');
            setMessage("CUBA LAGI! (再试一次!)");
            setTimeout(() => {
                setAnim(null);
                setMessage("");
            }, 800);
        }
    };

    if (mistakeWords.length === 0 && !currentWord) {
        return (
            <div className="h-[100dvh] bg-green-600 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center bg-green-50">
                    <div className="text-6xl mb-4 animate-bounce">✨</div>
                    <h2 className="text-3xl font-black mb-2 text-green-900">TAHNIAH!</h2>
                    <p className="text-xl font-bold text-gray-700 mb-8">Tiada lagi kesalahan dalam simpanan.</p>
                    <p className="text-sm text-gray-500 font-mono mb-8">(All mistakes cleared!)</p>
                    <Button onClick={onExit} variant="success" className="w-full">Kembali</Button>
                </Card>
            </div>
        );
    }

    if (!currentWord) return <div>Memuatkan...</div>;

    return (
        <div className={`h-[100dvh] bg-stone-700 flex flex-col items-center p-4 select-none ${anim === 'shake' ? 'animate-shake' : ''}`}>
             {/* Header */}
             <div className="w-full max-w-2xl flex justify-between items-center mb-6 text-white">
                 <Button variant="secondary" onClick={onExit} className="px-3 py-2 h-10 mb-0"><ArrowLeft/></Button>
                 <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-black uppercase tracking-widest text-yellow-400 roblox-text-shadow flex items-center gap-2">
                        <Shield size={24}/> Latihan Tubi
                    </h2>
                    <span className="font-mono text-sm bg-black/30 px-2 rounded">Baki: {mistakeWords.length} Soalan</span>
                 </div>
                 <div className="w-10"></div> {/* Spacer */}
             </div>

             {/* Flashcard Area */}
             <Card className="max-w-lg w-full flex-1 flex flex-col mb-4 bg-white relative overflow-visible">
                 
                 {/* Player Avatar Decoration */}
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                     <PlayerAvatar avatar={player.avatar} size="md" className="border-4 border-stone-800 shadow-xl" />
                 </div>

                 {message && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-3 border-4 border-black text-2xl font-black rotate-[-5deg] shadow-xl whitespace-nowrap animate-bounce ${anim === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {message}
                    </div>
                 )}

                 <div className="mt-12 flex-1 flex flex-col justify-center items-center p-4">
                     <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Terjemahkan Perkataan Ini</h3>
                     
                     <div className="flex items-center gap-4 mb-8">
                         <h1 className="text-5xl md:text-7xl font-black text-center text-stone-800">{currentWord.word}</h1>
                         <button 
                            onClick={() => AudioEngine.speak(currentWord.word)} 
                            className="bg-blue-100 p-2 rounded-full border-2 border-blue-300 hover:bg-blue-200 active:scale-95 transition-transform"
                         >
                             <Volume2 size={24} className="text-blue-600"/>
                         </button>
                     </div>

                     <div className="grid grid-cols-1 gap-3 w-full">
                         {options.map((opt, i) => (
                             <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className="w-full py-4 bg-gray-100 hover:bg-yellow-100 border-b-4 border-gray-300 hover:border-yellow-400 rounded-sm font-bold text-xl md:text-2xl text-gray-800 transition-all active:translate-y-1 active:border-b-0"
                             >
                                 {opt.meaning}
                             </button>
                         ))}
                     </div>
                 </div>
             </Card>
             
             <div className="text-white/50 text-xs font-mono mt-2">
                 Jawab dengan betul untuk buang dari senarai.
             </div>
        </div>
    );
};

export default MistakeReview;
