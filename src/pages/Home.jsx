import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { taskService } from '../services'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('kanban')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      try {
        const result = await taskService.getAll()
        setTasks(result || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-surface-900' : 'bg-gradient-to-br from-surface-50 via-white to-surface-100'}`}>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-surface-900/80 border-b border-surface-200 dark:border-surface-700"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
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

            {/* Stats & Controls */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 mr-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-surface-800 dark:text-surface-200">{stats.total}</div>
                  <div className="text-xs text-surface-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-secondary">{stats.completed}</div>
                  <div className="text-xs text-surface-500">Done</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-accent">{stats.inProgress}</div>
                  <div className="text-xs text-surface-500">Active</div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'kanban'
                      ? 'bg-white dark:bg-surface-700 text-primary shadow-sm'
                      : 'text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <ApperIcon name="Columns" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-surface-700 text-primary shadow-sm'
                      : 'text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-primary transition-colors"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="AlertCircle" className="w-5 h-5" />
              <span>Error loading tasks: {error}</span>
            </div>
          </motion.div>
        )}

        {/* Quick Stats Mobile */}
        <div className="md:hidden mb-6">
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-3 text-center shadow-card">
              <div className="text-lg font-semibold text-surface-800 dark:text-surface-200">{stats.total}</div>
              <div className="text-xs text-surface-500">Total</div>
            </div>
            <div className="bg-white dark:bg-surface-800 rounded-xl p-3 text-center shadow-card">
              <div className="text-lg font-semibold text-secondary">{stats.completed}</div>
              <div className="text-xs text-surface-500">Done</div>
            </div>
            <div className="bg-white dark:bg-surface-800 rounded-xl p-3 text-center shadow-card">
              <div className="text-lg font-semibold text-accent">{stats.inProgress}</div>
              <div className="text-xs text-surface-500">Active</div>
            </div>
            <div className="bg-white dark:bg-surface-800 rounded-xl p-3 text-center shadow-card">
              <div className="text-lg font-semibold text-red-500">{stats.overdue}</div>
              <div className="text-xs text-surface-500">Overdue</div>
            </div>
          </div>
        </div>

        {/* Main Feature Component */}
        <MainFeature 
          tasks={tasks} 
          onTaskUpdate={handleTaskUpdate}
          viewMode={viewMode}
          darkMode={darkMode}
        />
      </main>
    </div>
  )
}

export default Home