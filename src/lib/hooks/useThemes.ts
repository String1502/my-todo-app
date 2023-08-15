import { COLLECTION_NAME } from '@/lib/enums/collectionName';
import { db } from '@/lib/firebase';
import { FirestoreError, collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Theme, themeConverter } from '../models/theme';

const useThemes = (
  accountId: string | undefined
): [Theme[] | undefined, boolean, FirestoreError | undefined] => {
  const query = useMemo(() => {
    if (!accountId) return undefined;

    const query = `${COLLECTION_NAME.ACCOUNTS}/${accountId}/${COLLECTION_NAME.THEMES}`;

    return collection(db, query).withConverter(themeConverter);
  }, [accountId]);

  const [themes, loading, error] = useCollectionData<Theme>(query, {
    initialValue: [],
  });

  return [themes, loading, error];
};

export default useThemes;
