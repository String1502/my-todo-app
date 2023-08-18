import { useRef } from 'react';

const TestZone = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpenDialog = () => dialogRef.current?.showModal();
  const handleCloseDialog = () => dialogRef.current?.close();

  return (
    <>
      <div className="p-2">
        <button onClick={handleOpenDialog}>Open</button>

        <dialog ref={dialogRef} className="bg-black/75">
          <p>Hello</p>
          <button onClick={handleCloseDialog}>Close</button>
        </dialog>
      </div>
    </>
  );
};

export default TestZone;
