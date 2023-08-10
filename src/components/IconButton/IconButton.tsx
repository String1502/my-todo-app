import React from "react";


interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, className }) => {
  return <button className={`text-black transition-colors border-2 border-black rounded-lg relative w-10 h-10 ${className}`}>

    <span className="absolute inset-0 flex items-center justify-center">{icon}</span>

  </button >;
}

export default IconButton;
