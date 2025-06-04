import React from 'react'
import ApperIcon from '../ApperIcon'
import Toggle from '../atoms/Toggle'
import ViewModeToggle from './ViewModeToggle'

const HeaderControls = ({ stats, viewMode, setViewMode, darkMode, toggleDarkMode }) => {
  return (
    <div className="flex items-center gap-2 lg:gap-4">
      {/* Quick Stats */}
      <div className="hidden md:flex items-center gap-4 mr-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-surface-800 dark:text-surface-200">{stats.total}</div>
          <div className="text-xs text-surface-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-secondary">{stats.completed}</div>
          <div className="text-xs text-surface-500">Done</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">{stats.inProgress}</div>
          <div className="text-xs text-surface-500">Active</div>
        </div>
      </div>

      {/* View Toggle */}
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      {/* Dark Mode Toggle */}
      <Toggle
        active={darkMode}
        onToggle={toggleDarkMode}
        activeIcon="Sun"
        inactiveIcon="Moon"
        label="Toggle dark mode"
      />
    </div>
  )
}

export default HeaderControls