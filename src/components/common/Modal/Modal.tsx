import React, { forwardRef } from 'react';
import ModalButton from './ModalButton.tsx/ModalButton';

type ModalProps = React.DialogHTMLAttributes<HTMLDialogElement> & {
  children: React.ReactNode;
  actions?: React.ReactNode[];
  onClose: () => void;
};

const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  ({ title, children, actions, onClose }, ref) => {
    return (
      <dialog
        ref={ref}
        className={`bg-white rounded-lg border-4 border-blue-500 p-4
                        max-w-lg z-10 overflow-y-auto w-96 backdrop:bg-black/50`}
        style={{ maxHeight: '80vh' }}
      >
        <div className="flex justify-between">
          <p className="text-base text-black font-bold">{title}</p>
          <button className="hover:text-red-500" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="my-2">
          <div className="h-0.5 w-full bg-black"></div>
        </div>
        <div className="mt-4 mb-6">{children}</div>
        <div className="my-2">
          <div className="h-0.5 w-full bg-black"></div>
        </div>
        <div className="flex justify-end items-center gap-1">
          {actions}
          <ModalButton onClick={onClose}>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
            <span>Close</span>
          </ModalButton>
        </div>
      </dialog>
    );
  }
);

export default Modal;
