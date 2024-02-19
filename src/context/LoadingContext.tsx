import { createContext } from "react";

export const LoadingContext = createContext<{
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({ loading: false, setLoading: () => {} });
