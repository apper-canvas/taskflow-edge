import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const TaskActions = ({ onEdit, onDelete, onStatusChange, isCompleted }) => {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onEdit}
        className="p-1.5 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg"
        icon="Edit2"
      />
      <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDelete}
        className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
        icon="Trash2"
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onStatusChange}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
          isCompleted
            ? 'bg-secondary border-secondary text-white'
            : 'border-surface-300 hover:border-secondary'
        }`}
      >
        {isCompleted && (
          <ApperIcon name="Check" className="w-4 h-4" />
        )}
      </motion.button>
    </div>
  )
}

export default TaskActions