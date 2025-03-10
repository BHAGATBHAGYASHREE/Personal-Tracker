import { createContext, useContext, useState, useEffect } from 'react'

const TrackerContext = createContext()

// Sample initial data
const initialCategories = [
  { id: 1, name: 'Fitness', color: '#6366f1', icon: 'fitness' },
  { id: 2, name: 'Finance', color: '#10b981', icon: 'finance' },
  { id: 3, name: 'Learning', color: '#f59e0b', icon: 'learning' },
  { id: 4, name: 'Productivity', color: '#ef4444', icon: 'productivity' }
]

const generateSampleData = () => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const months = []
  
  // Generate data for the last 6 months
  for (let i = 0; i < 6; i++) {
    const month = (currentMonth - i + 12) % 12
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
    
    const entries = []
    
    // Generate random entries for each category
    initialCategories.forEach(category => {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      // Generate 5-15 entries per category per month
      const entryCount = Math.floor(Math.random() * 10) + 5
      
      for (let j = 0; j < entryCount; j++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1
        const value = Math.floor(Math.random() * 100) + 1
        
        entries.push({
          id: `${year}${month}${day}${category.id}${j}`,
          categoryId: category.id,
          date: new Date(year, month, day),
          value,
          note: `Sample ${category.name} entry`
        })
      }
    })
    
    months.push({
      month,
      year,
      entries
    })
  }
  
  return months
}

export function TrackerProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('tracker_categories')
    return saved ? JSON.parse(saved) : initialCategories
  })
  
  const [monthlyData, setMonthlyData] = useState(() => {
    const saved = localStorage.getItem('tracker_data')
    return saved ? JSON.parse(saved) : generateSampleData()
  })
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date()
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    }
  })
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tracker_categories', JSON.stringify(categories))
    localStorage.setItem('tracker_data', JSON.stringify(monthlyData))
  }, [categories, monthlyData])
  
  // Get current month's data
  const getCurrentMonthData = () => {
    return monthlyData.find(
      data => data.month === selectedMonth.month && data.year === selectedMonth.year
    ) || { month: selectedMonth.month, year: selectedMonth.year, entries: [] }
  }
  
  // Add new entry
  const addEntry = (categoryId, value, note = '') => {
    const newEntry = {
      id: `entry_${Date.now()}`,
      categoryId,
      date: new Date(),
      value,
      note
    }
    
    const currentMonthData = getCurrentMonthData()
    const otherMonths = monthlyData.filter(
      data => data.month !== selectedMonth.month || data.year !== selectedMonth.year
    )
    
    setMonthlyData([
      ...otherMonths,
      {
        ...currentMonthData,
        entries: [...currentMonthData.entries, newEntry]
      }
    ])
    
    return newEntry
  }
  
  // Add new category
  const addCategory = (name, color, icon) => {
    const newCategory = {
      id: Date.now(),
      name,
      color,
      icon
    }
    
    setCategories([...categories, newCategory])
    return newCategory
  }
  
  // Get category by ID
  const getCategoryById = (id) => {
    return categories.find(category => category.id === id)
  }
  
  // Get entries by category
  const getEntriesByCategory = (categoryId) => {
    const currentMonthData = getCurrentMonthData()
    return currentMonthData.entries.filter(entry => entry.categoryId === categoryId)
  }
  
  // Get monthly summary
  const getMonthlySummary = () => {
    const currentMonthData = getCurrentMonthData()
    
    return categories.map(category => {
      const entries = currentMonthData.entries.filter(
        entry => entry.categoryId === category.id
      )
      
      const totalValue = entries.reduce((sum, entry) => sum + entry.value, 0)
      const entryCount = entries.length
      
      return {
        category,
        totalValue,
        entryCount
      }
    })
  }
  
  // Get data for charts
  const getChartData = () => {
    // Sort months chronologically
    const sortedMonths = [...monthlyData].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })
    
    const labels = sortedMonths.map(data => {
      const date = new Date(data.year, data.month, 1)
      return format(date, 'MMM yyyy')
    })
    
    const datasets = categories.map(category => {
      const data = sortedMonths.map(monthData => {
        const categoryEntries = monthData.entries.filter(
          entry => entry.categoryId === category.id
        )
        return categoryEntries.reduce((sum, entry) => sum + entry.value, 0)
      })
      
      return {
        label: category.name,
        data,
        backgroundColor: category.color,
        borderColor: category.color
      }
    })
    
    return { labels, datasets }
  }
  
  const value = {
    categories,
    selectedMonth,
    setSelectedMonth,
    addEntry,
    addCategory,
    getCategoryById,
    getEntriesByCategory,
    getMonthlySummary,
    getChartData
  }
  
  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  )
}

// Custom hook to use the tracker context
export function useTracker() {
  const context = useContext(TrackerContext)
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider')
  }
  return context
}

// Helper function to format dates
function format(date, formatStr) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const year = date.getFullYear()
  const month = date.getMonth()
  
  return formatStr.replace('MMM', months[month]).replace('yyyy', year)
}