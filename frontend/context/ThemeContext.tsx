import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Themes, AppTheme } from "../constants/colors";

const THEME_STORAGE_KEY = "@closira_theme_preference";

interface ThemeContextProps {
  colors: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  colors: Themes.light,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme !== null) {
          setIsDark(storedTheme === "dark");
        } else {
          setIsDark(systemColorScheme === "dark");
        }
      } catch (e) {
        setIsDark(systemColorScheme === "dark");
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? "dark" : "light");
    } catch (e) {
      // Ignored
    }
  };

  if (!isLoaded) return null; // Avoid flashing incorrect theme before async load

  const themeValue = {
    colors: isDark ? Themes.dark : Themes.light,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};
