import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(previousState => !previousState);
  };

  const theme = {
    isDarkMode,
    toggleDarkMode,
    background: isDarkMode ? '#171414' : '#c0c0c0', // Màu nền dark và light
    text: isDarkMode ? 'white' : 'black',         // Màu chữ dark và light
    primary: '#ff9a68',                         // Màu primary (ví dụ)
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
