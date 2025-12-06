import React from 'react';

interface PlayerAvatarProps {
  avatar: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ avatar, size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-10 h-10 text-xl",
        md: "w-20 h-20 text-4xl",
        lg: "w-32 h-32 text-6xl"
    };
    return (
        <div className={`${sizeClasses[size]} bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-sm ${className}`}>
            {avatar}
        </div>
    );
};

export default PlayerAvatar;
