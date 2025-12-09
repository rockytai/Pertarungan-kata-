import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  // Removed rounded-xl, added border-4 border-black and roblox-shadow
  <div className={`bg-white border-4 border-black rounded-sm roblox-shadow overflow-hidden ${className}`}>
    {children}
  </div>
);

export default Card;