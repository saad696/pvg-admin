import { createContext } from "react";

export const UserContext = createContext<{
  user: UserContext;
  setUser: React.Dispatch<React.SetStateAction<UserContext>>;
}>({ user: { user: null, role: "", isLoggedIn: false }, setUser: () => {} });
