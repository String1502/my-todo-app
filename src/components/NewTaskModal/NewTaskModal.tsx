import { COLLECTION_NAME } from "@/lib/enums/collectionName";
import { db } from "@/lib/firebase";
import { accountConverter } from "@/lib/models/account";
import { Task, TaskRepeatData, TaskRepeatDataType } from "@/lib/models/task";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import FormLabel from "../FormLabel";
import TextArea from "../TextArea/TextArea";
import TextField from "../TextField";

interface NewTaskModalProps {
  handleClose: () => void;
}

const defaultTask: Task = {
  id: '',
  title: '',
  content: '',
  priority: 'normal',
  state: 'undone',
  repeat: false,
  created_at: new Date(),
  theme: '',
  tags: [],
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ handleClose }) => {

  const [newTask, setNewTask] = useState<Task>(defaultTask)

  console.log(newTask);

  const handleNewTaskChange = (name: keyof Task, value: Task[keyof Task]) => {
    setNewTask({ ...newTask, [name]: value })
  }

  const handleRepeatChange = (repeat: boolean) => {
    if (repeat) {
      const repeatData: TaskRepeatData = {
        type: 'day',
        interval: 1,
      }

      setNewTask(prev => ({ ...prev, repeat_data: repeatData, repeat: true }));
    } else {
      setNewTask(prev => {
        const cloned = { ...prev, repeat: false };
        delete cloned.repeat_data;
        return cloned;
      })
    }
  }

  const handleRepeatTypeChange = (type: TaskRepeatDataType) => {
    const existed = !!newTask.repeat_data

    const repeat_data: TaskRepeatData = existed ? { ...newTask.repeat_data, type } : { type }

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
  }

  const handleAdd = async () => {
    const { id, ...toAddTask } = newTask;

    const account = await getDoc(doc(collection(db, COLLECTION_NAME.ACCOUNTS).withConverter(accountConverter), 'zlokvCRZwY3q4PJ6euOu'));
    const accountData = account.data();

    console.log(accountData)

    if (accountData && accountData.inbox_theme)
      toAddTask.theme = accountData.inbox_theme;

    const addedTask = await addDoc(collection(db, COLLECTION_NAME.TASKS), toAddTask);

    handleClose();
  }

  return (<div className="fixed inset-0 ">
    <div className="bg-black h-screen w-screen opacity-75 absolute" onClick={handleClose}></div>
    <div className="bg-white w-96 h-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border-4 border-blue-500">

      <div className="h-full w-full grid grid-rows-[auto_minmax(100px,_1fr)_auto] p-4">

        {/* Top */}
        <div>
          <div className="flex justify-between">
            <p className="text-base text-black font-bold">Thêm Task mới</p>

            {
              /* Close button */
            }
            <button className="hover:text-red-500 -mr-1" onClick={handleClose}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          { /* Divider */}
          <div className="my-2">
            <div className="h-0.5 w-full bg-black"></div>
          </div>

        </div>

        {/* Content */}
        <div className="flex-col space-y-2">

          <TextField id='title' value={newTask.title} onChange={(e) => handleNewTaskChange('title', e.target.value)} name='title' label='Title' placeholder="Title" className="w-full" />

          <TextArea id='content' value={newTask.content} onChange={e => handleNewTaskChange('content', e.target.value)} name="content" label='Content' placeholder="Content" className="w-full" />

          <FormLabel htmlFor={"priority"} label={"Priority"}>
            <select id='priority' value={newTask.priority} onChange={e => handleNewTaskChange('priority', e.target.value)} name="priority" className={cn('block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500')}>
              <option value='low'>Low</option>
              <option value='normal'>Normal</option>
              <option value='high'>High</option>
              <option value='critical'>Critical</option>
            </select>
          </FormLabel>

          { /* Divider */}
          <div className="py-2">
            <div className="h-0.5 w-full bg-black/50"></div>
          </div>

          <FormLabel htmlFor={"repeat"} label={"Repeat"} position="end">
            <input id='repeat' type='checkbox' name='repeat' checked={newTask.repeat} onChange={e => handleRepeatChange(e.target.checked)} className="mr-2" />
          </FormLabel>

          {
            newTask.repeat ? <>

              <div className={cn('grid ', {
                'grid-cols-2': newTask.repeat_data?.type !== 'custom',
                'gap-5': newTask.repeat_data?.type !== 'custom',
                'grid-rows-2': newTask.repeat_data?.type === 'custom',
                'gap-1': newTask.repeat_data?.type == 'custom',
              })}>

                {/* Repeat type */}
                <div className="flex-col space-y-1">
                  <label htmlFor='repeatType' className="font-bold text-sm">Type</label>
                  <select id='repeatType' onChange={e => handleRepeatTypeChange(e.target.value as TaskRepeatDataType)} name="repeat" className={cn('block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500 w-full')}>
                    <option value='day'>Day</option>
                    <option value='week'>Week</option>
                    <option value='month'>Month</option>
                    <option value='year'>Year</option>
                    <option value='custom'>Custom</option>
                  </select>
                </div>

                {newTask.repeat && newTask.repeat_data && newTask.repeat_data.type !== 'custom' && <>
                  <div className="flex-col space-y-1">
                    <label htmlFor='interval' className="font-bold text-sm">Type</label>
                    <input id='interval' placeholder='Interval' value={newTask.repeat_data?.interval} onChange={e => handleNewTaskChange('repeat_data', { ...newTask.repeat_data, interval: Number(e.target.value) } as TaskRepeatData)} className={cn('w-full block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500')} type='number' />
                  </div>
                </>}

                {/* From - To Date */}
                {
                  newTask.repeat && newTask.repeat_data && newTask.repeat_data.type === 'custom' && newTask.repeat_data.from && newTask.repeat_data.to ?
                    <div className="flex justify-between items-center">
                      {/* From */}
                      <div className="flex-col space-y-1">
                        <label htmlFor='from' className="font-bold text-sm">From</label>
                        <input id='from' type='date' placeholder="Bắt đầu" className={cn('block outline-none outline-2 rounded-lg px-2 outline-black py-1 focus:outline-blue-500')} value={dayjs(newTask.repeat_data.from).format('YYYY-MM-DD')} onChange={e => handleNewTaskChange('repeat_data', { ...newTask.repeat_data, from: new Date(e.target.value) } as TaskRepeatData)} />
                      </div>

                      <div className="flex justify-center items-center translate-y-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                      </div>

                      {/* To */}
                      <div className="flex-col space-y-1">
                        <label htmlFor='to' className="font-bold text-sm">To</label>
                        <input id='to' type='date' placeholder="Kết thúc" className={cn('block outline-none outline-2 rounded-lg px-2 outline-black py-1 focus:outline-blue-500')} value={dayjs(newTask.repeat_data.to).format('YYYY-MM-DD')} onChange={e => handleNewTaskChange('repeat_data', { ...newTask.repeat_data, to: new Date(e.target.value) } as TaskRepeatData)} />
                      </div>
                    </div>
                    : null}
              </div>

            </> : null
          }

          { /* Divider */}
          <div className="py-2">
            <div className="h-0.5 w-full bg-black/50"></div>
          </div>

        </div>

        {
          /* Buttons */
        }
        <div className="">

          {
            /* Divider */
          }
          <div className="my-2">
            <div className="h-0.5 w-full bg-black"></div>
          </div>

          <div className="flex justify-end items-center gap-1">

            <button className="bg-green-500 border-2 border-black text-white hover:bg-red-600 rounded-lg px-2 font-bold flex justify-between items-center" onClick={handleAdd}>
              <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              </span>
              <span>Add</span>
            </button>

            <button className="bg-red-500 border-2 border-black text-white hover:bg-red-600 rounded-lg px-2 font-bold flex justify-between items-center" onClick={handleClose}>
              <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg></span>
              <span>Close</span>
            </button>

          </div>

        </div>
      </div>

    </div>
  </div >);
}

export default NewTaskModal
