import React from 'react'
import { motion } from 'framer-motion'
import AppLogo from '../atoms/AppLogo'
import HeaderControls from '../molecules/HeaderControls'

const AppHeader = ({ stats, viewMode, setViewMode, darkMode, toggleDarkMode }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-surface-900/80 border-b border-surface-200 dark:border-surface-700"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <AppLogo />
          <HeaderControls
            stats={stats}
            viewMode={viewMode}
            setViewMode={setViewMode}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>
      </div>
    </motion.header>
  )
}

export default AppHeader