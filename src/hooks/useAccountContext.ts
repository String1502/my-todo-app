import { createContext, useContext } from 'react';
import { Account } from '../types/models/account';

const AccountContext = createContext<Account | undefined>(undefined);

const useAccountContext = () => {
  const account = useContext<Account | undefined>(AccountContext);

  return account;
};

export default useAccountContext;
export { AccountContext };
