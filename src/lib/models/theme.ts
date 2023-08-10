import { FirestoreDataConverter } from "firebase/firestore";

type Theme = {
  id: string;
  name: string;
  tasks: string[];
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
    return {
      ...theme,
    };
  },
};

export { themeConverter };
export type { Theme };
