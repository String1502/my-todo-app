import { cn } from '@/utils/tailwind';
import { User } from 'firebase/auth';
import React from 'react';

type NavbarProps = {
  user: User | null | undefined;
  signInLoading: boolean;
  signIn: () => void;
  signOut: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  user,
  signInLoading,
  signIn,
  signOut,
}) => {
  return (
    <nav id="nav" className="h-14 border-b-2 border-black">
      <div
        id="navContainer"
        className="flex justify-between items-center container mx-auto h-full"
      >
        <div
          id="logo"
          className="flex gap-2 rounded-md border-2 border-blue-500 p-1 px-3 
          cursor-default
          hover:-translate-y-1 hover:border-4
          transition-all
          "
        >
          <div id="logoIcon" className="text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.0}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </div>

          <p id="logoName" className="text-blue-500 font-bold">
            My Todo App
          </p>
        </div>

        <div id="loginZone" className="flex gap-3 items-center">
          {!user && (
            <button
              id="signInButton"
              className={cn(
                'bg-zinc-500 cursor-not-allowed border-2 border-black rounded-md  p-1 font-bold text-white px-4 transition-colors',
                {
                  'hover:bg-blue-600 bg-blue-500 hover:cursor-pointer':
                    !signInLoading && !user,
                }
              )}
              onClick={signIn}
              disabled={signInLoading || Boolean(user)}
            >
              Sign in with Google
            </button>
          )}

          {user && (
            <>
              <div
                id="avatar"
                className="w-9 h-9 object-cover rounded-full bg-center border-2 border-black hover:scale-110 transition-transform"
                style={{
                  backgroundImage: `url(${user.photoURL})`,
                }}
              ></div>

              <p
                id="userName"
                className="font-bold hover:scale-110 transition-transform"
              >
                {user.displayName}
              </p>

              <button
                id="signOutButton"
                className={cn(
                  'bg-zinc-500 border-2 border-black rounded-md  p-1 font-bold text-white px-4 transition-colors',
                  {
                    'hover:bg-blue-600 bg-blue-500 hover:cursor-pointer':
                      !signInLoading && user,
                  }
                )}
                onClick={signOut}
                disabled={signInLoading || !user}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
