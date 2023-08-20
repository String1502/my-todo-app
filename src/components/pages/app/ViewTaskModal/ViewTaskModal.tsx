import Modal from '@/components/common/Modal';
import TextArea from '@/components/common/TextArea/TextArea';
import TextField from '@/components/common/TextField';
import { INBOX_THEME_NAME } from '@/data/constants/firestorePaths';
import { db } from '@/firebase';
import useAccountContext from '@/hooks/useAccountContext';
import { COLLECTION_NAME } from '@/types/enums/collectionName';
import { Task, TaskRepeatData, TaskRepeatDataType } from '@/types/models/task';
import { Theme, themeConverter } from '@/types/models/theme';
import { cn } from '@/utils/tailwind';
import dayjs from 'dayjs';
import {
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { forwardRef, useEffect, useState } from 'react';
import FormLabel from '../../../common/FormLabel';

type ViewTaskModalProps = {
  task: Task;
  theme: string;
  taskChanged: boolean;
  onTaskChange: (name: keyof Task, value: Task[keyof Task]) => void;
  onRepeatChange: (repeat: boolean) => void;
  onRepeatTypeChange: (type: TaskRepeatDataType) => void;
  onSaveChanges: () => void;
  onClose: () => void;
};

const ViewTaskModalProps = forwardRef<HTMLDialogElement, ViewTaskModalProps>(
  (
    {
      taskChanged,
      onTaskChange,
      onRepeatChange,
      onRepeatTypeChange,
      onSaveChanges,
      onClose,
      task,
      theme,
    },
    ref
  ) => {
    //#region States

    const [themes, setThemes] = useState<Theme[]>([]);

    const account = useAccountContext();

    const [isAddTheme, setIsAddTheme] = useState<boolean>(false);
    const [newThemeName, setNewThemeName] = useState<string>('');

    //#endregion

    //#region UseEffect

    useEffect(() => {
      const getData = async () => {
        if (!account) return;

        const themesPath = `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${COLLECTION_NAME.THEMES}`;
        const themesSnapshot = await getDocs(
          collection(db, themesPath).withConverter(themeConverter)
        );

        const themes: Theme[] = [];

        themesSnapshot.forEach((theme) => {
          if (theme.exists()) {
            themes.push(theme.data());
          }
        });

        setThemes(themes);
      };

      getData();
    }, [account]);

    //#endregion

    //#region Handlers

    const handleDeleteTask = async () => {
      if (!account) {
        alert('No account found.');
        return;
      }

      console.log(task);

      let docRef: DocumentReference;

      try {
        if (theme === 'inbox') {
          docRef = doc(
            db,
            COLLECTION_NAME.ACCOUNTS,
            account.id,
            INBOX_THEME_NAME,
            task.id
          );
        } else {
          docRef = doc(
            db,
            COLLECTION_NAME.ACCOUNTS,
            account.id,
            COLLECTION_NAME.THEMES,
            task.theme,
            COLLECTION_NAME.TASKS,
            task.id
          );
        }

        await deleteDoc(docRef);
      } catch (error) {
        console.log(error);
        return;
      }

      onClose && onClose();
    };

    const handleToggleAddTheme = () => {
      setIsAddTheme((prev) => !prev);
    };

    const handleAddTheme = () => {
      if (!newThemeName) {
        alert('Please enter theme name');
        return;
      }

      const path = `${COLLECTION_NAME.ACCOUNTS}/${account?.id}/${COLLECTION_NAME.THEMES}`;
      const collectionRef = collection(db, path);

      const data: Omit<Theme, 'id'> = {
        name: newThemeName,
      };

      addDoc(collectionRef, data);
    };

    const handleThemeNameChange = (value: string) => {
      setNewThemeName(value);
    };

    //#endregion

    return (
      <Modal
        title={'Task Detail'}
        onClose={onClose}
        actions={[
          <button
            key="save-btn"
            className={cn(
              `bg-green-500 border-2 border-black text-white 
                hover:bg-green-600 gap-1
                  rounded-lg px-2 font-bold flex justify-between items-center
                  disabled:bg-gray-500`
            )}
            onClick={onSaveChanges}
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
        ref={ref}
      >
        {task && (
          <div className="flex-col space-y-2">
            <TextField
              id="title"
              value={task.title}
              onChange={(e) => onTaskChange('title', e.target.value)}
              name="title"
              label="Title"
              placeholder="Title"
              className="w-full"
            />

            <TextArea
              id="content"
              value={task.content}
              onChange={(e) => onTaskChange('content', e.target.value)}
              name="content"
              label="Content"
              placeholder="Content"
              className="w-full"
            />

            <FormLabel htmlFor={'priority'} label={'Priority'}>
              <select
                id="priority"
                value={task.priority}
                onChange={(e) => onTaskChange('priority', e.target.value)}
                name="priority"
                className={cn(
                  'block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500'
                )}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </FormLabel>

            {/* Divider */}
            <div className="py-2">
              <div className="h-0.5 w-full bg-black/50"></div>
            </div>

            <FormLabel htmlFor={'repeat'} label={'Repeat'} position="end">
              <input
                id="repeat"
                type="checkbox"
                name="repeat"
                checked={task.repeat}
                onChange={(e) => onRepeatChange(e.target.checked)}
                className="mr-2"
              />
            </FormLabel>

            {task.repeat ? (
              <>
                <div
                  className={cn('grid ', {
                    'grid-cols-2': task.repeat_data?.type !== 'custom',
                    'gap-5': task.repeat_data?.type !== 'custom',
                    'grid-rows-2': task.repeat_data?.type === 'custom',
                    'gap-1': task.repeat_data?.type == 'custom',
                  })}
                >
                  {/* Repeat type */}
                  <div className="flex-col space-y-1">
                    <label htmlFor="repeatType" className="font-bold text-sm">
                      Type
                    </label>
                    <select
                      id="repeatType"
                      value={task.repeat_data?.type}
                      onChange={(e) =>
                        onRepeatTypeChange(e.target.value as TaskRepeatDataType)
                      }
                      name="repeat"
                      className={cn(
                        'block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500 w-full'
                      )}
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {task.repeat &&
                    task.repeat_data &&
                    task.repeat_data.type !== 'custom' && (
                      <>
                        <div className="flex-col space-y-1">
                          <label
                            htmlFor="interval"
                            className="font-bold text-sm"
                          >
                            Interval
                          </label>
                          <input
                            id="interval"
                            placeholder="Interval"
                            value={task.repeat_data?.interval}
                            onChange={(e) =>
                              onTaskChange('repeat_data', {
                                ...task.repeat_data,
                                interval: Number(e.target.value),
                              } as TaskRepeatData)
                            }
                            className={cn(
                              'w-full block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500'
                            )}
                            type="number"
                          />
                        </div>
                      </>
                    )}

                  {/* From - To Date */}
                  {task.repeat &&
                  task.repeat_data &&
                  task.repeat_data.type === 'custom' &&
                  task.repeat_data.from &&
                  task.repeat_data.to ? (
                    <div className="flex justify-between items-center space-x-1">
                      {/* From */}
                      <div className="flex-col space-y-1">
                        <label htmlFor="from" className="font-bold text-sm">
                          From
                        </label>
                        <input
                          id="from"
                          type="date"
                          placeholder="Bắt đầu"
                          className={cn(
                            'block outline-none outline-2 rounded-lg px-2 outline-black py-1 focus:outline-blue-500'
                          )}
                          value={dayjs(task.repeat_data.from).format(
                            'YYYY-MM-DD'
                          )}
                          onChange={(e) =>
                            onTaskChange('repeat_data', {
                              ...task.repeat_data,
                              from: new Date(e.target.value),
                            } as TaskRepeatData)
                          }
                        />
                      </div>

                      <div className="flex justify-center items-center translate-y-3">
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
                            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                          />
                        </svg>
                      </div>

                      {/* To */}
                      <div className="flex-col space-y-1">
                        <label htmlFor="to" className="font-bold text-sm">
                          To
                        </label>
                        <input
                          id="to"
                          type="date"
                          placeholder="Kết thúc"
                          className={cn(
                            'block outline-none outline-2 rounded-lg px-2 outline-black py-1 focus:outline-blue-500'
                          )}
                          value={dayjs(task.repeat_data.to).format(
                            'YYYY-MM-DD'
                          )}
                          onChange={(e) =>
                            onTaskChange('repeat_data', {
                              ...task.repeat_data,
                              to: new Date(e.target.value),
                            } as TaskRepeatData)
                          }
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {/* Divider */}
            <div className="py-2">
              <div className="h-0.5 w-full bg-black/50"></div>
            </div>

            {/* Theme option */}
            <div className="flex-col space-y-1">
              <label htmlFor="themeSelect" className="font-bold text-sm">
                Theme
              </label>

              <div className="flex items-center justify-between space-x-2">
                <select
                  id="themeSelect"
                  value={task.theme}
                  onChange={(e) => onTaskChange('theme', e.target.value)}
                  name="theme"
                  className={cn(
                    'block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500 w-full'
                  )}
                >
                  <option key="inbox" value={'inbox'} defaultChecked>
                    Inbox
                  </option>

                  {themes &&
                    themes.length > 0 &&
                    themes.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                </select>

                <button
                  className={cn(
                    ' border-2 border-black rounded-lg transition-colors p-1',
                    {
                      'bg-green-500 hover:bg-green-700 active:bg-green-500':
                        !isAddTheme,
                      'bg-yellow-500 hover:bg-yellow-700 active:bg-yellow-500':
                        isAddTheme,
                    }
                  )}
                  onClick={handleToggleAddTheme}
                >
                  {isAddTheme ? (
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
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
                  )}
                </button>
              </div>
            </div>

            {isAddTheme && (
              <div className="flex-col space-y-1">
                <label htmlFor="newThemeName" className="font-bold text-sm">
                  Theme name
                </label>
                <div className="flex items-center justify-between space-x-2">
                  <TextField
                    id="newThemeName"
                    type="text"
                    value={newThemeName}
                    onChange={(e) => handleThemeNameChange(e.target.value)}
                    placeholder="Theme name"
                    className="w-full"
                  />

                  <button
                    className={cn(
                      ' border-2 border-black rounded-lg transition-colors p-1 bg-green-500 hover:bg-green-700 active:bg-green-500'
                    )}
                    onClick={handleAddTheme}
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Delete Button */}
            <button
              className="bg-red-500 hover:bg-red-600 active:bg-red-500
            border-2 border-black p-1 rounded-lg text-white font-bold w-full
            flex justify-center items-center gap-1"
              onClick={handleDeleteTask}
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </span>
              <span>Delete</span>
            </button>
          </div>
        )}
      </Modal>
    );
  }
);

export default ViewTaskModalProps;
