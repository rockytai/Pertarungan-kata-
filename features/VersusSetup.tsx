import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import { ArrowLeft, Users, Sword, RefreshCcw, Trophy } from '../components/Icons';
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
    const [gameMode, setGameMode] = useState<'RACE_TO_10' | 'TIME_ATTACK'>('RACE_TO_10');
    
    const [p2Name, setP2Name] = useState("Pemain 2");
    const [p2Avatar, setP2Avatar] = useState(avatars[1]);
    
    const [levelRange, setLevelRange] = useState<string>('1-10');
    const [manualLvl, setManualLvl] = useState(1);
    const [aiDifficulty, setAiDifficulty] = useState<'EASY'|'MEDIUM'|'HARD'>('MEDIUM');

    // Reset/Set P2 details when switching modes
    useEffect(() => {
        if (opponentType === 'CPU') {
            setP2Name("Komputer");
            setP2Avatar("robot");
        } else {
            setP2Name("Pemain 2");
            setP2Avatar(avatars[1]);
        }
    }, [opponentType, avatars]);

    const handleStart = () => {
        let words: any[] = [];
        
        // Generate words based on range
        if (levelRange === 'MANUAL') {
             // Get words for specific level, duplicate to make list longer
             const lvlWords = getWordsForLevel(manualLvl);
             words = [...lvlWords, ...lvlWords, ...lvlWords].sort(() => 0.5 - Math.random());
        } else if (levelRange === 'ALL') {
            words = getRandomWords(100, 1, 50);
        } else {
            const [start, end] = levelRange.split('-').map(Number);
            // Fetch more words for Time Attack so we don't run out
            const count = gameMode === 'TIME_ATTACK' ? 60 : 30; 
            words = getRandomWords(count, start, end);
        }

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
                scores: {},
                mistakes: [],
                isComputer: opponentType === 'CPU'
            },
            words: words,
            mode: gameMode,
            difficultyAI: aiDifficulty
        };
        onStart(config);
    };

    const LevelBtn = ({ range, label }: { range: string, label: string }) => (
        <button 
            onClick={() => setLevelRange(range)}
            className={`p-2 rounded-sm font-bold border-2 text-sm md:text-base transition-all ${levelRange === range ? 'bg-blue-500 text-white border-black transform scale-105 roblox-shadow' : 'bg-gray-100 text-gray-600 border-gray-300'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="h-[100dvh] bg-indigo-600 flex items-center justify-center p-2">
            <Card className="max-w-xl w-full p-4 bg-white overflow-y-auto max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <Button variant="secondary" onClick={onBack} className="py-2 px-3"><ArrowLeft size={20}/></Button>
                    <h2 className="text-xl font-black uppercase tracking-widest">Persediaan</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Opponent Select */}
                    <div>
                        <label className="block font-bold text-gray-700 text-xs mb-1 uppercase">Lawan (Opponent)</label>
                        <div className="flex gap-1">
                            <button onClick={() => setOpponentType('HUMAN')} className={`flex-1 py-2 rounded-sm border-2 font-bold text-sm ${opponentType === 'HUMAN' ? 'bg-yellow-400 border-black' : 'bg-gray-100 border-gray-300'}`}><Users size={16} className="mx-auto"/>Manusia</button>
                            <button onClick={() => setOpponentType('CPU')} className={`flex-1 py-2 rounded-sm border-2 font-bold text-sm ${opponentType === 'CPU' ? 'bg-blue-400 border-black text-white' : 'bg-gray-100 border-gray-300'}`}><Sword size={16} className="mx-auto"/>CPU</button>
                        </div>
                    </div>

                    {/* Mode Select */}
                    <div>
                        <label className="block font-bold text-gray-700 text-xs mb-1 uppercase">Mod (Mode)</label>
                        <div className="flex gap-1">
                            <button onClick={() => setGameMode('RACE_TO_10')} className={`flex-1 py-2 rounded-sm border-2 font-bold text-sm ${gameMode === 'RACE_TO_10' ? 'bg-green-500 border-black text-white' : 'bg-gray-100 border-gray-300'}`}><Trophy size={16} className="mx-auto"/>10 Soalan</button>
                            <button onClick={() => setGameMode('TIME_ATTACK')} className={`flex-1 py-2 rounded-sm border-2 font-bold text-sm ${gameMode === 'TIME_ATTACK' ? 'bg-red-500 border-black text-white' : 'bg-gray-100 border-gray-300'}`}><RefreshCcw size={16} className="mx-auto"/>60 Saat</button>
                        </div>
                    </div>
                </div>

                {/* Players Display */}
                <div className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-100 rounded-sm border-2 border-gray-200">
                    <div className="text-center w-20">
                        <PlayerAvatar avatar={currentPlayer.avatar} size="sm" className="mx-auto mb-1" />
                        <div className="font-bold truncate text-xs">{currentPlayer.name}</div>
                    </div>
                    <div className="text-xl font-black text-red-500 italic">VS</div>
                    <div className="text-center w-20">
                        <PlayerAvatar avatar={p2Avatar} size="sm" className="mx-auto mb-1" />
                        <div className="font-bold truncate text-xs">{p2Name}</div>
                    </div>
                </div>

                {/* Level Range Select */}
                <div className="flex-1 overflow-y-auto mb-4">
                    <label className="block font-bold text-gray-700 text-xs mb-1 uppercase">Pilih Julat Soalan (Question Range)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <LevelBtn range="1-10" label="Tahap 1 - 10" />
                        <LevelBtn range="11-20" label="Tahap 11 - 20" />
                        <LevelBtn range="21-30" label="Tahap 21 - 30" />
                        <LevelBtn range="31-40" label="Tahap 31 - 40" />
                        <LevelBtn range="41-50" label="Tahap 41 - 50" />
                        <LevelBtn range="ALL" label="Semua (1-50)" />
                        <LevelBtn range="MANUAL" label="Custom" />
                    </div>
                    
                    {levelRange === 'MANUAL' && (
                        <div className="flex items-center gap-2 mt-2 bg-yellow-100 p-2 rounded-sm border-2 border-yellow-300 justify-center">
                            <span className="font-bold text-sm">Pilih Tahap (1-50):</span>
                            <input 
                                type="number" min="1" max="50" 
                                value={manualLvl} 
                                onChange={e => setManualLvl(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="w-16 p-1 border-2 border-black rounded-sm text-center font-bold"
                            />
                        </div>
                    )}
                </div>

                {opponentType === 'CPU' && (
                     <div className="mb-4">
                        <label className="block font-bold text-gray-700 text-xs mb-1 uppercase">Kepintaran CPU (AI Difficulty)</label>
                        <div className="flex gap-2">
                            {['EASY', 'MEDIUM', 'HARD'].map(d => (
                                <button key={d} onClick={() => setAiDifficulty(d as any)} className={`flex-1 py-1 text-xs font-bold border-2 rounded-sm ${aiDifficulty === d ? 'bg-purple-500 text-white border-black' : 'bg-gray-100'}`}>{d}</button>
                            ))}
                        </div>
                     </div>
                )}

                <Button onClick={handleStart} variant="danger" className="w-full py-3 text-xl roblox-shadow">
                    MULA!
                </Button>
            </Card>
        </div>
    );
};

export default VersusSetup;