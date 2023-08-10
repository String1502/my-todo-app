import IconButton from "@/components/IconButton";
import { Tag } from "@/lib/models/tag";
import { Task } from "@/lib/models/task";
import { Theme } from "@/lib/models/theme";
import { useMemo } from "react";

type TaskItemProps = {
  task: Task;
  theme?: Theme
  tags?: Tag[],
}

const TaskItem: React.FC<TaskItemProps> = ({ task, theme, tags }) => {

  const taskStateClass = useMemo(() => {

    switch (task.state) {
      case 'undone':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'done':
        return 'bg-green-500 hover:bg-green-600'
      case 'never':
        return 'bg-red-500 hover:bg-red-600'
    }

  }, [task.state])

  return (
    <li className="flex w-full p-2 transition-colors bg-blue-500 border-4 border-black rounded-lg cursor-pointer hover:bg-blue-600">

      {/* Task content */}
      <div className="flex-col w-full space-y-2">
        <p className="font-bold text-white hover:text-slate-300">{task.title}</p>
        <p className="text-sm font-bold text-slate-200 hover:text-slate-400">{task.content}</p>

        <div className="flex items-center gap-2">

          <div className={`w-4 h-4 border-2 border-black rounded-full ${taskStateClass}`}></div>

          {theme && <p className="text-sm font-bold text-slate-200 hover:text-slate-400">{theme.name}</p>}

          {tags && tags.length > 0 &&
            tags.map(tag => <p key={tag.id} className="text-sm font-bold text-slate-200 hover:text-slate-400">#{tag.name}</p>)
          }

          {task.due_at && <p className="text-sm font-bold text-slate-200 hover:text-slate-400">Due: {new Date(task.due_at).toLocaleDateString()}</p>}
        </div>

      </div>


      {/* Buttons */}
      <div className="flex items-center gap-3">
        <IconButton icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        } className="bg-green-500 hover:bg-green-600" />

        <IconButton icon={<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>} className="bg-yellow-500 hover:bg-yellow-600" />

        <IconButton icon={<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        } className="bg-red-500 hover:bg-red-600" />
      </div>

    </li >
  )
}

export type { TaskItemProps };
export default TaskItem;
