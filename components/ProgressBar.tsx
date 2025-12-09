import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  color: string;
  reverse?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, color, reverse = false }) => {
  const percent = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    // Square corners, thick border
    <div className="w-full relative h-6 md:h-8 bg-gray-900 rounded-sm border-2 border-black overflow-hidden shadow-lg">
      <div 
        className={`h-full transition-all duration-300 ease-out ${color} ${reverse ? 'float-right' : ''}`} 
        style={{ width: `${percent}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-white roblox-text-shadow tracking-widest select-none z-10 font-mono">
         HP: {Math.ceil(current)}/{max}
      </div>
    </div>
  );
};

export default ProgressBar;