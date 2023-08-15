import AddTaskButon from '@/components/AddTaskButton/AddTaskButton';
import IntervalButtonBar from '@/components/IntervalButtonBar';
import { auth } from '@/lib/firebase';
import useAccountContext from '@/lib/hooks/useAccountContext';
import useThemes from '@/lib/hooks/useThemes';
import { Task } from '@/lib/models/task';
import IntervalState from '@/lib/types/IntervalState';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import ThemeAccordion from '../ThemeAccordion';
import ViewTaskModal from '../ViewTaskModal';

type ThemesDisplayerProps = {
  handleAddTask: () => void;
};

const ThemesDisplayer: React.FC<ThemesDisplayerProps> = ({ handleAddTask }) => {
  //#region States

  const [user, userLoading, userError] = useAuthState(auth);
  const [selectedIntervalState, setSelectedIntervalState] =
    useState<IntervalState>('inbox');

  const account = useAccountContext();

  // const [themes, setThemes] = useState<Theme[]>([]);
  const [themes, themesLoading, themesError] = useThemes(account?.id);

  const [viewTaskModalOpen, setViewTaskModalOpen] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskTheme, setSelectedThemeTask] = useState<string>('');

  //#endregion

  //#region UseEffects

  //#endregion

  //#region Handlers

  const handleIntervalOptionChange = (intervalValue: IntervalState) => {
    if (intervalValue) {
      setSelectedIntervalState(intervalValue);
    }
  };

  const handleTaskClick = (task: Task, theme: string) => {
    setViewTaskModalOpen(true);
    setSelectedTask(task);
    setSelectedThemeTask(theme);
  };

  const handleViewTaskModalClose = () => {
    setViewTaskModalOpen(false);
    setSelectedTask(null);
    setSelectedThemeTask('');
  };

  //#endregion

  if (userLoading)
    return (
      <p id="loginPleaseText" className="text-center font-bold text-lg">
        Loading...
      </p>
    );

  if (userError)
    return (
      <p id="loginPleaseText" className="text-center font-bold text-lg">
        Vui lòng đăng nhập để sử dụng
      </p>
    );

  return (
    <>
      {user ? (
        <>
          <section id="toolBar" className="flex justify-between items-center">
            <IntervalButtonBar
              value={selectedIntervalState}
              onChange={handleIntervalOptionChange}
            />

            <AddTaskButon onClick={handleAddTask} />
          </section>

          <div
            id="toolBarDivider"
            className="w-full h-1 bg-slate-900 my-2 space-y-2"
          ></div>

          <ul className="flex-col space-y-2">
            {themes && themes.length > 0
              ? themes.map((theme) => (
                  <li key={theme.id} className="flex-col space-y-1">
                    <ThemeAccordion
                      theme={theme}
                      onTaskClick={handleTaskClick}
                    />
                  </li>
                ))
              : null}

            <li key={'inbox'}>
              <ThemeAccordion onTaskClick={handleTaskClick} inbox />
            </li>
          </ul>
        </>
      ) : (
        <>
          <p id="loginPleaseText" className="text-center font-bold text-lg">
            Vui lòng đăng nhập để sử dụng
          </p>
        </>
      )}

      {selectedTask && (
        <ViewTaskModal
          open={viewTaskModalOpen}
          handleClose={handleViewTaskModalClose}
          task={selectedTask}
          theme={selectedTaskTheme}
        />
      )}
    </>
  );
};

export default ThemesDisplayer;
