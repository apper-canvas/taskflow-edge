import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const Button = ({ children, icon, className, onClick, whileHover, whileTap, type = 'button', disabled, isLoading }) => {
  return (
    <motion.button
      whileHover={whileHover || { scale: 1.05 }}
      whileTap={whileTap || { scale: 0.95 }}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 transition-all duration-200 ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <ApperIcon name={icon} className="w-5 h-5" />}
          {children}
        </>
      )}
    </motion.button>
  )
}

export default Button