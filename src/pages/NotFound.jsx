import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-white to-surface-100">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-primary-light rounded-3xl flex items-center justify-center shadow-float">
            <ApperIcon name="Search" className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-surface-200 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-surface-800 mb-4">Page Not Found</h2>
          <p className="text-surface-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back to managing your tasks.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl hover:shadow-hover transition-all duration-200 transform hover:-translate-y-1"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            Back to TaskFlow
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound