import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import FeedbackForm from './FeedbackForm'
import FeedbackTable from './FeedbackTable'
import Analytics from './Analytics'
import EditFeedbackModal from './EditFeedbackModal'
import '../App.css'

function Dashboard({ user, onLogout, darkMode, onToggleDarkMode }) {
  const [feedbacks, setFeedbacks] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    positive: 0,
    negative: 0,
    ratingDistribution: {},
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingFeedback, setEditingFeedback] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchFeedbacks()
    fetchStats()
  }, [searchQuery, ratingFilter, sortBy, currentPage])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (ratingFilter) params.append('rating', ratingFilter)
      if (sortBy) params.append('sort', sortBy)
      params.append('page', currentPage)
      params.append('page_size', itemsPerPage)

      const response = await axios.get(`/api/feedback/?${params.toString()}`)
      const data = response.data.results || response.data
      setFeedbacks(Array.isArray(data) ? data : [])
      
      if (response.data.count !== undefined) {
        setTotalPages(Math.ceil(response.data.count / itemsPerPage))
      } else {
        setTotalPages(1)
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err)
      toast.error('Failed to load feedbacks')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/feedback/stats/')
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleFeedbackAdded = () => {
    fetchFeedbacks()
    fetchStats()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return
    }

    try {
      await axios.delete(`/api/feedback/${id}/`)
      toast.success('Feedback deleted successfully!')
      fetchFeedbacks()
      fetchStats()
    } catch (err) {
      toast.error('Failed to delete feedback')
    }
  }

  const handleUpdate = () => {
    fetchFeedbacks()
    fetchStats()
  }

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (ratingFilter) params.append('rating', ratingFilter)
      if (sortBy) params.append('sort', sortBy)

      const url = `/api/feedback/export_csv/${params.toString() ? '?' + params.toString() : ''}`
      const response = await axios.get(url, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url_blob = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url_blob
      link.download = 'feedbacks.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url_blob)
      toast.success('CSV exported successfully!')
    } catch (err) {
      console.error('Error exporting CSV:', err)
      toast.error('Failed to export CSV')
    }
  }

  const handleExportExcel = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (ratingFilter) params.append('rating', ratingFilter)
      if (sortBy) params.append('sort', sortBy)

      const url = `/api/feedback/export_excel/${params.toString() ? '?' + params.toString() : ''}`
      const response = await axios.get(url, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url_blob = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url_blob
      link.download = 'feedbacks.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url_blob)
      toast.success('Excel file exported successfully!')
    } catch (err) {
      console.error('Error exporting Excel:', err)
      toast.error('Failed to export Excel file')
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleRatingFilterChange = (e) => {
    setRatingFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Feedback Dashboard</h1>
        <div className="header-actions">
          <button
            onClick={onToggleDarkMode}
            className="btn btn-secondary"
            style={{ marginRight: '12px' }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <span style={{ color: 'white', marginRight: '12px' }}>
            Welcome, {user?.username || 'User'}!
          </span>
          <button onClick={onLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <Analytics stats={stats} />

      <div className="card">
        <h2>Submit Feedback</h2>
        <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
      </div>

      <div className="card">
        <div className="table-header">
          <h2>All Feedbacks</h2>
          <div className="export-buttons">
            <button onClick={handleExportCSV} className="btn btn-success">
              Export CSV
            </button>
            <button onClick={handleExportExcel} className="btn btn-success">
              Export Excel
            </button>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="filters">
            <select value={ratingFilter} onChange={handleRatingFilterChange}>
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_rating">Highest Rating</option>
              <option value="lowest_rating">Lowest Rating</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading feedbacks...</p>
          </div>
        ) : (
          <>
            <FeedbackTable
              feedbacks={feedbacks}
              onEdit={setEditingFeedback}
              onDelete={handleDelete}
            />
            {editingFeedback && (
              <EditFeedbackModal
                feedback={editingFeedback}
                onClose={() => setEditingFeedback(null)}
                onUpdate={handleUpdate}
              />
            )}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
