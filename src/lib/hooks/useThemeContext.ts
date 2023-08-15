import { createContext, useContext } from 'react';
import { Theme } from '../models/theme';

const ThemeContext = createContext<Theme | null>(null);

const useThemeContext = () => {
  const theme = useContext(ThemeContext);

  return theme;
};

export default useThemeContext;
export { ThemeContext };
