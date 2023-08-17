import { db } from '@/firebase';
import { COLLECTION_NAME } from '@/types/enums/collectionName';
import { Theme, themeConverter } from '@/types/models/theme';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';

/**
 * Add a new theme to account on firestore
 *
 * @param {string} accountId Account Id
 * @param {Theme} theme Theme data
 *
 * @throws {Error} Empty account ID
 *
 */

const addTheme = async (accountId: string, theme: Omit<Theme, 'id'>) => {
  if (!accountId) throw new Error('Empty account ID');

  const collectionRef = collection(
    db,
    COLLECTION_NAME.ACCOUNTS,
    accountId,
    COLLECTION_NAME.THEMES
  ).withConverter(themeConverter);

  await addDoc(collectionRef, theme);
};

/**
 * Delete theme from account
 *
 * @param account Account id
 * @param theme Theme id
 *
 * @throws Invalid account id
 * @throws Invalid theme id
 */
const deleteTheme = async (account: string, theme: string) => {
  if (!account) throw new Error('Invalid account id');
  if (!theme) throw new Error('Invalid theme');

  const themeRef = doc(
    db,
    COLLECTION_NAME.ACCOUNTS,
    account,
    COLLECTION_NAME.THEMES,
    theme
  );

  await deleteDoc(themeRef);
};

export { addTheme, deleteTheme };
