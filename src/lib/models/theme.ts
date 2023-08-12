import { FirestoreDataConverter } from "firebase/firestore";
import { Task } from "./task";

type Theme = {
  id: string;
  name: string;
  tasks: Task[];
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
