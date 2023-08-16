import TaskItem from '@/components/TaskItem';
import useAccountContext from '@/hooks/useAccountContext';
import useTasks from '@/hooks/useTasks';
import { ThemeContext } from '@/hooks/useThemeContext';
import { Task } from '@/types/models/task';
import { Theme } from '@/types/models/theme';
import { cn } from '@/utils/tailwind';
import React, { useState } from 'react';

type AccordionProps = {
  theme?: Theme;
  onTaskClick?: (task: Task, theme: string) => void;
  inbox?: boolean;
};

const ThemeAccordion: React.FC<AccordionProps> = ({
  theme,
  onTaskClick,
  inbox = false,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const account = useAccountContext();
  const [tasks, tasksLoading, setTasksLoading] = useTasks(
    account?.id,
    inbox,
    theme?.id
  );

  const handleToggle = () => {
    setOpen((open) => !open);
  };

  const handleTaskClick = (task: Task) => {
    onTaskClick && onTaskClick(task, theme ? theme.id : '');
  };

  return (
    <ThemeContext.Provider value={theme ?? null}>
      {theme || inbox ? (
        <article>
          <div
            className={cn(
              `flex justify-between items-center border-2 border-black py-1 px-3 peer`
            )}
            aria-expanded={open}
            onClick={handleToggle}
          >
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold ">
                {theme ? theme.name : inbox ? 'Inbox' : ''}
              </p>
              <p>
                <span className="text-md font-medium">Tasks: </span>
                {tasks ? tasks.length : 0}
              </p>
            </div>

            <div
              className={cn({ '-rotate-90': !open }, 'transition-transform')}
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </div>
          </div>

          <div
            className={cn(
              `border-2 border-black py-1 border-t-0 peer-aria-expanded:hidden px-3`
            )}
          >
            {tasks && tasks.length > 0 ? (
              <ul className="grid grid-flow-row gap-2">
                {tasks &&
                  tasks.length > 0 &&
                  tasks.map((task) => (
                    <li key={task.id}>
                      <TaskItem
                        task={task}
                        onClick={() => handleTaskClick(task)}
                      />
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-center font-bold text-sm">
                This theme has no tasks
              </p>
            )}
          </div>
        </article>
      ) : (
        <div className="p-1 border-2 border-black">
          <p className="text-lg font-bold">Theme not found</p>
        </div>
      )}
    </ThemeContext.Provider>
  );
};

export default ThemeAccordion;
