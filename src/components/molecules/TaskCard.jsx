import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import TaskActions from './TaskActions'
import TaskMetaInfo from './TaskMetaInfo'
import Card from '../atoms/Card'

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, handleDragStart, draggedTask, category, getPriorityColor, getStatusColor, getDateColor }) => {
  return (
    <Card
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, scale: 1.02 }}
      draggable
      onDragStart={() => handleDragStart(task)}
      className={`group p-4 border border-surface-200 dark:border-surface-700 ${
        draggedTask?.id === task.id ? 'opacity-50 rotate-2' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-surface-800 dark:text-surface-200 line-clamp-2 mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <TaskActions
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
          onStatusChange={() => onStatusChange(task.id, task.status === 'completed' ? 'todo' : 'completed')}
          isCompleted={task.status === 'completed'}
        />
      </div>

      {/* Meta Info */}
      <TaskMetaInfo
        priority={task.priority}
        category={category}
        dueDate={task.dueDate}
        status={task.status}
        getPriorityColor={getPriorityColor}
        getDateColor={getDateColor}
      />
    </Card>
  )
}

export default TaskCard