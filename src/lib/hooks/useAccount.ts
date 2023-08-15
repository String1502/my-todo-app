import { createContext, useContext } from "react";
import { Account } from "../models/account";

const AccountContext = createContext<Account | null>(null);

const useAccount = () => {
  const account = useContext<Account | null>(AccountContext);

  return account;
};

export default useAccount;
export { AccountContext };
