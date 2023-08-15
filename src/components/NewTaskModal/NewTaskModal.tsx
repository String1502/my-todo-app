import { INBOX_THEME_NAME } from '@/lib/constants';
import { COLLECTION_NAME } from '@/lib/enums/collectionName';
import { db } from '@/lib/firebase';
import useAccount from '@/lib/hooks/useAccount';
import {
  Task,
  TaskRepeatData,
  TaskRepeatDataType,
  taskConverter,
} from '@/lib/models/task';
import { Theme, themeConverter } from '@/lib/models/theme';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import FormLabel from '../FormLabel';
import Modal from '../Modal';
import TextArea from '../TextArea/TextArea';
import TextField from '../TextField';

interface NewTaskModalProps {
  handleClose: () => void;
  open: boolean;
}

const defaultTask: Task = {
  id: '',
  title: '',
  content: '',
  priority: 'normal',
  state: 'undone',
  repeat: false,
  created_at: new Date(),
  tags: [],
};

const NewTaskModal: React.FC<NewTaskModalProps> = ({ handleClose, open }) => {
  //#region States

  const [newTask, setNewTask] = useState<Task>(defaultTask);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [themes, setThemes] = useState<Theme[]>([]);

  const account = useAccount();

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

  const handleNewTaskChange = (name: keyof Task, value: Task[keyof Task]) => {
    setNewTask({ ...newTask, [name]: value });
  };

  const handleRepeatChange = (repeat: boolean) => {
    if (repeat) {
      const repeatData: TaskRepeatData = {
        type: 'day',
        interval: 1,
      };

      setNewTask((prev) => ({
        ...prev,
        repeat_data: repeatData,
        repeat: true,
      }));
    } else {
      setNewTask((prev) => {
        const cloned = { ...prev, repeat: false };
        delete cloned.repeat_data;
        return cloned;
      });
    }
  };

  const handleRepeatTypeChange = (type: TaskRepeatDataType) => {
    const existed = !!newTask.repeat_data;

    const repeat_data: TaskRepeatData = existed
      ? { ...newTask.repeat_data, type }
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

    setNewTask({ ...newTask, repeat_data: repeat_data });
  };

  const handleAdd = async () => {
    if (!account) {
      alert('No account found');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...toAddTask } = newTask;

    let path = '';

    if (selectedTheme) {
      path = `${COLLECTION_NAME.ACCOUNTS}/${account?.id}/${COLLECTION_NAME.THEMES}/${selectedTheme}/${COLLECTION_NAME.TASKS}`;
    } else {
      path = `${COLLECTION_NAME.ACCOUNTS}/${account?.id}/${INBOX_THEME_NAME}`;
    }

    await addDoc(collection(db, path).withConverter(taskConverter), toAddTask);

    handleClose();
  };

  const handleSelectedThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  //#endregion

  return (
    <Modal
      title="New task"
      open={open}
      handleClose={handleClose}
      actions={[
        <button
          className="bg-green-500 border-2 border-black text-white hover:bg-red-600 rounded-lg px-2 font-bold flex justify-between items-center"
          onClick={handleAdd}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </span>
          <span>Add</span>
        </button>,
      ]}
    >
      <div className="flex-col space-y-2">
        <TextField
          id="title"
          value={newTask.title}
          onChange={(e) => handleNewTaskChange('title', e.target.value)}
          name="title"
          label="Title"
          placeholder="Title"
          className="w-full"
        />

        <TextArea
          id="content"
          value={newTask.content}
          onChange={(e) => handleNewTaskChange('content', e.target.value)}
          name="content"
          label="Content"
          placeholder="Content"
          className="w-full"
        />

        <FormLabel htmlFor={'priority'} label={'Priority'}>
          <select
            id="priority"
            value={newTask.priority}
            onChange={(e) => handleNewTaskChange('priority', e.target.value)}
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
            checked={newTask.repeat}
            onChange={(e) => handleRepeatChange(e.target.checked)}
            className="mr-2"
          />
        </FormLabel>

        {newTask.repeat ? (
          <>
            <div
              className={cn('grid ', {
                'grid-cols-2': newTask.repeat_data?.type !== 'custom',
                'gap-5': newTask.repeat_data?.type !== 'custom',
                'grid-rows-2': newTask.repeat_data?.type === 'custom',
                'gap-1': newTask.repeat_data?.type == 'custom',
              })}
            >
              {/* Repeat type */}
              <div className="flex-col space-y-1">
                <label htmlFor="repeatType" className="font-bold text-sm">
                  Type
                </label>
                <select
                  id="repeatType"
                  onChange={(e) =>
                    handleRepeatTypeChange(e.target.value as TaskRepeatDataType)
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

              {newTask.repeat &&
                newTask.repeat_data &&
                newTask.repeat_data.type !== 'custom' && (
                  <>
                    <div className="flex-col space-y-1">
                      <label htmlFor="interval" className="font-bold text-sm">
                        Type
                      </label>
                      <input
                        id="interval"
                        placeholder="Interval"
                        value={newTask.repeat_data?.interval}
                        onChange={(e) =>
                          handleNewTaskChange('repeat_data', {
                            ...newTask.repeat_data,
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
              {newTask.repeat &&
              newTask.repeat_data &&
              newTask.repeat_data.type === 'custom' &&
              newTask.repeat_data.from &&
              newTask.repeat_data.to ? (
                <div className="flex justify-between items-center">
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
                      value={dayjs(newTask.repeat_data.from).format(
                        'YYYY-MM-DD'
                      )}
                      onChange={(e) =>
                        handleNewTaskChange('repeat_data', {
                          ...newTask.repeat_data,
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
                      value={dayjs(newTask.repeat_data.to).format('YYYY-MM-DD')}
                      onChange={(e) =>
                        handleNewTaskChange('repeat_data', {
                          ...newTask.repeat_data,
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
          <select
            id="themeSelect"
            value={selectedTheme}
            onChange={(e) => handleSelectedThemeChange(e.target.value)}
            name="theme"
            className={cn(
              'block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500 w-full'
            )}
          >
            <option value={''} defaultChecked>
              Không
            </option>

            {themes &&
              themes.length > 0 &&
              themes.map((theme) => (
                <option value={theme.id}>{theme.name}</option>
              ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default NewTaskModal;
