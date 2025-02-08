import React, { useState } from 'react'
import ProblemList from './components/ProblemList'
import LandingPage from './components/LandingPage'
import useLocalStorage from './hooks/useLocalStorage'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false)

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />
  }

  return <ProblemList darkMode={darkMode} setDarkMode={setDarkMode} />
}

export default App