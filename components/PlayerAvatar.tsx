import React from 'react';

interface PlayerAvatarProps {
  avatar: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ avatar, size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-12 h-12 border-2",
        md: "w-24 h-24 border-4",
        lg: "w-36 h-36 border-4"
    };

    // --- SVG Generators ---
    
    // Standard "Roblox" Face
    const Face = () => (
      <g>
         <path d="M35 55 Q50 70 65 55" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
         <circle cx="35" cy="40" r="4" fill="black" />
         <circle cx="65" cy="40" r="4" fill="black" />
      </g>
    );

    const AngryFace = () => (
      <g>
         <path d="M35 60 Q50 50 65 60" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
         <path d="M25 35 L40 40" stroke="black" strokeWidth="3" />
         <path d="M75 35 L60 40" stroke="black" strokeWidth="3" />
         <circle cx="35" cy="45" r="3" fill="black" />
         <circle cx="65" cy="45" r="3" fill="black" />
      </g>
    );
    
    const RobotFace = () => (
      <g>
        <rect x="25" y="35" width="20" height="15" fill="#0ff" stroke="black" strokeWidth="2" />
        <rect x="55" y="35" width="20" height="15" fill="#0ff" stroke="black" strokeWidth="2" />
        <rect x="30" y="60" width="40" height="10" fill="gray" stroke="black" strokeWidth="2" />
        <line x1="30" y1="65" x2="70" y2="65" stroke="black" />
        <line x1="40" y1="60" x2="40" y2="70" stroke="black" />
        <line x1="50" y1="60" x2="50" y2="70" stroke="black" />
        <line x1="60" y1="60" x2="60" y2="70" stroke="black" />
      </g>
    );

    const renderContent = (type: string) => {
        switch(type) {
            // --- PLAYERS ---
            case 'noob':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-yellow-400">
                        <Face />
                        {/* Blue Shirt Collar */}
                        <path d="M0 90 Q50 100 100 90 L100 100 L0 100 Z" fill="#3b82f6" />
                    </svg>
                );
            case 'bacon':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#fde047]">
                        {/* Bacon Hair */}
                        <path d="M0 20 Q50 -10 100 20 L100 50 L90 40 L80 50 L20 50 L10 40 L0 50 Z" fill="#78350f" />
                        <rect x="0" y="0" width="100" height="20" fill="#78350f" />
                        <Face />
                    </svg>
                );
            case 'guest':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-white">
                        {/* Guest Cap */}
                        <rect x="0" y="0" width="100" height="30" fill="#1f2937" />
                        <rect x="10" y="30" width="80" height="5" fill="#1f2937" />
                        <circle cx="50" cy="15" r="10" fill="#dc2626" />
                        <path d="M0 100 L0 90 Q50 100 100 90 L100 100 Z" fill="black" />
                        <Face />
                    </svg>
                );
            case 'girl_pink':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#fde047]">
                        {/* Pink Hair */}
                        <path d="M0 0 L100 0 L100 80 L80 60 L20 60 L0 80 Z" fill="#f472b6" />
                        <rect x="0" y="0" width="100" height="30" fill="#f472b6" />
                        <Face />
                    </svg>
                );
            case 'cool_boy':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#fde047]">
                         {/* Shades */}
                        <path d="M0 0 L100 0 L100 40 L0 40 Z" fill="#1e3a8a" />
                        <rect x="20" y="40" width="25" height="15" fill="black" />
                        <rect x="55" y="40" width="25" height="15" fill="black" />
                        <line x1="45" y1="45" x2="55" y2="45" stroke="black" strokeWidth="2" />
                        <path d="M35 70 Q50 80 65 70" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                );
             case 'ninja':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-gray-900">
                        <rect x="10" y="30" width="80" height="25" fill="#fde047" rx="5" />
                        <circle cx="35" cy="42" r="4" fill="black" />
                        <circle cx="65" cy="42" r="4" fill="black" />
                    </svg>
                );
            case 'knight':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-gray-400">
                        {/* Helm */}
                        <rect x="20" y="30" width="60" height="10" fill="black" rx="2" />
                        <rect x="45" y="30" width="10" height="40" fill="black" rx="2" />
                    </svg>
                );
             case 'wizard':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#fde047]">
                        <polygon points="10,30 50,-10 90,30" fill="#7c3aed" />
                        <rect x="10" y="30" width="80" height="10" fill="#6d28d9" />
                        <path d="M20 70 Q50 100 80 70" fill="white" stroke="gray" />
                        <Face />
                    </svg>
                );
            case 'rich_boy':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#fde047]">
                         {/* Top Hat */}
                        <rect x="20" y="20" width="60" height="10" fill="black" />
                        <rect x="30" y="0" width="40" height="20" fill="black" />
                        <rect x="30" y="15" width="40" height="5" fill="red" />
                        <Face />
                        <path d="M20 90 Q50 100 80 90" stroke="gold" strokeWidth="5" fill="none"/>
                    </svg>
                );
             case 'zombie_survivor':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#86efac]">
                        <rect x="10" y="10" width="80" height="10" fill="#166534" />
                        <path d="M35 55 Q50 70 65 55" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round" />
                        <circle cx="30" cy="40" r="6" fill="red" />
                        <circle cx="70" cy="40" r="4" fill="black" />
                    </svg>
                );

            // --- ENEMIES & BOSSES ---
            case 'slime':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-green-500">
                         {/* Slime Drip */}
                         <path d="M20 0 L20 20 Q35 10 50 20 Q65 10 80 20 L80 0 Z" fill="#22c55e" />
                         <circle cx="30" cy="40" r="8" fill="black" />
                         <circle cx="70" cy="40" r="8" fill="black" />
                         <path d="M40 60 Q50 70 60 60" stroke="black" strokeWidth="3" fill="none" />
                    </svg>
                );
            case 'panther':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-slate-900">
                         <polygon points="10,10 30,30 0,40" fill="black" />
                         <polygon points="90,10 70,30 100,40" fill="black" />
                         <circle cx="30" cy="45" r="5" fill="yellow" />
                         <circle cx="70" cy="45" r="5" fill="yellow" />
                         <path d="M45 65 L55 65 L50 75 Z" fill="pink" />
                         <path d="M40 80 Q50 90 60 80" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                );
            case 'mech':
            case 'robot':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-gray-300">
                         <RobotFace />
                    </svg>
                );
            case 'magma':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-orange-600">
                         <path d="M0 0 L20 30 L40 10 L60 30 L80 10 L100 30 L100 0 Z" fill="#ef4444" />
                         <rect x="20" y="40" width="20" height="10" fill="yellow" />
                         <rect x="60" y="40" width="20" height="10" fill="yellow" />
                         <path d="M30 70 Q50 60 70 70 Q50 90 30 70 Z" fill="black" />
                    </svg>
                );
            case 'king':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-purple-600">
                         <polygon points="10,30 30,50 50,20 70,50 90,30 90,0 10,0" fill="gold" />
                         <AngryFace />
                         <rect x="20" y="40" width="60" height="5" fill="white" opacity="0.5" />
                    </svg>
                );
                
            default: // Default Noob
                 return (
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-yellow-400">
                        <Face />
                    </svg>
                );
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Stud effect on top for "Lego/Roblox" feel */}
            <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-black/20 rounded-t-[2px] ${size === 'sm' ? 'hidden' : ''}`}></div>
            
            <div className={`${sizeClasses[size]} bg-white border-black rounded-sm flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}>
                {renderContent(avatar)}
            </div>
        </div>
    );
};

export default PlayerAvatar;