import { COLLECTION_NAME } from "@/lib/enums/collectionName";
import { db } from "@/lib/firebase";
import { Account, accountConverter } from "@/lib/models/account";
import { collection, doc, getDoc } from "firebase/firestore";
import { taskConverter } from "./models/task";
import { themeConverter } from "./models/theme";

const getAccount = async (userId: string): Promise<Account> => {
  if (!userId) throw new Error("Null user id");

  const accountSnapshot = await getDoc(
    doc(collection(db, COLLECTION_NAME.ACCOUNTS), userId).withConverter(
      accountConverter
    )
  );

  const data = accountSnapshot.data();

  if (!data) throw new Error("No account found");

  return data;
};

const getTheme = async (themeId: string) => {
  if (!themeId) throw new Error("Null theme id");

  const query = doc(
    collection(db, COLLECTION_NAME.THEMES),
    themeId
  ).withConverter(themeConverter);

  const snapshot = await getDoc(query);

  if (!snapshot.exists()) {
    throw new Error("Theme not found");
  } else if (snapshot.data()) {
    return snapshot.data();
  } else {
    throw new Error("Theme not found");
  }
};

const getTask = async (taskId: string) => {
  if (!taskId) throw new Error("Null task id");

  const query = doc(
    collection(db, COLLECTION_NAME.TASKS),
    taskId
  ).withConverter(taskConverter);

  const snapshot = await getDoc(query);

  if (!snapshot.exists()) {
    throw new Error("Task not found");
  } else if (snapshot.data()) {
    return snapshot.data();
  } else {
    throw new Error("Task not found");
  }
};

export { getAccount, getTask, getTheme };
