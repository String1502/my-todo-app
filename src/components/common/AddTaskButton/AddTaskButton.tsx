type AddTaskButtonProps = {
  title: string;
};

const AddTaskButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & AddTaskButtonProps
> = ({ title, ...props }) => {
  return (
    <button
      className="flex items-center justify-center gap-1 px-3 text-lg font-bold text-white transition-colors bg-blue-500 border-2 border-black rounded-lg hover:bg-blue-600"
      {...props}
    >
      <span>
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </span>

      <span>{title}</span>
    </button>
  );
};

export default AddTaskButton;
