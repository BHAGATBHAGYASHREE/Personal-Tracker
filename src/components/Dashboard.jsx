import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTracker } from '../context/TrackerContext'
import MonthSelector from './MonthSelector'
import MonthlyChart from './MonthlyChart'
import CategorySummary from './CategorySummary'
import EntryForm from './EntryForm'

function Dashboard() {
  const { categories, getMonthlySummary } = useTracker()
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const summary = getMonthlySummary()
  
  const handleAddEntry = (category) => {
    setSelectedCategory(category)
    setShowEntryForm(true)
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-text">Dashboard</h2>
          <p className="text-muted">Track your progress and analyze your habits</p>
        </motion.div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <MonthSelector />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEntryForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-opacity-90 transition-colors"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Entry
            </span>
          </motion.button>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {summary.map((item) => (
          <motion.div key={item.category.id} variants={itemVariants}>
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleAddEntry(item.category)}
            >
              <div className="p-1" style={{ backgroundColor: item.category.color }}></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-text">{item.category.name}</h3>
                  <span className="p-2 rounded-full" style={{ backgroundColor: `${item.category.color}20` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke={item.category.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {renderCategoryIcon(item.category.icon)}
                    </svg>
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{item.totalValue}</p>
                    <p className="text-muted text-sm">{item.entryCount} entries</p>
                  </div>
                  <div className="h-10 w-20">
                    {/* Mini sparkline chart would go here */}
                    <div className="h-full flex items-end">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-3 mx-0.5 rounded-t-sm" 
                          style={{ 
                            height: `${20 + Math.random() * 80}%`,
                            backgroundColor: `${item.category.color}${40 + i * 10}`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Progress</h3>
          <div className="h-80">
            <MonthlyChart />
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            <CategorySummary />
          </div>
        </motion.div>
      </div>
      
      {showEntryForm && (
        <EntryForm 
          onClose={() => setShowEntryForm(false)} 
          initialCategory={selectedCategory}
        />
      )}
    </div>
  )
}

function renderCategoryIcon(iconName) {
  switch (iconName) {
    case 'fitness':
      return (
        <>
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M6 8H5a4 4 0 0 0 0 8h1"></path>
          <line x1="6" y1="12" x2="18" y2="12"></line>
        </>
      )
    case 'finance':
      return (
        <>
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </>
      )
    case 'learning':
      return (
        <>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </>
      )
    case 'productivity':
      return (
        <>
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </>
      )
    default:
      return (
        <>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </>
      )
  }
}

export default Dashboard