import Navbar from '@/components/pages/app/Navbar';
import NewTaskModal from '@/components/pages/app/NewTaskModal';
import ThemesDisplayer from '@/components/pages/app/ThemesDisplayer';
import { auth } from '@/firebase';
import useAccount from '@/hooks/useAccount';
import { AccountContext } from '@/hooks/useAccountContext';
import { useState } from 'react';
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from 'react-firebase-hooks/auth';

const Home = () => {
  //#region States

  const [user] = useAuthState(auth);
  const [account] = useAccount(user?.uid);

  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);

  const [signInWithGoogle, , signInLoading] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);

  // NOTE - For add task from theme accordion
  const [tempTheme, setTempTheme] = useState<string>('');

  //#endregion

  //#region Hdandlers

  const handleAddTask = (theme?: string) => {
    setNewTaskModalOpen(true);

    theme && setTempTheme(theme);
  };

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

      <main id="container" className="container py-8 mx-auto flex-col">
        <ThemesDisplayer
          handleAddTask={handleAddTask}
          addTask={handleAddTask}
        />
      </main>

      <NewTaskModal
        handleClose={handleCloseModal}
        open={newTaskModalOpen}
        theme={tempTheme}
      />
    </AccountContext.Provider>
  );
};

export default Home;
