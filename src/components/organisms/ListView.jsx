import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const ListView = ({ tasks, onTaskUpdate, onEdit, onDelete, getPriorityColor, getStatusColor, getDateColor }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
        <h3 className="font-semibold text-surface-800 dark:text-surface-200">All Tasks</h3>
      </div>
      
      <div className="divide-y divide-surface-200 dark:divide-surface-700">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ApperIcon name="Inbox" className="w-12 h-12 mx-auto text-surface-300 mb-4" />
              <p className="text-surface-500">No tasks found</p>
            </motion.div>
          ) : (
            tasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onTaskUpdate(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          task.status === 'completed'
                            ? 'bg-secondary border-secondary text-white'
                            : 'border-surface-300 hover:border-secondary'
                        }`}
                        icon={task.status === 'completed' ? "Check" : null}
                      >
                        {task.status === 'completed' && <ApperIcon name="Check" className="w-3 h-3" />}
                      </Button>
                      
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-surface-400' : 'text-surface-800 dark:text-surface-200'}`}>
                        {task.title}
                      </h3>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-surface-600 dark:text-surface-400 ml-8">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {task.dueDate && (
                      <span className={`text-sm ${getDateColor(task.dueDate, task.status)}`}>
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(task)}
                        className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                        icon="Edit2"
                      />
                      <Button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        icon="Trash2"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ListView