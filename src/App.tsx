import NewTaskModal from '@/components/NewTaskModal';
import { auth } from '@/lib/firebase';
import { AccountContext } from '@/lib/hooks/useAccount';
import { useEffect, useState } from 'react';
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from 'react-firebase-hooks/auth';
import Navbar from './components/Navbar';
import ThemesDisplayer from './components/ThemesDisplayer';
import { getAccount } from './lib/firestore';
import { Account } from './lib/models/account';

const App = () => {
  //#region States

  const [user, userLoading, userError] = useAuthState(auth);
  const [account, setAccount] = useState<Account | null>(null);

  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);

  const [signInWithGoogle, signInUser, signInLoading, signInError] =
    useSignInWithGoogle(auth);
  const [signOut, signOutLoading, signOutError] = useSignOut(auth);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    const getData = async () => {
      // Account part
      if (!user) return;

      let account: Account;

      try {
        account = await getAccount(user.uid);
      } catch (error) {
        console.log(error);
        setAccount(null);
        return;
      }

      if (!account) {
        setAccount(null);
        return;
      }

      setAccount(account);
    };

    getData();
  }, [user]);

  //#endregion

  //#region Handlers

  const handleAddTask = () => setNewTaskModalOpen(true);

  const handleCloseModal = () => setNewTaskModalOpen(false);

  const handleSignIn = () => {
    try {
      signInWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = () => {
    try {
      signOut();
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion

  return (
    <AccountContext.Provider value={account}>
      <Navbar
        user={user}
        signInLoading={signInLoading}
        signOut={handleSignOut}
        signIn={handleSignIn}
      />

      <div id="container" className="container py-8 mx-auto flex-col">
        <ThemesDisplayer handleAddTask={handleAddTask} />
      </div>

      <NewTaskModal handleClose={handleCloseModal} open={newTaskModalOpen} />
    </AccountContext.Provider>
  );
};

export default App;
