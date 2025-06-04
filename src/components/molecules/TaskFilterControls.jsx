import React from 'react'
import Input from '../atoms/Input'
import Select from '../atoms/Select'
import Button from '../atoms/Button'

const TaskFilterControls = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, filterPriority, setFilterPriority, onCreateTask }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      {/* Search */}
      <div className="relative flex-1 lg:max-w-md">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="Search"
          className="pl-10 pr-4 py-2.5"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'todo', label: 'To Do' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ]}
          className="px-4 py-2.5"
        />

        <Select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
          className="px-4 py-2.5"
        />

        <Button
          onClick={onCreateTask}
          className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl hover:shadow-hover"
          icon="Plus"
        >
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>
    </div>
  )
}

export default TaskFilterControls