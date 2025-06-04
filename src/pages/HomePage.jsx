import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { isToday, isPast } from 'date-fns'
import { taskService, categoryService } from '../services'

import PageLayout from '../components/templates/PageLayout'
import KanbanBoard from '../components/organisms/KanbanBoard'
import ListView from '../components/organisms/ListView'
import TaskFilterControls from '../components/molecules/TaskFilterControls'
import TaskFormModal from '../components/organisms/TaskFormModal'
import LoadingSpinner from '../components/atoms/LoadingSpinner'

const HomePage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('kanban')
  const [darkMode, setDarkMode] = useState(false)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    category: ''
  })
  const [draggedTask, setDraggedTask] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [tasksResult, categoriesResult] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ])
        setTasks(tasksResult || [])
        setCategories(categoriesResult || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleTaskUpdate = async (updatedTasks) => {
    setTasks(updatedTasks || [])
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.status === 'completed').length
    const inProgress = tasks.filter(task => task.status === 'in-progress').length
    const overdue = tasks.filter(task => {
      const dueDate = new Date(task.dueDate)
      return dueDate < new Date() && task.status !== 'completed'
    }).length

    return { total, completed, inProgress, overdue }
  }

  const stats = getTaskStats()

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

  const handleModalClose = () => {
    setShowCreateModal(false)
    resetForm()
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    setFormLoading(true)
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
      
      handleTaskUpdate(updatedTasks)
      handleModalClose()
    } catch (error) {
      toast.error('Failed to save task')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      category: task.category || ''
    })
    setShowCreateModal(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.delete(taskId)
      const updatedTasks = await taskService.getAll()
      handleTaskUpdate(updatedTasks)
      toast.success('Task deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus })
      const updatedTasks = await taskService.getAll()
      handleTaskUpdate(updatedTasks)
      
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

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

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
    if (isPast(date) && !isToday(date)) return 'text-red-500' // If past and not today (overdue)
    if (isToday(date)) return 'text-amber-500' // If today (due today)
    return 'text-surface-500' // If future
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <PageLayout
      stats={stats}
      viewMode={viewMode}
      setViewMode={setViewMode}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      error={error}
      onCreateTask={() => setShowCreateModal(true)}
    >
      <div className="space-y-6">
        <TaskFilterControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          onCreateTask={() => setShowCreateModal(true)}
        />

        {viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskUpdate={handleStatusChange}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            draggedTask={draggedTask}
            categories={categories}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
            getDateColor={getDateColor}
          />
        ) : (
          <ListView
            tasks={filteredTasks}
            onTaskUpdate={handleStatusChange}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
            getDateColor={getDateColor}
          />
        )}
      </div>

      <TaskFormModal
        showModal={showCreateModal}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        editingTask={editingTask}
        loading={formLoading}
      />
    </PageLayout>
  )
}

export default HomePage