
import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Award, Lock } from '../components/Icons';
import { Player } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementViewProps {
  player: Player;
  onBack: () => void;
}

const AchievementView: React.FC<AchievementViewProps> = ({ player, onBack }) => {
    const unlockedCount = player.achievements?.length || 0;

    return (
        <div className="h-[100dvh] bg-purple-900 flex items-center justify-center p-4">
            <Card className="max-w-xl w-full p-6 bg-purple-50 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <Button variant="secondary" onClick={onBack} className="px-3 py-2 h-10 mb-0">
                        <ArrowLeft />
                    </Button>
                    <div className="text-center flex-1">
                        <h2 className="text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
                            <Award className="text-purple-600" />
                            Pencapaian
                        </h2>
                        <div className="text-xs font-bold text-purple-400 uppercase">
                            {unlockedCount} / {ACHIEVEMENTS.length} Dibuka
                        </div>
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-purple-200">
                    {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = player.achievements?.includes(ach.id);
                        return (
                            <div 
                                key={ach.id} 
                                className={`
                                    relative p-4 border-4 rounded-sm transition-all flex items-center gap-4
                                    ${isUnlocked ? 'bg-white border-purple-500 roblox-shadow' : 'bg-gray-200 border-gray-300 grayscale'}
                                `}
                            >
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 border-black
                                    ${isUnlocked ? 'bg-yellow-100' : 'bg-gray-300'}
                                `}>
                                    {isUnlocked ? ach.icon : <Lock size={24} className="text-gray-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-lg font-black uppercase leading-tight ${isUnlocked ? 'text-purple-900' : 'text-gray-500'}`}>
                                        {ach.name}
                                    </h3>
                                    <p className="text-sm font-bold text-gray-500 leading-tight">
                                        {ach.desc}
                                    </p>
                                </div>
                                {!isUnlocked && (
                                    <div className="absolute top-2 right-2">
                                        <Lock size={14} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6">
                    <Button onClick={onBack} variant="primary" className="w-full">
                        Tutup
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AchievementView;
