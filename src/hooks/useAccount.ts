import { FirestoreError, doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { COLLECTION_NAME } from '../types/enums/collectionName';
import { Account, accountConverter } from '../types/models/account';

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
