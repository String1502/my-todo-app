import { FirestoreDataConverter, Timestamp } from "firebase/firestore";

type TaskPriority = "low" | "normal" | "high" | "critical";

type TaskState = "undone" | "done" | "never";

type TaskRepeatDataType = "day" | "week" | "month" | "year" | "custom";

type TaskRepeatData = {
  type: TaskRepeatDataType;
  from?: Date;
  to?: Date;
  interval?: number;
};

type Task = {
  id: string;
  title: string;
  content: string;
  priority: TaskPriority;
  state: TaskState;
  repeat: boolean;
  repeat_data?: TaskRepeatData;
  created_at: Date;
  due_at?: Date;
  theme: string;
  tags: string[];
};

const taskConverter: FirestoreDataConverter<Task> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);

    const task: Task = {
      id: snapshot.id,
      ...data,
      created_at: data.created_at.toDate(),
    } as Task;

    if (task.due_at && task.due_at instanceof Timestamp) {
      task.due_at = task.due_at.toDate();
    }

    return task;
  },

  toFirestore: (task: Task) => {
    return {
      ...task,
    };
  },
};

export { taskConverter };
export type {
  Task,
  TaskPriority,
  TaskRepeatData,
  TaskRepeatDataType,
  TaskState,
};
