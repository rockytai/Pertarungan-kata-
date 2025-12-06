import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import { ArrowLeft, Users, Sword } from '../components/Icons';
import { Player, VersusConfig } from '../types';
import { getRandomWords, getWordsForLevel } from '../constants';

interface VersusSetupProps {
  currentPlayer: Player;
  avatars: string[];
  onStart: (config: VersusConfig) => void;
  onBack: () => void;
}

const VersusSetup: React.FC<VersusSetupProps> = ({ currentPlayer, onStart, onBack, avatars }) => {
    const [opponentType, setOpponentType] = useState<'HUMAN' | 'CPU'>('HUMAN');
    const [p2Name, setP2Name] = useState("Pemain 2");
    const [p2Avatar, setP2Avatar] = useState(avatars[1]);
    const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'MANUAL'>('EASY'); 
    const [manualLvl, setManualLvl] = useState(1);

    // Reset/Set P2 details when switching modes
    useEffect(() => {
        if (opponentType === 'CPU') {
            setP2Name("Komputer");
            setP2Avatar("🤖"); // Robot avatar
        } else {
            setP2Name("Pemain 2");
            setP2Avatar(avatars[1]);
        }
    }, [opponentType, avatars]);

    const handleStart = () => {
        let words: any[] = [];
        if (difficulty === 'EASY') words = getRandomWords(20, 1, 10);
        else if (difficulty === 'MEDIUM') words = getRandomWords(20, 11, 30);
        else if (difficulty === 'HARD') words = getRandomWords(20, 31, 50);
        else if (difficulty === 'MANUAL') words = [...getWordsForLevel(manualLvl), ...getWordsForLevel(manualLvl)].slice(0, 15);

        const config: VersusConfig = {
            p1: { ...currentPlayer, score: 0, hp: 100 },
            p2: { 
                id: 999, 
                name: p2Name, 
                avatar: p2Avatar, 
                score: 0, 
                hp: 100, 
                maxUnlockedLevel: 1, 
                stars: {},
                isComputer: opponentType === 'CPU'
            },
            words: words,
            difficulty: difficulty
        };
        onStart(config);
    };

    return (
        <div className="h-[100dvh] bg-indigo-600 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 bg-white overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <Button variant="secondary" onClick={onBack}><ArrowLeft/></Button>
                    <h2 className="text-xl font-black uppercase">Persediaan Versus</h2>
                </div>

                <div className="mb-6">
                    <label className="block font-bold text-gray-700 mb-2">Pilih Lawan:</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setOpponentType('HUMAN')}
                            className={`flex-1 py-3 px-2 rounded-xl border-b-4 font-bold flex flex-col items-center gap-1 ${opponentType === 'HUMAN' ? 'bg-yellow-400 border-yellow-700 text-yellow-900' : 'bg-gray-100 border-gray-300 text-gray-500'}`}
                        >
                            <Users size={24} /> Manusia
                        </button>
                        <button 
                            onClick={() => setOpponentType('CPU')}
                            className={`flex-1 py-3 px-2 rounded-xl border-b-4 font-bold flex flex-col items-center gap-1 ${opponentType === 'CPU' ? 'bg-blue-400 border-blue-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-500'}`}
                        >
                            <Sword size={24} /> Komputer
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8 px-2">
                    <div className="text-center w-24">
                        <PlayerAvatar avatar={currentPlayer.avatar} size="md" className="mx-auto" />
                        <div className="font-bold mt-2 truncate text-sm">{currentPlayer.name}</div>
                    </div>
                    <div className="text-2xl font-black text-red-500">VS</div>
                    <div className="text-center w-24">
                        <PlayerAvatar avatar={p2Avatar} size="md" className="mx-auto" />
                        <input 
                            value={p2Name} 
                            disabled={opponentType === 'CPU'}
                            onChange={e => setP2Name(e.target.value)}
                            className={`w-full text-center font-bold mt-2 border-b-2 text-sm outline-none ${opponentType === 'CPU' ? 'bg-transparent border-transparent text-gray-600' : 'border-gray-300 focus:border-blue-500'}`}
                        />
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <label className="block font-bold text-gray-700">Pilih Kesukaran:</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['EASY', 'MEDIUM', 'HARD', 'MANUAL'] as const).map(d => (
                            <button 
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`p-3 rounded-lg font-bold border-2 text-sm ${difficulty === d ? 'bg-blue-500 text-white border-blue-700' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {d === 'EASY' ? 'Mudah' : 
                                 d === 'MEDIUM' ? 'Sederhana' : 
                                 d === 'HARD' ? 'Sukar' : 'Pilih Tahap'}
                            </button>
                        ))}
                    </div>
                    {difficulty === 'MANUAL' && (
                        <div className="flex items-center gap-2 mt-2 bg-gray-100 p-2 rounded justify-center">
                            <span className="font-bold">Tahap:</span>
                            <input 
                                type="number" 
                                min="1" 
                                max="50" 
                                value={manualLvl} 
                                onChange={e => setManualLvl(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="w-16 p-1 border rounded text-center font-bold"
                            />
                        </div>
                    )}
                </div>

                <Button onClick={handleStart} variant="danger" className="w-full py-4 text-xl">
                    MULA PERTARUNGAN!
                </Button>
            </Card>
        </div>
    );
};

export default VersusSetup;