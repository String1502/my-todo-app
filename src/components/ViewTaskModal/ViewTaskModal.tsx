import Modal from '@/components/Modal';
import TextArea from '@/components/TextArea/TextArea';
import TextField from '@/components/TextField';
import { COLLECTION_NAME } from '@/lib/enums/collectionName';
import { db } from '@/lib/firebase';
import useAccount from '@/lib/hooks/useAccount';
import { Task, TaskRepeatData, TaskRepeatDataType } from '@/lib/models/task';
import { Theme, themeConverter } from '@/lib/models/theme';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { collection, getDocs } from 'firebase/firestore';
import { ComponentProps, FC, useEffect, useState } from 'react';
import FormLabel from '../FormLabel';

type ViewTaskModal = Omit<
  ComponentProps<typeof Modal>,
  'title' | 'children'
> & {
  task: Task;
  theme: string;
};

const ViewTaskModal: FC<ViewTaskModal> = ({
  open,
  actions,
  handleClose,
  task: paramTask,
  theme,
}) => {
  //#region States

  const [task, setTask] = useState<Task>(paramTask);
  const [selectedTheme, setSelectedTheme] = useState<string>(theme);
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

  const handleTaskChange = (name: keyof Task, value: Task[keyof Task]) => {
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleRepeatChange = (repeat: boolean) => {
    if (repeat) {
      const repeatData: TaskRepeatData = {
        type: 'day',
        interval: 1,
      };

      setTask((prev) => ({
        ...prev,
        repeat_data: repeatData,
        repeat: true,
      }));
    } else {
      setTask((prev) => {
        const cloned = { ...prev, repeat: false };
        delete cloned.repeat_data;
        return cloned;
      });
    }
  };

  const handleRepeatTypeChange = (type: TaskRepeatDataType) => {
    const existed = !!task.repeat_data;

    const repeat_data: TaskRepeatData = existed
      ? { ...task.repeat_data, type }
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

    setTask({ ...task, repeat_data: repeat_data });
  };

  const handleSelectedThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  //#endregion

  return (
    <Modal
      title={'Task Detail'}
      open={open}
      handleClose={handleClose}
      actions={actions}
    >
      {task && (
        <div className="flex-col space-y-2">
          <TextField
            id="title"
            value={task.title}
            onChange={(e) => handleTaskChange('title', e.target.value)}
            name="title"
            label="Title"
            placeholder="Title"
            className="w-full"
          />

          <TextArea
            id="content"
            value={task.content}
            onChange={(e) => handleTaskChange('content', e.target.value)}
            name="content"
            label="Content"
            placeholder="Content"
            className="w-full"
          />

          <FormLabel htmlFor={'priority'} label={'Priority'}>
            <select
              id="priority"
              value={task.priority}
              onChange={(e) => handleTaskChange('priority', e.target.value)}
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
              onChange={(e) => handleRepeatChange(e.target.checked)}
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
                    onChange={(e) =>
                      handleRepeatTypeChange(
                        e.target.value as TaskRepeatDataType
                      )
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
                        <label htmlFor="interval" className="font-bold text-sm">
                          Type
                        </label>
                        <input
                          id="interval"
                          placeholder="Interval"
                          value={task.repeat_data?.interval}
                          onChange={(e) =>
                            handleTaskChange('repeat_data', {
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
                        value={dayjs(task.repeat_data.from).format(
                          'YYYY-MM-DD'
                        )}
                        onChange={(e) =>
                          handleTaskChange('repeat_data', {
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
                        value={dayjs(task.repeat_data.to).format('YYYY-MM-DD')}
                        onChange={(e) =>
                          handleTaskChange('repeat_data', {
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
            <select
              id="themeSelect"
              value={selectedTheme}
              onChange={(e) => handleSelectedThemeChange(e.target.value)}
              name="theme"
              className={cn(
                'block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500 w-full'
              )}
            >
              <option key="none" value={''} defaultChecked>
                None
              </option>

              {themes &&
                themes.length > 0 &&
                themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewTaskModal;
