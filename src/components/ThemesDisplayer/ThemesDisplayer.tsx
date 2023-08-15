import AddTaskButon from '@/components/AddTaskButton/AddTaskButton';
import IntervalButtonBar from '@/components/IntervalButtonBar';
import { INBOX_THEME_NAME } from '@/lib/constants';
import { COLLECTION_NAME } from '@/lib/enums/collectionName';
import { auth, db } from '@/lib/firebase';
import useAccount from '@/lib/hooks/useAccount';
import { Task, taskConverter } from '@/lib/models/task';
import { Theme, themeConverter } from '@/lib/models/theme';
import IntervalState from '@/lib/types/IntervalState';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import ThemeAccordion from '../ThemeAccordion';
import ViewTaskModal from '../ViewTaskModal';

type ThemesDisplayerProps = {
  handleAddTask: () => void;
};

const ThemesDisplayer: React.FC<ThemesDisplayerProps> = ({ handleAddTask }) => {
  const [user, userLoading, userError] = useAuthState(auth);
  const [selectedIntervalState, setSelectedIntervalState] =
    useState<IntervalState>('inbox');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [inboxTheme, setInboxTheme] = useState<Task[]>([]);

  const [viewTaskModalOpen, setViewTaskModalOpen] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskTheme, setSelectedThemeTask] = useState<string>('');

  const account = useAccount();

  //#region UseEffects

  useEffect(() => {
    const getData = async () => {
      if (!account) return;

      try {
        const inboxTasks = await getDocs(
          collection(
            db,
            `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${INBOX_THEME_NAME}`
          ).withConverter(taskConverter)
        );

        const tasks: Task[] = [];

        inboxTasks.forEach((task) => {
          if (task.exists()) {
            tasks.push(task.data());
          }
        });

        setInboxTheme(tasks);
      } catch (error) {
        console.log(error);
      }

      // Theme part
      try {
        const themePath = `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${COLLECTION_NAME.THEMES}`;

        const themeSnapshot = await getDocs(
          collection(db, themePath).withConverter(themeConverter)
        );

        const themes: Theme[] = [];

        for (const theme of themeSnapshot.docs) {
          if (theme.exists()) {
            const data = theme.data();

            const taskPath = `${COLLECTION_NAME.ACCOUNTS}/${account!.id}/${
              COLLECTION_NAME.THEMES
            }/${theme.id}/${COLLECTION_NAME.TASKS}`;
            const tasksSnapshot = await getDocs(
              collection(db, taskPath).withConverter(taskConverter)
            );

            const tasks: Task[] = [];

            tasksSnapshot.forEach((task) => {
              if (task.exists()) {
                tasks.push(task.data());
              }
            });

            data.tasks = tasks;

            themes.push(data);
          }
        }

        setThemes(themes);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [account]);

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
            {inboxTheme?.length > 0 ? (
              <li key={'inbox'}>
                <ThemeAccordion
                  theme={{ id: '', name: 'Inbox', tasks: inboxTheme }}
                />
              </li>
            ) : null}
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
          handleClose={() => setViewTaskModalOpen(false)}
          task={selectedTask}
          theme={selectedTaskTheme}
        />
      )}
    </>
  );
};

export default ThemesDisplayer;
