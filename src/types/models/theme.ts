import { FirestoreDataConverter } from 'firebase/firestore';

type Theme = {
  id: string;
  name: string;
};

const themeConverter: FirestoreDataConverter<Theme> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as Theme;
  },
  toFirestore: (theme: Theme) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = theme;

    return {
      ...data,
    };
  },
};

export { themeConverter };
export type { Theme };
