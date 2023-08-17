import AddTaskButon from '@/components/AddTaskButton/AddTaskButton';
import IntervalButtonBar from '@/components/IntervalButtonBar';
import { INBOX_THEME_NAME } from '@/data/constants/firestorePaths';
import { auth, db } from '@/firebase';
import useAccountContext from '@/hooks/useAccountContext';
import useThemes from '@/hooks/useThemes';
import IntervalState from '@/types/IntervalState';
import { COLLECTION_NAME } from '@/types/enums/collectionName';
import { Task, taskConverter } from '@/types/models/task';
import { clone, deepEqual } from '@/utils/objectData';
import { cn } from '@/utils/tailwind';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useMemo, useState } from 'react';
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
  const [themes] = useThemes(account?.id);

  const [viewTaskModalOpen, setViewTaskModalOpen] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskTheme, setSelectedThemeTask] = useState<string>('');

  const [cachedSelectedTask, setCachedSelectedTask] = useState<Task | null>(
    null
  );

  //#region UseEffects

  //#endregion

  //#region UseMemos

  const taskChanged = useMemo(() => {
    const changed = !deepEqual(selectedTask, cachedSelectedTask);

    return changed;
  }, [selectedTask, cachedSelectedTask]);

  //#endregion

  //#region Handlers

  const handleIntervalOptionChange = (intervalValue: IntervalState) => {
    if (intervalValue) {
      setSelectedIntervalState(intervalValue);
    }
  };

  const handleTaskClick = (task: Task, theme: string) => {
    setViewTaskModalOpen(true);
    setSelectedTask(clone(task));
    setCachedSelectedTask(clone(task));
    setSelectedThemeTask(theme);
  };

  const handleViewTaskModalClose = () => {
    setViewTaskModalOpen(false);
    setSelectedTask(null);
    setCachedSelectedTask(null);
    setSelectedThemeTask('');
  };

  const handleSaveTaskChanges = async () => {
    if (!account) return;

    const data: Task = clone(selectedTask);

    if (cachedSelectedTask?.theme === 'inbox') {
      const docRef = doc(
        db,
        `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${INBOX_THEME_NAME}/${data.id}`
      ).withConverter(taskConverter);

      if (data.theme === 'inbox') {
        try {
          await updateDoc(docRef, data);
        } catch (error) {
          console.log(error);
          return;
        }
      } else {
        try {
          await deleteDoc(docRef);
        } catch (error) {
          console.log(error);
          return;
        }

        try {
          const themeCollectionRef = collection(
            db,
            `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${COLLECTION_NAME.THEMES}/${data.theme}/${COLLECTION_NAME.TASKS}`
          ).withConverter(taskConverter);

          await addDoc(themeCollectionRef, data);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      const docRef = doc(
        db,
        `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${COLLECTION_NAME.THEMES}/${cachedSelectedTask?.theme}/${COLLECTION_NAME.TASKS}/${data.id}`
      ).withConverter(taskConverter);

      if (data.theme === 'inbox') {
        try {
          await deleteDoc(docRef);
        } catch (error) {
          console.log(error);
          return;
        }

        try {
          const inboxCollectionRef = collection(
            db,
            `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${INBOX_THEME_NAME}`
          ).withConverter(taskConverter);
          await addDoc(inboxCollectionRef, data);
        } catch (error) {
          console.log(error);
          return;
        }
      } else {
        if (data.theme === cachedSelectedTask?.theme) {
          try {
            await updateDoc(docRef, data);
          } catch (error) {
            console.log(error);
            return;
          }
        } else {
          try {
            await deleteDoc(docRef);
          } catch (error) {
            console.log(error);
            return;
          }

          try {
            const themeCollectionRef = collection(
              db,
              `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${COLLECTION_NAME.THEMES}/${data.theme}/${COLLECTION_NAME.TASKS}`
            ).withConverter(taskConverter);

            await addDoc(themeCollectionRef, data);
          } catch (error) {
            console.log(error);
            return;
          }
        }
      }
    }

    handleViewTaskModalClose();
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
          setTask={setSelectedTask}
          theme={selectedTaskTheme}
          actions={[
            <button
              key="save-btn"
              className={cn(
                `bg-green-500 border-2 border-black text-white 
                hover:bg-green-600 gap-1
                  rounded-lg px-2 font-bold flex justify-between items-center
                  disabled:bg-gray-500`
              )}
              onClick={handleSaveTaskChanges}
              disabled={!taskChanged}
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
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </span>
              <span>Save</span>
            </button>,
          ]}
        />
      )}
    </>
  );
};

export default ThemesDisplayer;
