// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// const ThemeContext = createContext(null);

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState("light");

//   useEffect(() => {
//     const stored = window.localStorage.getItem("tourmate-theme");
//     const initial = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
//     setTheme(initial);
//   }, []);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", theme === "dark");
//     window.localStorage.setItem("tourmate-theme", theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const ctx = useContext(ThemeContext);
//   if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
//   return ctx;
// }


"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Dark mode is the default
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("tourmate-theme");

    // Use saved preference, otherwise use dark mode
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    window.localStorage.setItem("tourmate-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return ctx;
}