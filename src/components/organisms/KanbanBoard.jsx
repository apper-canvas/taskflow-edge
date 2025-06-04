import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import TaskCard from '../molecules/TaskCard'

const KanbanBoard = ({ tasks, onTaskUpdate, onEdit, onDelete, handleDragStart, handleDragOver, handleDrop, draggedTask, categories, getPriorityColor, getStatusColor, getDateColor }) => {
  const columns = [
    { status: 'todo', title: 'To Do', color: 'border-surface-300', icon: 'Circle' },
    { status: 'in-progress', title: 'In Progress', color: 'border-primary', icon: 'Clock' },
    { status: 'completed', title: 'Completed', color: 'border-secondary', icon: 'CheckCircle' }
  ]

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map(column => {
        const columnTasks = tasks.filter(task => task.status === column.status)
        
        return (
          <motion.div
            key={column.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-surface-50 dark:bg-surface-800/50 rounded-2xl p-4 border-2 border-dashed ${column.color} min-h-96`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ApperIcon name={column.icon} className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                <h3 className="font-semibold text-surface-800 dark:text-surface-200">{column.title}</h3>
                <span className="px-2 py-1 bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-400 text-xs rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onTaskUpdate}
                    handleDragStart={handleDragStart}
                    draggedTask={draggedTask}
                    category={getCategoryById(task.category)}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                    getDateColor={getDateColor}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            {columnTasks.length === 0 && (
              <div className="text-center py-8 text-surface-400">
                <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks yet</p>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default KanbanBoard