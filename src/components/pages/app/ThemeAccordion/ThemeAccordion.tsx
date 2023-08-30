import TaskItem from '@/components/pages/app/TaskItem';
import { deleteTheme } from '@/data/api/theme';
import useAccountContext from '@/hooks/useAccountContext';
import useIntervalState from '@/hooks/useIntervalState';
import useTasks from '@/hooks/useTasks';
import { ThemeContext } from '@/hooks/useThemeContext';
import { Task } from '@/types/models/task';
import { Theme } from '@/types/models/theme';
import { colorRandomizer } from '@/utils/style';
import { cn } from '@/utils/tailwind';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import DoneAccordion from './DoneAccordion';

type AccordionProps = {
  theme?: Theme;
  onTaskClick?: (task: Task, theme: string) => void;
  inbox?: boolean;
  addTask: (theme?: string | undefined) => void;
};

const ThemeAccordion: React.FC<AccordionProps> = ({
  theme,
  onTaskClick,
  inbox = false,
  addTask,
}) => {
  //#region States
  const [open, setOpen] = useState<boolean>(false);

  const account = useAccountContext();
  const [tasks] = useTasks(account?.id, inbox, theme?.id);

  const intervalState = useIntervalState();

  //#endregion

  //#region UseCallbacks

  const stateFilterCallback = useCallback(
    (task: Task): boolean => {
      switch (intervalState) {
        case 'all':
          return true;
        case 'today':
          return dayjs(task.due_at).isSame(dayjs(), 'day');
        case 'tomorrow':
          return dayjs(task.due_at).isSame(dayjs().add(1, 'day'), 'day');
        case 'next-7-days':
          return (
            dayjs(task.due_at).isAfter(dayjs()) &&
            dayjs(task.due_at).isBefore(dayjs().add(7, 'day'))
          );
        default:
          return false;
      }
    },
    [intervalState]
  );

  //#endregion

  //#region UseMemos

  const [undoneTasks, doneTasks]: [Task[], Task[], Task[]] = useMemo(() => {
    if (!tasks) return [[], [], []];

    const stateFilteredTasks = tasks.filter(stateFilterCallback);

    return [
      stateFilteredTasks.filter((task) => task.state === 'undone'),
      stateFilteredTasks.filter((task) => task.state === 'done'),
      stateFilteredTasks.filter((task) => task.state === 'never'),
    ];
  }, [tasks, stateFilterCallback]);

  const background: string = useMemo(() => `bg-${colorRandomizer()}`, []);

  //#endregion

  //#region Handlers

  const handleToggle = () => {
    setOpen((open) => !open);
  };

  const handleTaskClick = (task: Task) => {
    console.log('run');

    onTaskClick && onTaskClick(task, theme ? theme.id : 'inbox');
  };

  /**
   * Handle delete theme
   */
  const handleDeleteTheme = async () => {
    if (!account) return;
    if (!theme) return;

    const confirmDelete = window.confirm('Are you sure?');

    if (confirmDelete) {
      try {
        await deleteTheme(account?.id, theme.id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  //#endregion

  return (
    <ThemeContext.Provider value={theme ?? null}>
      {theme || inbox ? (
        <article>
          <div
            className={cn(
              `flex justify-between items-center border-2 border-black py-1 
              px-3 peer hover:cursor-pointer`,
              background
            )}
            aria-expanded={!open}
          >
            <div
              className="flex items-center w-full gap-2"
              onClick={handleToggle}
            >
              <p className="text-lg font-bold ">
                {theme ? theme.name : inbox ? 'Inbox' : ''}
              </p>

              <p>
                <span className="font-medium text-md">Tasks: </span>
                {undoneTasks ? undoneTasks.length : 0}
              </p>
            </div>

            {/* Action zone */}
            <div className="flex items-center gap-1">
              <div className="flex gap-1 mr-2">
                <button
                  className="flex gap-1 p-1 font-bold text-white bg-green-500 border-2 border-black rounded-lg hover:bg-green-600 active:bg-green-500"
                  onClick={() => addTask(inbox ? 'inbox' : theme?.id)}
                >
                  <p className="whitespace-nowrap">Add Task</p>
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
                </button>
                {inbox ? null : (
                  <button
                    className="flex gap-1 p-1 font-bold text-white bg-red-500 border-2 border-black rounded-lg hover:bg-red-600 active:bg-red-500"
                    onClick={handleDeleteTheme}
                  >
                    <p className="whitespace-nowrap">Delete</p>
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </span>
                  </button>
                )}
              </div>

              {/* Toggle Chevron */}
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
          </div>

          <div
            className={cn(
              `border-2 border-black py-1 border-t-0 peer-aria-expanded:hidden px-3`
            )}
          >
            {undoneTasks && undoneTasks.length > 0 ? (
              <ul className="grid grid-flow-row gap-2">
                {undoneTasks &&
                  undoneTasks.length > 0 &&
                  undoneTasks.map((task) => (
                    <li key={task.id}>
                      <TaskItem
                        task={task}
                        onClick={() => handleTaskClick(task)}
                      />
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm font-bold text-center">
                This theme has no tasks
              </p>
            )}
          </div>

          {/* Done tasks */}
          <DoneAccordion tasks={doneTasks} />
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
