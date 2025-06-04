import React from 'react'
import StatCard from '../atoms/StatCard'

const MobileQuickStats = ({ stats }) => {
  return (
    <div className="md:hidden mb-6">
      <div className="grid grid-cols-4 gap-3">
        <StatCard value={stats.total} label="Total" />
        <StatCard value={stats.completed} label="Done" colorClass="text-secondary" />
        <StatCard value={stats.inProgress} label="Active" colorClass="text-accent" />
        <StatCard value={stats.overdue} label="Overdue" colorClass="text-red-500" />
      </div>
    </div>
  )
}

export default MobileQuickStats