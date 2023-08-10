import { FirestoreDataConverter } from "firebase/firestore";

type Account = {
  id: string;
  themes: string[];
  inbox_theme: string;
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
    return {
      ...account,
    };
  },
};

export { accountConverter };
export type { Account };
