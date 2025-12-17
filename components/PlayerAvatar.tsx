
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

    // --- BASE SHAPES & STYLES ---

    const HeadShape = ({ fill = "#F5CD30", stroke = "black" }) => (
        <rect x="20" y="15" width="60" height="60" rx="12" fill={fill} stroke={stroke} strokeWidth="3" />
    );

    const FaceStandard = () => (
        <g>
            <circle cx="38" cy="40" r="5" fill="black" />
            <circle cx="62" cy="40" r="5" fill="black" />
            <path d="M38 60 Q50 68 62 60" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
    );

    const FaceSmile = () => (
        <g>
            <rect x="35" y="38" width="6" height="8" fill="black" rx="2" />
            <rect x="59" y="38" width="6" height="8" fill="black" rx="2" />
            <path d="M35 58 Q50 68 65 58" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
    );

    const FaceAngry = () => (
        <g>
            <path d="M30 35 L45 40" stroke="black" strokeWidth="3" />
            <path d="M70 35 L55 40" stroke="black" strokeWidth="3" />
            <circle cx="38" cy="45" r="4" fill="black" />
            <circle cx="62" cy="45" r="4" fill="black" />
            <path d="M40 65 Q50 60 60 65" stroke="black" strokeWidth="3" fill="none" />
        </g>
    );

    const FaceRobot = () => (
        <g>
            <rect x="25" y="35" width="50" height="15" fill="#333" rx="2"/>
            <rect x="30" y="38" width="15" height="9" fill="#0ff" className="animate-pulse"/>
            <rect x="55" y="38" width="15" height="9" fill="#0ff" className="animate-pulse"/>
            <rect x="35" y="60" width="30" height="5" fill="#333" />
            <line x1="35" y1="62" x2="65" y2="62" stroke="#0f0" strokeWidth="2" />
        </g>
    );

    // --- AVATAR RENDERER ---

    const renderContent = (type: string) => {
        switch(type) {
            // --- PLAYERS ---
            
            case 'noob': // Classic Noob
                return (
                    <svg viewBox="0 0 100 100" className="bg-blue-600">
                        {/* Blue Torso Background */}
                        <HeadShape fill="#F5CD30" />
                        <FaceStandard />
                    </svg>
                );

            case 'bacon': // Bacon Hair
                return (
                    <svg viewBox="0 0 100 100" className="bg-gray-300">
                        <HeadShape fill="#E0AC69" /> {/* Skin Tone */}
                        <FaceStandard />
                        {/* Bacon Hair Structure */}
                        <path d="M20 15 L80 15 L85 25 L80 40 L70 20 L60 25 L50 15 L40 25 L30 20 L20 40 L15 25 Z" fill="#603515" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                        <rect x="15" y="25" width="10" height="30" fill="#603515" stroke="black" strokeWidth="2" />
                        <rect x="75" y="25" width="10" height="30" fill="#603515" stroke="black" strokeWidth="2" />
                    </svg>
                );

            case 'guest': // Guest (Black Cap)
                return (
                    <svg viewBox="0 0 100 100" className="bg-black">
                        <HeadShape fill="#F2F3F4" /> {/* Pale Skin */}
                        <FaceStandard />
                        {/* Cap */}
                        <path d="M15 25 L85 25 L85 10 L15 10 Z" fill="#111" stroke="black" strokeWidth="2" />
                        <rect x="15" y="20" width="70" height="10" fill="#111" />
                        <rect x="35" y="8" width="30" height="5" fill="#111" />
                        <circle cx="50" cy="18" r="6" fill="#cc0000" /> {/* Roblox Logo */}
                        <rect x="10" y="25" width="80" height="4" fill="#333" /> {/* Brim */}
                    </svg>
                );

            case 'girl_pink':
                return (
                    <svg viewBox="0 0 100 100" className="bg-pink-200">
                        <HeadShape fill="#FFD1DC" />
                        <FaceSmile />
                        {/* Pink Blocky Hair */}
                        <path d="M15 15 L85 15 L90 70 L75 80 L75 30 L25 30 L25 80 L10 70 Z" fill="#FF69B4" stroke="black" strokeWidth="2" />
                        <rect x="15" y="10" width="70" height="20" fill="#FF69B4" stroke="black" strokeWidth="2" />
                    </svg>
                );

            case 'girl_purple':
                return (
                    <svg viewBox="0 0 100 100" className="bg-purple-200">
                        <HeadShape fill="#FFD1DC" />
                        <FaceSmile />
                        {/* Purple Ponytail Style */}
                        <rect x="15" y="10" width="70" height="30" fill="#8B5CF6" stroke="black" strokeWidth="2" />
                        <rect x="10" y="30" width="20" height="50" fill="#8B5CF6" stroke="black" strokeWidth="2" />
                        <rect x="70" y="30" width="20" height="50" fill="#8B5CF6" stroke="black" strokeWidth="2" />
                    </svg>
                );

            case 'cool_boy':
                return (
                    <svg viewBox="0 0 100 100" className="bg-blue-300">
                        <HeadShape fill="#F5CD30" />
                        {/* Hair */}
                        <path d="M15 25 L30 10 L80 15 L85 40 L70 25 L30 25 Z" fill="#222" stroke="black" strokeWidth="2" />
                        {/* Shades */}
                        <g transform="translate(0, 5)">
                            <rect x="25" y="35" width="22" height="12" fill="black" />
                            <rect x="53" y="35" width="22" height="12" fill="black" />
                            <line x1="47" y1="40" x2="53" y2="40" stroke="black" strokeWidth="2" />
                            <line x1="25" y1="38" x2="18" y2="35" stroke="black" strokeWidth="2" />
                            <line x1="75" y1="38" x2="82" y2="35" stroke="black" strokeWidth="2" />
                            <rect x="27" y="37" width="5" height="2" fill="white" opacity="0.5"/>
                            <rect x="55" y="37" width="5" height="2" fill="white" opacity="0.5"/>
                        </g>
                        <path d="M40 65 Q50 70 60 65" stroke="black" strokeWidth="3" fill="none" />
                    </svg>
                );

            case 'boy_blue':
                 return (
                    <svg viewBox="0 0 100 100" className="bg-sky-400">
                        <HeadShape fill="#E0AC69" />
                        <FaceStandard />
                        {/* Blue Cap Backwards */}
                        <path d="M15 20 L85 20 L85 35 L15 35 Z" fill="#1D4ED8" stroke="black" strokeWidth="2" />
                        <rect x="25" y="10" width="50" height="15" fill="#1D4ED8" stroke="black" strokeWidth="2" />
                    </svg>
                );

            case 'ninja':
                return (
                    <svg viewBox="0 0 100 100" className="bg-gray-800">
                        <HeadShape fill="#F5CD30" />
                        {/* Ninja Hood */}
                        <rect x="20" y="15" width="60" height="20" fill="#111" stroke="black" strokeWidth="2" />
                        <rect x="20" y="55" width="60" height="20" fill="#111" stroke="black" strokeWidth="2" />
                        <rect x="15" y="15" width="10" height="60" fill="#111" stroke="black" strokeWidth="2" />
                        <rect x="75" y="15" width="10" height="60" fill="#111" stroke="black" strokeWidth="2" />
                        {/* Eyes */}
                        <g>
                             <path d="M30 40 L45 45" stroke="black" strokeWidth="3" />
                             <path d="M70 40 L55 45" stroke="black" strokeWidth="3" />
                             <circle cx="38" cy="45" r="3" fill="black" />
                             <circle cx="62" cy="45" r="3" fill="black" />
                        </g>
                    </svg>
                );

            case 'knight':
                return (
                    <svg viewBox="0 0 100 100" className="bg-slate-500">
                        {/* Helmet */}
                        <rect x="20" y="15" width="60" height="65" rx="10" fill="#94A3B8" stroke="black" strokeWidth="3" />
                        <rect x="35" y="10" width="30" height="10" fill="#64748B" stroke="black" strokeWidth="2" /> {/* Plume Base */}
                        {/* Visor */}
                        <rect x="25" y="35" width="50" height="30" rx="5" fill="#333" stroke="black" strokeWidth="2" />
                        <line x1="30" y1="45" x2="70" y2="45" stroke="#475569" strokeWidth="2" />
                        <line x1="30" y1="55" x2="70" y2="55" stroke="#475569" strokeWidth="2" />
                        <line x1="50" y1="35" x2="50" y2="65" stroke="#475569" strokeWidth="2" />
                    </svg>
                );

            case 'pirate':
                return (
                    <svg viewBox="0 0 100 100" className="bg-red-800">
                        <HeadShape fill="#E0AC69" />
                        <path d="M38 60 Q50 65 62 60" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <circle cx="38" cy="42" r="4" fill="black" />
                        {/* Eye Patch */}
                        <circle cx="62" cy="42" r="6" fill="black" />
                        <path d="M58 35 L75 30" stroke="black" strokeWidth="2" />
                        {/* Bandana */}
                        <path d="M15 25 L85 25 L85 10 L15 10 Z" fill="#DC2626" stroke="black" strokeWidth="2" />
                        <circle cx="25" cy="18" r="4" fill="white" opacity="0.6" />
                        <circle cx="60" cy="15" r="4" fill="white" opacity="0.6" />
                    </svg>
                );

            case 'wizard':
                return (
                    <svg viewBox="0 0 100 100" className="bg-indigo-900">
                        <HeadShape fill="#E0AC69" />
                        <FaceStandard />
                        {/* Beard */}
                        <path d="M30 65 Q50 90 70 65" fill="white" stroke="gray" strokeWidth="1" />
                        {/* Hat */}
                        <polygon points="10,35 50,-10 90,35" fill="#7C3AED" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                        <rect x="10" y="30" width="80" height="5" fill="#6D28D9" stroke="black" strokeWidth="2" />
                    </svg>
                );

            case 'rich_boy':
                return (
                    <svg viewBox="0 0 100 100" className="bg-yellow-100">
                        <HeadShape fill="#F5CD30" />
                        <FaceSmile />
                        {/* Top Hat */}
                        <rect x="25" y="15" width="50" height="25" fill="black" stroke="black" strokeWidth="2" />
                        <rect x="15" y="35" width="70" height="5" fill="black" stroke="black" strokeWidth="2" />
                        <rect x="25" y="30" width="50" height="5" fill="red" />
                        {/* Monocle */}
                        <circle cx="62" cy="40" r="8" fill="none" stroke="gold" strokeWidth="2" />
                        <line x1="62" y1="48" x2="62" y2="60" stroke="gold" strokeWidth="1" />
                    </svg>
                );

            case 'zombie_survivor':
                return (
                    <svg viewBox="0 0 100 100" className="bg-green-800">
                        <HeadShape fill="#86EFAC" stroke="#166534"/> {/* Zombie Skin */}
                        <g>
                            <circle cx="35" cy="40" r="6" fill="#EF4444" stroke="#7F1D1D"/> {/* Red Eye */}
                            <circle cx="65" cy="40" r="4" fill="black" />
                            <path d="M30 60 Q50 50 70 60" stroke="#166534" strokeWidth="3" fill="none" />
                            <path d="M25 25 L40 30" stroke="#166534" strokeWidth="2" /> {/* Scar */}
                        </g>
                        {/* Bandana */}
                        <rect x="18" y="10" width="64" height="15" fill="#166534" stroke="black" />
                    </svg>
                );

            case 'alien':
                return (
                    <svg viewBox="0 0 100 100" className="bg-green-400">
                         <HeadShape fill="#4ADE80" />
                         {/* Alien Eyes */}
                         <ellipse cx="30" cy="45" rx="10" ry="14" fill="black" stroke="white" strokeWidth="1" />
                         <ellipse cx="70" cy="45" rx="10" ry="14" fill="black" stroke="white" strokeWidth="1" />
                         <path d="M45 75 Q50 78 55 75" stroke="black" strokeWidth="2" fill="none" />
                    </svg>
                );

            case 'robot':
            case 'robot_2':
            case 'mech': // Shared robot style
                 return (
                    <svg viewBox="0 0 100 100" className="bg-slate-400">
                         <HeadShape fill="#94A3B8" />
                         <FaceRobot />
                         <rect x="15" y="30" width="5" height="20" fill="#333" /> {/* Ear Bolts */}
                         <rect x="80" y="30" width="5" height="20" fill="#333" />
                         <line x1="50" y1="15" x2="50" y2="5" stroke="black" strokeWidth="2" />
                         <circle cx="50" cy="5" r="3" fill="red" />
                    </svg>
                );

            case 'cat_hoodie':
                 return (
                    <svg viewBox="0 0 100 100" className="bg-orange-100">
                         {/* Hoodie Background */}
                         <path d="M15 15 L85 15 L85 80 L15 80 Z" fill="#FB923C" stroke="black" strokeWidth="2" />
                         {/* Face Cutout */}
                         <rect x="25" y="25" width="50" height="45" rx="8" fill="#F5CD30" stroke="black" strokeWidth="2" />
                         <g transform="translate(0, 10)">
                            <FaceStandard />
                         </g>
                         {/* Ears */}
                         <path d="M15 15 L35 15 L20 0 Z" fill="#EA580C" stroke="black" strokeWidth="2" />
                         <path d="M85 15 L65 15 L80 0 Z" fill="#EA580C" stroke="black" strokeWidth="2" />
                    </svg>
                );

            // --- ENEMIES & BOSSES (BLOCKY STYLE) ---

            case 'slime': // Si Bulat (Green Slime Cube)
                return (
                    <svg viewBox="0 0 100 100" className="bg-green-500">
                        {/* Slime Cube */}
                        <rect x="15" y="25" width="70" height="60" rx="4" fill="#4ADE80" stroke="#14532D" strokeWidth="3" />
                        {/* Drippy Top */}
                        <path d="M15 25 Q30 35 50 25 Q70 35 85 25" fill="#86EFAC" opacity="0.5" />
                        <g transform="translate(0, 10)">
                            <circle cx="35" cy="40" r="6" fill="black" />
                            <circle cx="65" cy="40" r="6" fill="black" />
                            <path d="M40 55 Q50 60 60 55" stroke="black" strokeWidth="3" fill="none" />
                        </g>
                    </svg>
                );

            case 'panther': // Harimau Kumbang (Blocky Panther)
                return (
                    <svg viewBox="0 0 100 100" className="bg-slate-900">
                         {/* Head */}
                         <rect x="20" y="20" width="60" height="50" rx="8" fill="#1E293B" stroke="black" strokeWidth="3" />
                         {/* Ears */}
                         <polygon points="20,25 35,25 20,10" fill="#1E293B" stroke="black" strokeWidth="2" />
                         <polygon points="80,25 65,25 80,10" fill="#1E293B" stroke="black" strokeWidth="2" />
                         {/* Eyes */}
                         <path d="M25 40 L45 45 L25 50 Z" fill="#EAB308" />
                         <path d="M75 40 L55 45 L75 50 Z" fill="#EAB308" />
                         {/* Nose/Mouth */}
                         <path d="M45 60 L55 60 L50 65 Z" fill="pink" />
                    </svg>
                );

            case 'magma': // Raksasa Api (Blocky Lava)
                return (
                    <svg viewBox="0 0 100 100" className="bg-orange-700">
                         {/* Cracked Rock Head */}
                         <rect x="20" y="15" width="60" height="65" fill="#7F1D1D" stroke="black" strokeWidth="3" />
                         {/* Lava Cracks */}
                         <path d="M20 30 L40 40 L30 50 L50 45 L60 60" stroke="#FACC15" strokeWidth="3" fill="none" />
                         <path d="M80 25 L60 30 L65 40" stroke="#FACC15" strokeWidth="3" fill="none" />
                         {/* Glowing Eyes */}
                         <rect x="30" y="35" width="15" height="10" fill="#FEF08A" className="animate-pulse" />
                         <rect x="55" y="35" width="15" height="10" fill="#FEF08A" className="animate-pulse" />
                    </svg>
                );

            case 'king': // Raja Langit (Blocky King)
                return (
                    <svg viewBox="0 0 100 100" className="bg-purple-800">
                         <HeadShape fill="#FCA5A5" /> {/* Reddish Skin */}
                         <FaceAngry />
                         {/* Crown */}
                         <polygon points="20,25 20,5 35,20 50,5 65,20 80,5 80,25" fill="#FACC15" stroke="black" strokeWidth="2" />
                         <circle cx="50" cy="5" r="3" fill="red" />
                    </svg>
                );
                
            default: // Default fallback (Noob)
                 return (
                    <svg viewBox="0 0 100 100" className="bg-yellow-400">
                        <HeadShape fill="#F5CD30" />
                        <FaceStandard />
                    </svg>
                );
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Stud effect on top for "Lego/Roblox" feel - The Studs */}
            <div className={`absolute -top-[10%] left-[15%] w-[15%] h-[10%] bg-black/10 rounded-full ${size === 'sm' ? 'hidden' : ''}`}></div>
            <div className={`absolute -top-[10%] left-[42%] w-[15%] h-[10%] bg-black/10 rounded-full ${size === 'sm' ? 'hidden' : ''}`}></div>
            <div className={`absolute -top-[10%] left-[70%] w-[15%] h-[10%] bg-black/10 rounded-full ${size === 'sm' ? 'hidden' : ''}`}></div>
            
            <div className={`${sizeClasses[size]} bg-white border-black rounded-sm flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}>
                {renderContent(avatar)}
            </div>
        </div>
    );
};

export default PlayerAvatar;
