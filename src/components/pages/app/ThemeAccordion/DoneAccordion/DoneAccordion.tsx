import TaskItem from '@/components/pages/app/TaskItem';
import { Task } from '@/types/models/task';
import cn from '@/utils/tailwind';
import React, { useState } from 'react';

type DoneAccordionProps = {
  tasks: Task[];
  taskClick?: (task: Task) => void;
};

const DoneAccordion: React.FC<DoneAccordionProps> = ({ tasks, taskClick }) => {
  //#region States

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  //#endregion

  //#region Handlers

  const handleTaskClick = (task: Task) => taskClick && taskClick(task);
  const handleAccordionToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  //#endregion

  return (
    <div
      className={cn(
        `border-2 border-black py-1 border-t-0 peer-aria-expanded:hidden px-3 group bg-yellow-100`
      )}
      aria-expanded={isExpanded}
    >
      <div className="flex justify-center items-center">
        <div
          className="border-2 border-black bg-blue-500 
              hover:bg-blue-600 active:bg-blue-500 rounded-full px-6
              font-bold text-white text-sm hover:cursor-pointer
              flex justify-center items-center gap-1
              transtiion-colors"
          onClick={handleAccordionToggle}
        >
          <span>Done Task</span>
          <span className="group-aria-expanded:-rotate-90 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Done Accordion Content */}
      <div className="hidden group-aria-expanded:block">
        {/* Divider */}
        <div className="bg-black w-1/2 my-1 h-0.5 mx-auto opacity-75"></div>

        {/* Done tasks */}
        {tasks && tasks.length > 0 ? (
          <ul className="grid grid-flow-row gap-2">
            {tasks &&
              tasks.length > 0 &&
              tasks.map((task) => (
                <li key={task.id}>
                  <TaskItem
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    className="bg-white"
                  />
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-center font-bold text-sm">No finished tasks</p>
        )}
      </div>
    </div>
  );
};

export default DoneAccordion;
