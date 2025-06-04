import React from 'react'
import ApperIcon from '../ApperIcon'
import { format } from 'date-fns'

const TaskMetaInfo = ({ priority, category, dueDate, status, getPriorityColor, getDateColor }) => {
  const categoryColor = category ? { 
    backgroundColor: `${category.color}20`,
    borderColor: `${category.color}40`,
    color: category.color 
  } : {}

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Priority */}
        <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(priority)}`}>
          {priority}
        </span>
        
        {/* Category */}
        {category && (
          <span 
            className="px-2 py-1 text-xs font-medium rounded-lg border"
            style={categoryColor}
          >
            <ApperIcon name={category.icon} className="w-3 h-3 inline mr-1" />
            {category.name}
          </span>
        )}
      </div>

      {/* Due Date */}
      {dueDate && (
        <div className={`text-xs font-medium ${getDateColor(dueDate, status)}`}>
          <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
          {format(new Date(dueDate), 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  )
}

export default TaskMetaInfo