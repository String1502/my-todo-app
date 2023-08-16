import { FirestoreDataConverter } from "firebase/firestore";

type Tag = {
  id: string;
  name: string;
};

const tagConverter: FirestoreDataConverter<Tag> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as Tag;
  },
  toFirestore: (tag: Tag) => {
    return {
      ...tag,
    };
  },
};

export { tagConverter };
export type { Tag };
