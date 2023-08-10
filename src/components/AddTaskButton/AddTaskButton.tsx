const AddTaskButon: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ ...props }) => {
  return (
    <button className="bg-blue-500 border-2 px-3 border-black text-white text-lg font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-blue-600 transition-colors" {...props}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

      </span>

      <span>New task</span>

    </button>
  )
}

export default AddTaskButon;