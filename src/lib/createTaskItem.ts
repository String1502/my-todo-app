import { TaskItemProps } from "@/components/TaskItem/TaskItem";
import { collection, doc, getDoc } from "firebase/firestore";
import { COLLECTION_NAME } from "./enums/collectionName";
import { db } from "./firebase";
import { Tag, tagConverter } from "./models/tag";
import { Task } from "./models/task";
import { themeConverter } from "./models/theme";

export const createTaskItem = async (task: Task) => {
  if (!task) throw new Error("Task is required");

  const themeQuery = doc(collection(db, COLLECTION_NAME.THEMES), task.theme);
  const theme = await getDoc(themeQuery.withConverter(themeConverter));

  const tagsQuery = task.tags.map((tag) =>
    doc(collection(db, COLLECTION_NAME.TAGS), tag).withConverter(tagConverter)
  );
  const potentialTags = await Promise.allSettled(
    tagsQuery.map(async (tag) => await getDoc(tag))
  );
  const tags: Tag[] = [];

  potentialTags.forEach((item) => {
    if (item.status === "fulfilled") {
      const data = item.value.data();
      data && tags.push(data);
    }
  });

  const props: TaskItemProps = {
    task: task,
    theme: theme.data(),
    tags: tags,
  };

  return props;
};
