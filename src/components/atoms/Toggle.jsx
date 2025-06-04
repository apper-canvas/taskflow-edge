import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const Toggle = ({ active, onToggle, activeIcon, inactiveIcon, label, className }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-primary transition-colors ${className}`}
      aria-label={label}
    >
      <ApperIcon name={active ? activeIcon : inactiveIcon} className="w-5 h-5" />
    </motion.button>
  )
}

export default Toggle