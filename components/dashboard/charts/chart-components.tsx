interface ChartDataPoint {
  month: string
  value?: number
  revenue?: number
  bookings?: number
}

interface PieChartDataPoint {
  name: string
  value: number
}

export const SimpleLineChart = ({ data }: { data: ChartDataPoint[] }) => {
  const maxValue = Math.max(...data.map((d) => d.revenue || d.bookings || d.value || 0))
  const points = data
    .map((item, index) => {
      const value = item.revenue || item.bookings || item.value || 0
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (value / maxValue) * 80
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="w-full h-full p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polyline fill="none" stroke="#3B82F6" strokeWidth="2" points={points} />
          {data.map((item, index) => {
            const value = item.revenue || item.bookings || item.value || 0
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (value / maxValue) * 80
            return <circle key={index} cx={x} cy={y} r="2" fill="#3B82F6" />
          })}
        </svg>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          {data.map((item, index) => (
            <span key={index}>{item.month}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const SimpleBarChart = ({ data }: { data: ChartDataPoint[] }) => {
  const maxValue = Math.max(...data.map((d) => d.bookings || d.value || 0))

  return (
    <div className="h-[300px] w-full flex items-end justify-center bg-gray-50 rounded-lg p-4 gap-2">
      {data.map((item, index) => {
        const height = ((item.bookings || item.value || 0) / maxValue) * 250
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs text-gray-600 mb-1">{item.bookings || item.value}</div>
            <div className="bg-green-500 rounded-t w-full min-h-[4px]" style={{ height: `${height}px` }} />
            <div className="text-xs text-gray-600 mt-1">{item.month}</div>
          </div>
        )
      })}
    </div>
  )
}

export const SimplePieChart = ({ data }: { data: PieChartDataPoint[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]

  return (
    <div className="h-[250px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="grid grid-cols-2 gap-4">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(0)
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[index % colors.length] }} />
                <div className="text-sm">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-600">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
