import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTracker } from '../context/TrackerContext'

function MonthSelector() {
  const { selectedMonth, setSelectedMonth } = useTracker()
  const [isOpen, setIsOpen] = useState(false)
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1]
  
  const handleSelectMonth = (month, year) => {
    setSelectedMonth({ month, year })
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white text-text border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center"
      >
        <span>{months[selectedMonth.month]} {selectedMonth.year}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20 overflow-hidden"
            >
              <div className="p-2">
                {years.map((year) => (
                  <div key={year} className="mb-2">
                    <h3 className="text-sm font-semibold text-muted px-2 py-1">{year}</h3>
                    <div className="grid grid-cols-3 gap-1">
                      {months.map((month, index) => (
                        <motion.button
                          key={`${year}-${index}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSelectMonth(index, year)}
                          className={`px-2 py-1 text-sm rounded ${
                            selectedMonth.month === index && selectedMonth.year === year
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {month.substring(0, 3)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MonthSelector