import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { COLLECTION_NAME } from '../types/enums/collectionName';
import { Account, accountConverter } from '../types/models/account';

const useAccount = (
  accountId: string | undefined
): ReturnType<typeof useDocumentData<Account>> => {
  const query = useMemo(() => {
    if (!accountId) return undefined;

    const query = doc(db, COLLECTION_NAME.ACCOUNTS, accountId).withConverter(
      accountConverter
    );

    return query;
  }, [accountId]);

  const result = useDocumentData(query);

  return result;
};

export default useAccount;
