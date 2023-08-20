import AddTaskButon from '@/components/common/AddTaskButton/AddTaskButton';
import IntervalButtonBar from '@/components/pages/app/IntervalButtonBar';
import NewThemeModal from '@/components/pages/app/NewThemeModal';
import ThemeAccordion from '@/components/pages/app/ThemeAccordion';
import ViewTaskModal from '@/components/pages/app/ViewTaskModal';
import { INBOX_THEME_NAME } from '@/data/constants/firestorePaths';
import { auth, db } from '@/firebase';
import useAccountContext from '@/hooks/useAccountContext';
import useThemes from '@/hooks/useThemes';
import IntervalState from '@/types/IntervalState';
import { COLLECTION_NAME } from '@/types/enums/collectionName';
import {
  Task,
  TaskRepeatData,
  TaskRepeatDataType,
  taskConverter,
} from '@/types/models/task';
import { clone, deepEqual } from '@/utils/objectData';
import dayjs from 'dayjs';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useMemo, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

type ThemesDisplayerProps = {
  handleAddTask: () => void;
  addTask: (theme?: string | undefined) => void;
};

const ThemesDisplayer: React.FC<ThemesDisplayerProps> = ({
  handleAddTask,
  addTask,
}) => {
  //#region States
  const [user, userLoading, userError] = useAuthState(auth);
  const [selectedIntervalState, setSelectedIntervalState] =
    useState<IntervalState>('inbox');

  const account = useAccountContext();

  const [themes] = useThemes(account?.id);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskTheme, setSelectedThemeTask] = useState<string>('');

  const [cachedSelectedTask, setCachedSelectedTask] = useState<Task | null>(
    null
  );

  //#endregion

  //#region Refs

  const viewTaskModalRef = useRef<HTMLDialogElement>(null);
  const newThemeModalRef = useRef<HTMLDialogElement>(null);

  //#endregion

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
    setSelectedTask(clone(task));
    setCachedSelectedTask(clone(task));
    setSelectedThemeTask(theme);
  };

  const handleViewTaskModalClose = () => {
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

  const handleTaskChange = (name: keyof Task, value: Task[keyof Task]) => {
    setSelectedTask((prev) => {
      return prev ? { ...prev, [name]: value } : null;
    });
  };

  const handleRepeatChange = (repeat: boolean) => {
    if (repeat) {
      const repeatData: TaskRepeatData = {
        type: 'day',
        interval: 1,
      };

      setSelectedTask((prev) => {
        return prev
          ? {
              ...prev,
              repeat_data: repeatData,
              repeat: true,
            }
          : null;
      });
    } else {
      setSelectedTask((prev) => {
        if (!prev) return null;

        const cloned = { ...prev, repeat: false };
        delete cloned.repeat_data;
        return cloned;
      });
    }
  };

  const handleRepeatTypeChange = (type: TaskRepeatDataType) => {
    if (!selectedTask) return;

    const existed = !!selectedTask.repeat_data;

    const repeat_data: TaskRepeatData = existed
      ? { ...selectedTask.repeat_data, type }
      : { type };

    if (existed) {
      if (type === 'custom') {
        const now = dayjs();
        repeat_data.from = now.toDate();
        repeat_data.to = now.add(7, 'day').toDate();
        delete repeat_data.interval;
      } else {
        repeat_data.interval = 1;
        delete repeat_data.from;
        delete repeat_data.to;
      }
    }

    setSelectedTask((prev) => {
      if (!prev) return null;

      return { ...prev, repeat_data: repeat_data };
    });
  };

  const handleOpenNewThemeModal = () => newThemeModalRef.current?.showModal();
  const handleCloseNewThemeModal = () => newThemeModalRef.current?.close();

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

            <div className="flex gap-1">
              <AddTaskButon
                title="Add theme"
                onClick={handleOpenNewThemeModal}
              />
              <AddTaskButon title="Add task" onClick={handleAddTask} />
            </div>
          </section>

          {themes && themes.length > 0 && (
            <div
              id="toolBarDivider"
              className="w-full h-1 bg-slate-900 my-2 space-y-2"
            ></div>
          )}

          <ul className="flex-col space-y-2">
            {themes && themes.length > 0
              ? themes.map((theme) => (
                  <li key={theme.id} className="flex-col space-y-1">
                    <ThemeAccordion
                      theme={theme}
                      onTaskClick={handleTaskClick}
                      addTask={addTask}
                    />
                  </li>
                ))
              : null}

            <li key={'inbox'}>
              <div className="py-1 pb-2">
                <div className="w-full bg-black h-1 mt-2"></div>
              </div>

              <ThemeAccordion
                onTaskClick={handleTaskClick}
                addTask={addTask}
                inbox
              />
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
          ref={viewTaskModalRef}
          onClose={handleViewTaskModalClose}
          task={selectedTask}
          theme={selectedTaskTheme}
          taskChanged={taskChanged}
          onTaskChange={handleTaskChange}
          onSaveChanges={handleSaveTaskChanges}
          onRepeatChange={handleRepeatChange}
          onRepeatTypeChange={handleRepeatTypeChange}
        />
      )}

      <NewThemeModal
        onClose={handleCloseNewThemeModal}
        ref={newThemeModalRef}
      />
    </>
  );
};

export default ThemesDisplayer;
