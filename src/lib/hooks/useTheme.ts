import { createContext, useContext } from "react";
import { Theme } from "../models/theme";

const ThemeContext = createContext<Theme | null>(null);

const useTheme = () => {
  const theme = useContext(ThemeContext);

  return theme;
};

export default useTheme;
export { ThemeContext };
