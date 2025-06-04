import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const ErrorDisplay = ({ message }) => {
  if (!message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
    >
      <div className="flex items-center gap-2">
        <ApperIcon name="AlertCircle" className="w-5 h-5" />
        <span>Error loading tasks: {message}</span>
      </div>
    </motion.div>
  )
}

export default ErrorDisplay