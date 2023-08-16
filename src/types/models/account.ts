import { FirestoreDataConverter } from 'firebase/firestore';
import { Theme } from './theme';

type Account = {
  id: string;
  themes: string[];
  inbox_theme: Theme;
};

const accountConverter: FirestoreDataConverter<Account> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as Account;
  },
  toFirestore: (account: Account) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = account;

    return {
      ...data,
    };
  },
};

export { accountConverter };
export type { Account };
