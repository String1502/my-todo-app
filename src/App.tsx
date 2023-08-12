import AddTaskButon from "@/components/AddTaskButton/AddTaskButton";
import IntervalButtonBar from "@/components/IntervalButtonBar";
import NewTaskModal from "@/components/NewTaskModal";
import { auth, db } from "@/lib/firebase";
import IntervalState from "@/lib/types/IntervalState";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState, useSignInWithGoogle, useSignOut } from "react-firebase-hooks/auth";
import ThemeAccordion from "./components/ThemeAccordion";
import { INBOX_THEME_NAME } from "./lib/constants";
import { COLLECTION_NAME } from "./lib/enums/collectionName";
import { getAccount, getTask } from "./lib/firestore";
import { Account } from "./lib/models/account";
import { Task, taskConverter } from "./lib/models/task";
import { Theme, themeConverter } from "./lib/models/theme";
import { cn } from "./lib/utils";

const App = () => {
  const [user, userLoading, userError] = useAuthState(auth);
  const [account, setAccount] = useState<Account | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [inboxTheme, setInboxTheme] = useState<Task[]>([]);
  const [selectedIntervalState, setSelectedIntervalState] = useState<IntervalState>('inbox');
  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);

  const [signInWithGoogle, signInUser, signInLoading, signInError] = useSignInWithGoogle(auth);
  const [signOut, signOutLoading, signOutError] = useSignOut(auth);

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

      try {
        const inboxTasks = await getDocs(collection(db, `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${INBOX_THEME_NAME}`).withConverter(taskConverter))

        const tasks: Task[] = []

        inboxTasks.forEach(task => {
          if (task.exists()) {
            tasks.push(task.data())
          }
        })

        setInboxTheme(tasks)
      } catch (error) {
        console.log(error);
      }

      // Theme part
      try {
        const themePath = `${COLLECTION_NAME.ACCOUNTS}/${account.id}/${COLLECTION_NAME.THEMES}`;

        const themeSnapshot = await getDocs(collection(db, themePath).withConverter(themeConverter));

        const themes: Theme[] = []

        for (const theme of themeSnapshot.docs) {

          if (theme.exists()) {
            const data = theme.data();

            const taskPath = `${COLLECTION_NAME.ACCOUNTS}/${account!.id}/${COLLECTION_NAME.THEMES}/${theme.id}/${COLLECTION_NAME.TASKS}`;
            const tasksSnapshot = await getDocs(collection(db, taskPath).withConverter(taskConverter));

            const tasks: Task[] = []

            tasksSnapshot.forEach(task => {
              if (task.exists()) {
                tasks.push(task.data())
              }
            })

            data.tasks = tasks;

            themes.push(data)
          }
        }

        setThemes(themes)
      } catch (error) {
        console.log(error);
      }
    }

    getData();

  }, [user]);

  const handleIntervalOptionChange = (intervalValue: IntervalState) => {
    if (intervalValue) {
      setSelectedIntervalState(intervalValue);
    }
  }

  const handleAddTask = () => {
    setNewTaskModalOpen(prev => !prev);
  }

  const handleCloseModal = () => setNewTaskModalOpen(false);

  const handleSignIn = () => {
    try {
      signInWithGoogle();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSignOut = () => {
    try {
      signOut();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <nav id='nav' className="h-14 border-b-2 border-black">

        <div id='navContainer' className="flex justify-between items-center container mx-auto h-full">

          <div id='logo' className="flex gap-2 rounded-md border-2 border-blue-500 p-1 px-3 cursor-default">

            <div id='logoIcon' className="text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>

            <p id='logoName' className="text-blue-500 font-bold">My Todo App</p>

          </div>

          <div id='loginZone' className="flex gap-3 items-center">

            {!user && (<button id='signInButton' className={cn('bg-zinc-500 cursor-not-allowed border-2 border-black rounded-md  p-1 font-bold text-white px-4 transition-colors', {
              'hover:bg-blue-600 bg-blue-500 hover:cursor-pointer': !signInLoading && !user
            })} onClick={handleSignIn} disabled={signInLoading || Boolean(user)}>Sign in with Google</button>)}

            {user && (
              <>
                <div id='avatar' className="w-9 h-9 object-cover rounded-full bg-center border-2 border-black hover:scale-110 transition-transform" style={{
                  backgroundImage: `url(${user.photoURL})`,
                }}>
                </div>

                <p id='userName' className="font-bold hover:scale-110 transition-transform">{user.displayName}</p>

                <button id='signOutButton' className={cn('bg-zinc-500 border-2 border-black rounded-md  p-1 font-bold text-white px-4 transition-colors', {
                  'hover:bg-blue-600 bg-blue-500 hover:cursor-pointer': !signInLoading && user,
                })} onClick={handleSignOut} disabled={signInLoading || !user}>Sign out</button>
              </>
            )}

          </div>
        </div>

      </nav>

      <div id='container' className="container py-8 mx-auto flex-col">

        {user ? <>
          <section id='toolBar' className="flex justify-between items-center">
            <IntervalButtonBar value={selectedIntervalState} onChange={handleIntervalOptionChange} />

            <AddTaskButon onClick={handleAddTask} />
          </section>

          <div id='toolBarDivider' className="w-full h-1 bg-slate-900 my-2"></div>

          {
            themes && themes.length > 0 ?
              <ul className="flex-col space-y-2">
                {themes.map(theme => <li key={theme.id} className="flex-col space-y-1">
                  <ThemeAccordion theme={theme} />
                </li>)
                }
              </ul> :
              null}

          {
            account && account.inbox_theme && account.inbox_theme.tasks.length > 0 ? <>

              <p>Inbox</p>

            </> : <p>No Inbox Theme</p>
          }
        </> : <>

          <p id='loginPleaseText' className="text-center font-bold text-lg">Vui lòng đăng nhập để sử dụng</p>

        </>}

      </div >

      {
        newTaskModalOpen ? <NewTaskModal handleClose={handleCloseModal} /> : null
      }
    </>
  )
}



export default App;