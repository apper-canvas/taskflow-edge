import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ children, className, whileHover, layout, initial, animate, exit, draggable, onDragStart }) => {
  return (
    <motion.div
      layout={layout}
      initial={initial}
      animate={animate}
      exit={exit}
      whileHover={whileHover}
      draggable={draggable}
      onDragStart={onDragStart}
      className={`bg-white dark:bg-surface-800 rounded-xl shadow-card hover:shadow-hover transition-all duration-200 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card