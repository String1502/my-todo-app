import { db } from '@/firebase';
import { COLLECTION_NAME } from '@/types/enums/collectionName';
import { Task, TaskRepeatData, taskConverter } from '@/types/models/task';
import { clone } from '@/utils/objectData';
import dayjs from 'dayjs';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { INBOX_THEME_NAME } from '../constants/firestorePaths';

/**
 * Returns the reference to the theme or inbox collection based on the given account and task.
 *
 * @param {Account} accountId - The account object.
 * @param {Task} task - The task object.
 * @return {CollectionReference} The reference to the theme or inbox collection.
 */
const getThemeOrInboxRef = (accountId: string, task: Task) => {
  console.log('account:', accountId);
  console.log('task:', task);

  if (task.theme === 'inbox') {
    const ref = collection(db, `${COLLECTION_NAME.ACCOUNTS}/${accountId}/${INBOX_THEME_NAME}`).withConverter(taskConverter);

    console.log('ref:', ref);


    return ref;
  } else {
    const ref = collection(db, `${COLLECTION_NAME.ACCOUNTS}/${accountId}/${COLLECTION_NAME.THEMES}/${task.theme}/${COLLECTION_NAME.TASKS}`).withConverter(taskConverter);

    console.log('ref:', ref);

    return ref;
  }
}

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
 * Resolves the due date for a task based on the current due date and repeat data.
 *
 * @param {Date | undefined} currentDueAt - The current due date for the task.
 * @param {TaskRepeatData | undefined} repeatData - The repeat data for the task.
 * @return {Date | undefined} - The resolved due date for the task.
 */
const resolveDueAt = (currentDueAt: Date | undefined, repeatData: TaskRepeatData | undefined): Date | undefined => {
  if (!currentDueAt || !repeatData) return undefined;

  let dayjsCurrentDueAt = dayjs(currentDueAt);

  if (['day', 'month', 'year', 'week'].includes(repeatData.type)) {
    if (!repeatData.interval) return undefined;

    switch (repeatData.type) {
      case 'day':
        dayjsCurrentDueAt = dayjsCurrentDueAt.add(repeatData.interval, 'day');
        break;
      case 'month':
        dayjsCurrentDueAt = dayjsCurrentDueAt.add(repeatData.interval, 'month');
        break;
      case 'year':
        dayjsCurrentDueAt = dayjsCurrentDueAt.add(repeatData.interval, 'year');
        break;
      case 'week':
        dayjsCurrentDueAt = dayjsCurrentDueAt.add(repeatData.interval, 'week');
        break;
      default:
        break;
    }
  } else if (repeatData.type === 'custom') {
    const tomorrow = dayjs().add(1, 'day');

    if (tomorrow.isAfter(repeatData.from) && tomorrow.isBefore(repeatData.to)) {
      dayjsCurrentDueAt = dayjsCurrentDueAt.add(1, 'day');
    }
  }

  // Add console.log statements for debugging
  console.log("currentDueAt:", currentDueAt);
  console.log("repeatData:", repeatData);
  console.log("dayjsCurrentDueAt:", dayjsCurrentDueAt);

  return dayjsCurrentDueAt.toDate();
}

/**
 * Generates a new task based on the given task, if it is set to repeat.
 *
 * @param {Task} task - The task to repeat.
 * @return {Task | null} - The repeated task, or null if the task is not set to repeat.
 */
const createRepeatTask = (task: Task): Task | null => {
  if (task.repeat && task.repeat_data) {
    const repeatTask: Task = clone(task);

    console.log(repeatTask);

    repeatTask.created_at = new Date();
    repeatTask.due_at = resolveDueAt(repeatTask.due_at, repeatTask.repeat_data);
    repeatTask.state = 'undone';

    console.log(repeatTask.created_at);
    console.log(repeatTask.due_at);

    return repeatTask;
  } else {
    return null;
  }
}

/**
 * Update the state of a task in firestore to 'Done'
 *
 * @param accountId The account id owned by the task
 * @param task The task object to update
 *
 * @throws No account specified
 * @throws No Ttask specified
 */
const taskDone = async (accountId: string, task: Task) => {
  if (!accountId) {
    console.log('No account specified');
    throw new Error('No account specified');
  }
  if (!task) {
    console.log('No task specified');
    throw new Error('No task specified');
  }

  const docRef = getTaskRef(accountId, task);

  const cloneTask: Task = clone(task);

  cloneTask.state = 'done';

  console.log('Updating task in Firestore...');

  try {
    await updateDoc(docRef, cloneTask);
  } catch (error) {
    console.log(error);
  }

  if (cloneTask.repeat) {
    const repeatTask: Task | null = createRepeatTask(cloneTask);

    if (repeatTask) {
      console.log('Adding repeat task to collection...');
      const currentTaskCollectionRef = getThemeOrInboxRef(accountId, cloneTask);

      try {
        const addedTask = await addDoc(currentTaskCollectionRef, repeatTask);

        console.log(addedTask);
      } catch (err) {
        console.log(err);
      }
    }
  }

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

