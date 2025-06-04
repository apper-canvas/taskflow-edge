import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const AppLogo = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-3"
    >
      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-card">
        <ApperIcon name="CheckSquare" className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
      </div>
      <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
        TaskFlow
      </h1>
    </motion.div>
  )
}

export default AppLogo