import NewTaskModal from '@/components/NewTaskModal';
import { auth } from '@/lib/firebase';
import { AccountContext } from '@/lib/hooks/useAccountContext';
import { useState } from 'react';
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from 'react-firebase-hooks/auth';
import Navbar from './components/Navbar';
import ThemesDisplayer from './components/ThemesDisplayer';
import useAccount from './lib/hooks/useAccount';

const App = () => {
  //#region States

  const [user, userLoading, userError] = useAuthState(auth);
  const [account, accountLoading, accountError] = useAccount(user?.uid);

  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);

  const [signInWithGoogle, signInUser, signInLoading, signInError] =
    useSignInWithGoogle(auth);
  const [signOut, signOutLoading, signOutError] = useSignOut(auth);

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
