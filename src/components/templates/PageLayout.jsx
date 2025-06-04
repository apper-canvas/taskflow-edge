import React from 'react'
import AppHeader from '../organisms/AppHeader'
import MobileQuickStats from '../molecules/MobileQuickStats'
import ErrorDisplay from '../molecules/ErrorDisplay'
import Button from '../atoms/Button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const PageLayout = ({ 
  children, 
  stats, 
  viewMode, 
  setViewMode, 
  darkMode, 
  toggleDarkMode, 
  error, 
  onCreateTask 
}) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-surface-900' : 'bg-gradient-to-br from-surface-50 via-white to-surface-100'}`}>
      <AppHeader
        stats={stats}
        viewMode={viewMode}
        setViewMode={setViewMode}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <ErrorDisplay message={error} />
        <MobileQuickStats stats={stats} />
        {children}
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={onCreateTask}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-float hover:shadow-hover z-40 lg:hidden"
        icon="Plus"
      />
    </div>
  )
}

export default PageLayout