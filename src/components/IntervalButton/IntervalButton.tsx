import { IntervalState } from "@/lib/types/IntervalState";
import { ButtonHTMLAttributes } from "react";

interface IntervalButtonProps {
  icon?: React.ReactNode;
  content: string;
  selected?: IntervalState;
  intervalValue: IntervalState;
}

const IntervalButton: React.FC<IntervalButtonProps & ButtonHTMLAttributes<HTMLButtonElement>> = ({ icon, content, selected, intervalValue, ...props }) => {
  return (
    <button className={`border-2 border-black rounded-lg px-1 text-black font-bold text-lg hover:bg-blue-500 transition-colors hover:text-white flex justify-center items-center gap-2 ${selected && selected === intervalValue && 'bg-blue-500 text-white'}`} {...props}>
      {icon && <span>
        {icon}
      </span>}

      <span>{content}</span>

    </button >

  )
}

export default IntervalButton;