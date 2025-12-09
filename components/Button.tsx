import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "danger" | "success" | "secondary" | "info";
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = "primary", className = "", disabled = false }) => {
  // Changed rounded-xl to rounded-sm, added border-2/4 and roblox-shadow
  const baseStyle = "transform active:translate-y-1 active:shadow-none transition-all font-bold py-3 px-6 rounded-sm border-2 md:border-4 uppercase tracking-wider text-lg md:text-xl select-none touch-manipulation flex items-center justify-center gap-2 roblox-shadow mb-1";
  
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-300 text-black border-black",
    danger: "bg-red-600 hover:bg-red-500 text-white border-black",
    success: "bg-green-500 hover:bg-green-400 text-white border-black",
    secondary: "bg-gray-200 hover:bg-gray-100 text-gray-800 border-black",
    info: "bg-sky-400 hover:bg-sky-300 text-white border-black"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;