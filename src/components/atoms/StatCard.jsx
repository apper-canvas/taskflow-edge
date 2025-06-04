import React from 'react'
import Card from './Card'

const StatCard = ({ value, label, colorClass = 'text-surface-800' }) => {
  return (
    <Card className="p-3 text-center shadow-card">
      <div className={`text-lg font-semibold ${colorClass} dark:text-surface-200`}>{value}</div>
      <div className="text-xs text-surface-500">{label}</div>
    </Card>
  )
}

export default StatCard