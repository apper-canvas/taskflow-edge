import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast, isFuture } from 'date-fns'
import ApperIcon from './ApperIcon'
import { taskService, categoryService } from '../services'

const MainFeature = ({ tasks, onTaskUpdate, viewMode, darkMode }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [draggedTask, setDraggedTask] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    category: ''
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryService.getAll()
        setCategories(result || [])
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      category: ''
    })
    setEditingTask(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    setLoading(true)
    try {
      let updatedTasks
      if (editingTask) {
        await taskService.update(editingTask.id, formData)
        updatedTasks = await taskService.getAll()
        toast.success('Task updated successfully!')
      } else {
        await taskService.create(formData)
        updatedTasks = await taskService.getAll()
        toast.success('Task created successfully!')
      }
      
      onTaskUpdate(updatedTasks)
      setShowCreateModal(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      category: task.category || ''
    })
    setShowCreateModal(true)
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.delete(taskId)
      const updatedTasks = await taskService.getAll()
      onTaskUpdate(updatedTasks)
      toast.success('Task deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus })
      const updatedTasks = await taskService.getAll()
      onTaskUpdate(updatedTasks)
      
      if (newStatus === 'completed') {
        toast.success('Task completed! 🎉')
      }
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const handleDragStart = (task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      await handleStatusChange(draggedTask.id, newStatus)
    }
    setDraggedTask(null)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200'
      case 'medium': return 'text-amber-500 bg-amber-50 border-amber-200'
      case 'low': return 'text-green-500 bg-green-50 border-green-200'
      default: return 'text-surface-500 bg-surface-50 border-surface-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-secondary bg-secondary/10 border-secondary/20'
      case 'in-progress': return 'text-primary bg-primary/10 border-primary/20'
      case 'todo': return 'text-surface-600 bg-surface-100 border-surface-200'
      default: return 'text-surface-500 bg-surface-50 border-surface-200'
    }
  }

  const getDateColor = (dueDate, status) => {
    if (!dueDate || status === 'completed') return 'text-surface-500'
    const date = new Date(dueDate)
    if (isPast(date)) return 'text-red-500'
    if (isToday(date)) return 'text-amber-500'
    return 'text-surface-500'
  }

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)
  }

  const TaskCard = ({ task }) => {
    const category = getCategoryById(task.category)
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -2, scale: 1.02 }}
        draggable
        onDragStart={() => handleDragStart(task)}
        className={`group bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card hover:shadow-hover transition-all duration-200 cursor-move border border-surface-200 dark:border-surface-700 ${
          draggedTask?.id === task.id ? 'opacity-50 rotate-2' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-surface-800 dark:text-surface-200 line-clamp-2 mb-1">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleEdit(task)}
              className="p-1.5 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(task.id)}
              className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Priority */}
            <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            
            {/* Category */}
            {category && (
              <span 
                className="px-2 py-1 text-xs font-medium rounded-lg border"
                style={{ 
                  backgroundColor: `${category.color}20`,
                  borderColor: `${category.color}40`,
                  color: category.color 
                }}
              >
                <ApperIcon name={category.icon} className="w-3 h-3 inline mr-1" />
                {category.name}
              </span>
            )}
          </div>

          {/* Status Checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleStatusChange(task.id, task.status === 'completed' ? 'todo' : 'completed')}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              task.status === 'completed'
                ? 'bg-secondary border-secondary text-white'
                : 'border-surface-300 hover:border-secondary'
            }`}
          >
            {task.status === 'completed' && (
              <ApperIcon name="Check" className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={`mt-3 text-xs font-medium ${getDateColor(task.dueDate, task.status)}`}>
            <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </div>
        )}
      </motion.div>
    )
  }

  const KanbanView = () => {
    const columns = [
      { status: 'todo', title: 'To Do', color: 'border-surface-300', icon: 'Circle' },
      { status: 'in-progress', title: 'In Progress', color: 'border-primary', icon: 'Clock' },
      { status: 'completed', title: 'Completed', color: 'border-secondary', icon: 'CheckCircle' }
    ]

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(column => {
          const columnTasks = filteredTasks.filter(task => task.status === column.status)
          
          return (
            <motion.div
              key={column.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-surface-50 dark:bg-surface-800/50 rounded-2xl p-4 border-2 border-dashed ${column.color} min-h-96`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ApperIcon name={column.icon} className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                  <h3 className="font-semibold text-surface-800 dark:text-surface-200">{column.title}</h3>
                  <span className="px-2 py-1 bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-400 text-xs rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {columnTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              </div>
              
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-surface-400">
                  <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks yet</p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    )
  }

  const ListView = () => (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
        <h3 className="font-semibold text-surface-800 dark:text-surface-200">All Tasks</h3>
      </div>
      
      <div className="divide-y divide-surface-200 dark:divide-surface-700">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ApperIcon name="Inbox" className="w-12 h-12 mx-auto text-surface-300 mb-4" />
              <p className="text-surface-500">No tasks found</p>
            </motion.div>
          ) : (
            filteredTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleStatusChange(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          task.status === 'completed'
                            ? 'bg-secondary border-secondary text-white'
                            : 'border-surface-300 hover:border-secondary'
                        }`}
                      >
                        {task.status === 'completed' && (
                          <ApperIcon name="Check" className="w-3 h-3" />
                        )}
                      </motion.button>
                      
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-surface-400' : 'text-surface-800 dark:text-surface-200'}`}>
                        {task.title}
                      </h3>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-surface-600 dark:text-surface-400 ml-8">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {task.dueDate && (
                      <span className={`text-sm ${getDateColor(task.dueDate, task.status)}`}>
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(task)}
                        className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-surface-800 rounded-2xl p-4 lg:p-6 shadow-card"
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl hover:shadow-hover transition-all duration-200 flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span className="hidden sm:inline">Add Task</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Task Views */}
      {viewMode === 'kanban' ? <KanbanView /> : <ListView />}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-200">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter task description..."
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="">No Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 text-surface-600 dark:text-surface-400 font-medium rounded-xl border border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl hover:shadow-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      editingTask ? 'Update Task' : 'Create Task'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-float hover:shadow-hover transition-all duration-200 flex items-center justify-center z-40 lg:hidden"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </motion.button>
    </div>
  )
}

export default MainFeature