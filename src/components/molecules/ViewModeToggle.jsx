import React from 'react'
import ApperIcon from '../ApperIcon'

const ViewModeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
      <button
        onClick={() => setViewMode('kanban')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          viewMode === 'kanban'
            ? 'bg-white dark:bg-surface-700 text-primary shadow-sm'
            : 'text-surface-600 dark:text-surface-400'
        }`}
      >
        <ApperIcon name="Columns" className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          viewMode === 'list'
            ? 'bg-white dark:bg-surface-700 text-primary shadow-sm'
            : 'text-surface-600 dark:text-surface-400'
        }`}
      >
        <ApperIcon name="List" className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ViewModeToggle