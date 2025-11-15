import React from 'react'

function FeedbackTable({ feedbacks, onEdit, onDelete }) {
  if (feedbacks.length === 0) {
    return (
      <div className="empty-state">
        <p>No feedbacks found.</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Message</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.name}</td>
              <td>{feedback.email || '-'}</td>
              <td>
                <span style={{ color: '#ffc107', fontSize: '18px' }}>
                  {getRatingStars(feedback.rating)}
                </span>
                <span style={{ marginLeft: '8px' }}>({feedback.rating}/5)</span>
              </td>
              <td style={{ maxWidth: '400px', wordWrap: 'break-word' }}>
                {feedback.message}
              </td>
              <td>{formatDate(feedback.createdAt)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => onEdit(feedback)}
                    className="btn btn-secondary btn-sm"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(feedback.id)}
                    className="btn btn-danger btn-sm"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FeedbackTable

