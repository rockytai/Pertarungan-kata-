import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-amber-50 border-b-8 border-r-4 border-amber-800 rounded-xl shadow-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

export default Card;
