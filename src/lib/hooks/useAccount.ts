import { FirestoreError, doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { COLLECTION_NAME } from '../enums/collectionName';
import { db } from '../firebase';
import { Account, accountConverter } from '../models/account';

const useAccount = (
  accountId: string | undefined
): [Account | undefined, boolean, FirestoreError | undefined] => {
  const query = useMemo(() => {
    if (!accountId) return undefined;

    return doc(db, COLLECTION_NAME.ACCOUNTS, accountId).withConverter(
      accountConverter
    );
  }, [accountId]);

  const [account, loading, error] = useDocumentData(query);

  return [account, loading, error];
};

export default useAccount;
