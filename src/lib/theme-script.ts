export const themeScript = `
  (function() {
    try {
      const darkMode = localStorage.getItem('theme')
      const theme = darkMode === 'dark' || (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches) 
        ? 'dark' 
        : 'light'
      document.documentElement.setAttribute('data-theme', theme)
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  })()
`