import { useEffect, useState } from 'react'
import { useTracker } from '../context/TrackerContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function MonthlyChart() {
  const { getChartData, categories } = useTracker()
  const [chartType, setChartType] = useState('line')
  const [chartData, setChartData] = useState(null)
  
  useEffect(() => {
    const data = getChartData()
    setChartData(data)
  }, [getChartData])
  
  if (!chartData) {
    return <div className="flex items-center justify-center h-full">Loading chart data...</div>
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  }
  
  // Enhance the chart data for better visualization
  const enhancedChartData = {
    ...chartData,
    datasets: chartData.datasets.map(dataset => ({
      ...dataset,
      fill: chartType === 'line' ? 'origin' : false,
      backgroundColor: chartType === 'line' ? `${dataset.backgroundColor}20` : dataset.backgroundColor,
    }))
  }
  
  return (
    <div className="h-full">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setChartType('line')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              chartType === 'line'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Line
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              chartType === 'bar'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Bar
          </button>
        </div>
      </div>
      
      {chartType === 'line' ? (
        <Line options={options} data={enhancedChartData} />
      ) : (
        <Bar options={options} data={enhancedChartData} />
      )}
    </div>
  )
}

export default MonthlyChart