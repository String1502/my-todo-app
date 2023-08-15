import React from 'react';

type ModalProps = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  open?: boolean;
  handleClose?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  actions,
  open,
  handleClose: paramHandleClose,
}) => {
  const handleClose = () => paramHandleClose && paramHandleClose();

  return (
    <>
      {open && (
        <article className="fixed inset-0 ">
          <div
            className="bg-black h-screen w-screen opacity-75 absolute"
            onClick={handleClose}
          ></div>
          <div className="bg-white w-96 h-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border-4 border-blue-500">
            <div className="h-full w-full grid grid-rows-[auto_minmax(100px,_1fr)_auto] p-4">
              {/* Top */}
              <div>
                <div className="flex justify-between">
                  <p className="text-base text-black font-bold">{title}</p>

                  {/* Close button */}
                  <button
                    className="hover:text-red-500 -mr-1"
                    onClick={handleClose}
                  >
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

                {/* Divider */}
                <div className="my-2">
                  <div className="h-0.5 w-full bg-black"></div>
                </div>
              </div>

              {/* Content */}
              {children}

              {/* Buttons */}
              <div className="">
                {/* Divider */}
                <div className="my-2">
                  <div className="h-0.5 w-full bg-black"></div>
                </div>

                <div className="flex justify-end items-center gap-1">
                  {actions}

                  <button
                    className="bg-red-500 border-2 border-black text-white hover:bg-red-600 rounded-lg px-2 font-bold flex justify-between items-center"
                    onClick={handleClose}
                  >
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
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      )}
    </>
  );
};

export default Modal;
