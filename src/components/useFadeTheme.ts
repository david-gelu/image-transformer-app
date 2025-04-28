import { useTheme } from "./theme-provider"
import { useState } from "react"

export function useFadeTheme() {
  const { theme, setTheme } = useTheme()
  const [isFading, setIsFading] = useState(false)

  const fadeAndSetTheme = (newTheme: "light" | "dark") => {
    setIsFading(true)
    setTimeout(() => {
      setTheme(newTheme)
      setIsFading(false)
    }, 300)
  }

  return { theme, fadeAndSetTheme, isFading }
}
