import Navbar from '@/components/pages/app/Navbar';
import NewTaskModal from '@/components/pages/app/NewTaskModal';
import ThemesDisplayer from '@/components/pages/app/ThemesDisplayer';
import { auth } from '@/firebase';
import useAccount from '@/hooks/useAccount';
import { AccountContext } from '@/hooks/useAccountContext';
import { useRef, useState } from 'react';
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from 'react-firebase-hooks/auth';

const Home = () => {
  //#region States

  const [user] = useAuthState(auth);
  const [account] = useAccount(user?.uid);

  const [signInWithGoogle, , signInLoading] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);

  // NOTE - For add task from theme accordion
  const [tempTheme, setTempTheme] = useState<string>('');

  //#endregion

  //#region Refs

  const newTaskDialogRef = useRef<HTMLDialogElement>(null);

  //#endregion

  //#region Handlers

  const handleOpenModal = () => newTaskDialogRef.current?.showModal();
  const handleCloseModal = () => newTaskDialogRef.current?.close();

  const handleAddTask = (theme?: string) => {
    theme && setTempTheme(theme);

    handleOpenModal();
  };

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
        ref={newTaskDialogRef}
        theme={tempTheme}
        onClose={handleCloseModal}
      />
    </AccountContext.Provider>
  );
};

export default Home;
