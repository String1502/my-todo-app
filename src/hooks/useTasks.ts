import { INBOX_THEME_NAME } from '@/data/constants/firestorePaths';
import { FirestoreError, collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { COLLECTION_NAME } from '../types/enums/collectionName';
import { Task, taskConverter } from '../types/models/task';

const useTasks = (
  accountId: string | undefined,
  inbox: boolean = false,
  themeId?: string | undefined
): [Task[] | undefined, boolean, FirestoreError | undefined] => {
  const query = useMemo(() => {
    if (!accountId || (!themeId && !inbox)) return undefined;

    const query = inbox
      ? `${COLLECTION_NAME.ACCOUNTS}/${accountId}/${INBOX_THEME_NAME}`
      : `${COLLECTION_NAME.ACCOUNTS}/${accountId}/${COLLECTION_NAME.THEMES}/` +
        `${themeId}/${COLLECTION_NAME.TASKS}`;

    const collectionRef = collection(db, query).withConverter(taskConverter);

    return collectionRef;
  }, [accountId, themeId, inbox]);

  const [tasks, loading, error] = useCollectionData(query, {
    initialValue: [],
  });

  return [tasks, loading, error];
};

export default useTasks;
