import { COLLECTION_NAME } from "@/lib/enums/collectionName";
import { db } from "@/lib/firebase";
import { FirestoreError, collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Theme, themeConverter } from "../models/theme";

export const themeQuery = collection(db, COLLECTION_NAME.THEMES).withConverter(
  themeConverter
);

export const useThemes = (): [
  Theme[] | undefined,
  boolean,
  FirestoreError | undefined
] => {
  const [themes, loading, error] = useCollectionData<Theme>(themeQuery, {
    initialValue: [],
  });

  return [themes, loading, error];
};
