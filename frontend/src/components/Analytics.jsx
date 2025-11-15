import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function Analytics({ stats }) {
  const ratingDistribution = stats.ratingDistribution || {}

  const pieData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Rating Distribution',
        data: [
          ratingDistribution[1] || 0,
          ratingDistribution[2] || 0,
          ratingDistribution[3] || 0,
          ratingDistribution[4] || 0,
          ratingDistribution[5] || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const barData = {
    labels: ['Positive (4+)', 'Negative (<3)'],
    datasets: [
      {
        label: 'Feedback Count',
        data: [stats.positive || 0, stats.negative || 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return (
    <div>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Feedbacks</h3>
          <div className="value">{stats.total}</div>
        </div>
        <div className="analytics-card">
          <h3>Average Rating</h3>
          <div className="value">{stats.averageRating.toFixed(2)}</div>
        </div>
        <div className="analytics-card">
          <h3>Positive (4+)</h3>
          <div className="value">{stats.positive}</div>
        </div>
        <div className="analytics-card">
          <h3>Negative (&lt;3)</h3>
          <div className="value">{stats.negative}</div>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Rating Distribution</h3>
            <div className="chart-container">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
          <div className="chart-card">
            <h3>Positive vs Negative</h3>
            <div className="chart-container">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
