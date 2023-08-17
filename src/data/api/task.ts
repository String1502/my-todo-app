import { db } from '@/firebase';
import { COLLECTION_NAME } from '@/types/enums/collectionName';
import { Task, taskConverter } from '@/types/models/task';
import { clone } from '@/utils/objectData';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { INBOX_THEME_NAME } from '../constants/firestorePaths';

/**
 * Get the task document reference
 * @param account Account id
 * @param task Task object
 * @returns The task document reference
 *
 * @throws No account specified
 * @throws No Ttask specified
 */
const getTaskRef = (account: string, task: Task) => {
  if (!account) throw new Error('No account specified');
  if (!task) throw new Error('No task specified');

  let docRef;

  if (task.theme === 'inbox') {
    docRef = doc(
      db,
      COLLECTION_NAME.ACCOUNTS,
      account,
      INBOX_THEME_NAME,
      task.id
    );
  } else {
    docRef = doc(
      db,
      COLLECTION_NAME.ACCOUNTS,
      account,
      COLLECTION_NAME.THEMES,
      task.theme,
      COLLECTION_NAME.TASKS,
      task.id
    );
  }

  return docRef.withConverter(taskConverter);
};

/**
 * Delete a task from firestore
 *
 * @param account Account id
 * @param task Task to delete
 *
 * @throws Fail to delete task
 */
const deleteTask = async (account: string, task: Task) => {
  const docRef = getTaskRef(account, task);

  await deleteDoc(docRef);
};

/**
 *
 * Update the state of a task in firestore to 'Done'
 *
 * @param account The account id owned by the task
 * @param task The task object to update
 *
 * @throws No account specified
 * @throws No Ttask specified
 */
const taskDone = async (account: string, task: Task) => {
  if (!account) throw new Error('No account specified');
  if (!task) throw new Error('No task specified');

  const docRef = getTaskRef(account, task);

  const cloneTask: Task = clone(task);

  cloneTask.state = 'done';

  await updateDoc(docRef, cloneTask);
};

/**
 *
 * Update the state of a task in firestore to 'Undone'
 *
 * @param account The account id owned by the task
 * @param task The task object to update
 *
 * @throws No account specified
 * @throws No Ttask specified
 */
const taskUndone = async (account: string, task: Task) => {
  if (!account) throw new Error('No account specified');
  if (!task) throw new Error('No task specified');

  const docRef = getTaskRef(account, task);

  const cloneTask: Task = clone(task);

  cloneTask.state = 'undone';

  await updateDoc(docRef, cloneTask);
};

export { deleteTask, taskDone, taskUndone };
