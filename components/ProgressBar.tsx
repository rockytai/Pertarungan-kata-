import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  color: string;
  label: string;
  reverse?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, color, label, reverse = false }) => {
  const percent = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="w-full relative h-6 bg-gray-900 rounded-full border-2 border-gray-700 overflow-hidden shadow-lg">
      <div 
        className={`h-full transition-all duration-500 ease-out ${color} ${reverse ? 'float-right' : ''}`} 
        style={{ width: `${percent}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-black drop-shadow-md tracking-wider select-none z-10">
        {label}: {Math.ceil(current)}/{max}
      </div>
    </div>
  );
};

export default ProgressBar;
