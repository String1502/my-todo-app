import cn from '@/utils/tailwind';
import React, { ButtonHTMLAttributes } from 'react';

type ModalButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ModalButton: React.FC<ModalButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        className,
        `bg-red-500 border-2 border-black text-white 
      hover:bg-red-600
       rounded-lg px-2 font-bold flex justify-between items-center`
      )}
    >
      {children}
    </button>
  );
};

export default ModalButton;
