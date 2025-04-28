"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: "light",
  setTheme: () => { },
})

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    const initial = stored === "light" || stored === "dark" ? stored : defaultTheme
    setThemeState(initial)
    document.documentElement.setAttribute("data-theme", initial)
  }, [defaultTheme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}