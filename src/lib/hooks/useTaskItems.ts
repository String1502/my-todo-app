import { TaskItemProps } from "@/components/TaskItem/TaskItem";
import { COLLECTION_NAME } from "@/lib/enums/collectionName";
import { db } from "@/lib/firebase";
import { Task, taskConverter } from "@/lib/models/task";
import { FirestoreError, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { createTaskItem } from "../createTaskItem";

export const taskQuery = collection(db, COLLECTION_NAME.TASKS).withConverter(
  taskConverter
);

export const useTaskItems = (): [
  TaskItemProps[],
  boolean,
  FirestoreError | undefined
] => {
  const [tasks, loading, error] = useCollectionData<Task>(taskQuery, {
    initialValue: [],
  });

  const [taskItemPropsList, setTaskItemPropsList] = useState<TaskItemProps[]>(
    []
  );

  useEffect(() => {
    const mapTasksToTaskItemPropsList = async () => {
      if (loading || error || !tasks) {
        setTaskItemPropsList([]);
      }

      if (tasks) {
        const mappedTasks = await Promise.allSettled(
          tasks.map((task) => {
            const props = createTaskItem(task);

            return props;
          })
        );

        const finals: TaskItemProps[] = [];

        mappedTasks.forEach((item) => {
          if (item.status === "fulfilled") {
            finals.push(item.value);
          }
        });

        setTaskItemPropsList(finals);
      }
    };

    mapTasksToTaskItemPropsList();
  }, [tasks, loading, error]);

  return [taskItemPropsList, loading, error];
};
