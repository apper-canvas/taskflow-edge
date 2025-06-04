import React from 'react'
import ApperIcon from '../ApperIcon'

const Input = ({ type = 'text', placeholder, value, onChange, className, icon, label, required, rows }) => {
  const commonClasses = "w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          {label} {required && '*'}
        </label>
      )}
      <div className="relative">
        {icon && (
          <ApperIcon name={icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
        )}
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            className={`${commonClasses} ${icon ? 'pl-10' : ''} ${className}`}
            placeholder={placeholder}
            rows={rows}
            required={required}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={`${commonClasses} ${icon ? 'pl-10' : ''} ${className}`}
            placeholder={placeholder}
            required={required}
          />
        )}
      </div>
    </div>
  )
}

export default Input