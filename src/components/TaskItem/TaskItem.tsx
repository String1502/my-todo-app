import { COLLECTION_NAME } from '@/lib/enums/collectionName';
import { db } from '@/lib/firebase';
import useAccount from '@/lib/hooks/useAccount';
import { Tag, tagConverter } from '@/lib/models/tag';
import { Task } from '@/lib/models/task';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

type TaskItemProps = {
  task: Task;
  onClick?: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => {
  //#region States

  const [tags, setTags] = useState<Tag[]>([]);

  const account = useAccount();

  //#endregion

  //#region useEffect

  useEffect(() => {
    const getData = async () => {
      if (!account) return;

      const paths = task.tags.map(
        (tag) =>
          `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${COLLECTION_NAME.TAGS}/${tag}`
      );

      const tagSnapshot = await Promise.all(
        paths.map(
          async (path) =>
            await getDoc(doc(db, path).withConverter(tagConverter))
        )
      );

      const tags: Tag[] = [];

      tagSnapshot.forEach((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          data && tags.push(data);
        }
      });

      setTags(tags);
    };

    getData();
  }, [account, task.tags]);

  //#endregion

  //#region Handlers

  const handleClick = () => onClick && onClick();

  //#endregion

  return (
    <section
      className="border-2 py-1 px-3 border-black rounded-md hover:bg-zinc-200 hover:cursor-pointer"
      onClick={handleClick}
    >
      <div>
        <div className="flex justify-between items-center py-1">
          <p className="font-medium">{task.title}</p>

          <div className="flex gap-1">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="rounded-full border-2 border-black p-1"
              >
                <p>#{tag.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black h-0.5"></div>

        <p>{task.content}</p>
      </div>
    </section>
  );
};

export default TaskItem;
