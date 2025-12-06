import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "danger" | "success" | "secondary" | "info";
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = "primary", className = "", disabled = false }) => {
  const baseStyle = "transform active:scale-95 transition-transform font-bold py-3 px-6 rounded-xl border-b-4 uppercase tracking-wider text-sm md:text-base select-none touch-manipulation flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-yellow-700",
    danger: "bg-red-500 hover:bg-red-400 text-white border-red-800",
    success: "bg-green-500 hover:bg-green-400 text-white border-green-800",
    secondary: "bg-gray-200 hover:bg-gray-100 text-gray-700 border-gray-400",
    info: "bg-sky-400 hover:bg-sky-300 text-white border-sky-700"
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
