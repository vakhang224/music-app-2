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

    // Nền tổng thể
    background: isDarkMode ? '#111827' : '#ffffff', //dark: '#111827', light: '#c0c0c0',

    // Màu chữ chính
    text: isDarkMode ? 'white' : '#000099',

    // Màu chính (primary)
    primary: '#111827',

    // Màu cho thẻ/card 
    card: isDarkMode ? '#000000' : '#E3E8EB',

    // Màu cho khung viền
    border: isDarkMode ? '#333333' : '#000000',

    //  Màu phụ (subtitle)
    subtitle: isDarkMode ? '#9CA3AF' : '#4B5563',

    //  Màu placeholder cho input
    placeholder: isDarkMode ? '#A1A1AA' : '#6B7280',
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
