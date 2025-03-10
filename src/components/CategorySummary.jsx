import { useTracker } from '../context/TrackerContext'
import { motion } from 'framer-motion'

function CategorySummary() {
  const { getMonthlySummary } = useTracker()
  const summary = getMonthlySummary()
  
  // Calculate total for percentage
  const total = summary.reduce((sum, item) => sum + item.totalValue, 0)
  
  return (
    <div className="space-y-4">
      {summary.map((item) => {
        const percentage = total > 0 ? Math.round((item.totalValue / total) * 100) : 0
        
        return (
          <div key={item.category.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.category.color }}
                ></span>
                <span className="text-sm font-medium">{item.category.name}</span>
              </div>
              <span className="text-sm font-semibold">{percentage}%</span>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full progress-bar"
                style={{ backgroundColor: item.category.color }}
              ></motion.div>
            </div>
            
            <div className="flex justify-between text-xs text-muted">
              <span>{item.entryCount} entries</span>
              <span>Total: {item.totalValue}</span>
            </div>
          </div>
        )
      })}
      
      {summary.length === 0 && (
        <div className="text-center py-4 text-muted">
          No data available for this month
        </div>
      )}
    </div>
  )
}

export default CategorySummary