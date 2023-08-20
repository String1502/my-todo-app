import ModalButton from '@/components/common/Modal/ModalButton.tsx/ModalButton';

const Toast: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="absolute left-6 bottom-6 bg-blue-500 
    border-2 border-black rounded-lg p-1 font-bold text-white px-3
    w-96"
    >
      <span className="float-left">{children}</span>
      <button className="float-right ml-2">&times;</button>
    </div>
  );
};

const TestZone = () => {
  return (
    <>
      <div className="p-2">
        <ModalButton>Hello</ModalButton>
        <Toast>Hello people</Toast>
      </div>
    </>
  );
};

export default TestZone;
