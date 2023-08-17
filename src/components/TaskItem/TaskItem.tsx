import { deleteTask, taskDone, taskUndone } from '@/data/api/task';
import { db } from '@/firebase';
import useAccountContext from '@/hooks/useAccountContext';
import { COLLECTION_NAME } from '@/types/enums/collectionName';
import { Tag, tagConverter } from '@/types/models/tag';
import { Task } from '@/types/models/task';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

type TaskItemProps = {
  task: Task;
  onClick?: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => {
  //#region States

  const [tags, setTags] = useState<Tag[]>([]);

  const account = useAccountContext();

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

  const handleUndone = async () => {
    if (!account) return;

    try {
      await taskUndone(account?.id, task);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDone = async () => {
    if (!account) return;

    try {
      await taskDone(account?.id, task);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    if (!account) return;

    try {
      await deleteTask(account?.id, task);
    } catch (err) {
      console.log(err);
    }
  };

  //#endregion

  return (
    <section className="flex items-center gap-2 border-2 py-1 px-3 border-black rounded-md hover:bg-zinc-200 hover:cursor-pointer">
      <div className="w-full" onClick={handleClick}>
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

      {/* Button */}

      {task.state === 'done' ? (
        <>
          {/* Undone button */}
          <button
            className="border-2 border-black p-1 rounded-lg bg-yellow-500 
                      hover:bg-yellow-600 active:bg-yellow-500
                      transition-colors"
            onClick={handleUndone}
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
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </button>
        </>
      ) : task.state === 'undone' ? (
        <>
          {/* Done button */}
          <button
            className="border-2 border-black p-1 rounded-lg bg-green-500 
                      hover:bg-green-600 active:bg-green-500
                      transition-colors"
            onClick={handleDone}
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </button>
        </>
      ) : null}

      {/* Delete Button */}
      <button
        className={`border-2 border-black p-1 rounded-lg bg-red-500 
      hover:bg-red-600 active:bg-red-500 transition-colors`}
        onClick={handleDelete}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
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
      </button>
    </section>
  );
};

export default TaskItem;
