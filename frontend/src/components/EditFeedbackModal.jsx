import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

function EditFeedbackModal({ feedback, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: feedback.name,
    email: feedback.email || '',
    message: feedback.message,
    rating: feedback.rating,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData({
      name: feedback.name,
      email: feedback.email || '',
      message: feedback.message,
      rating: feedback.rating,
    })
    setErrors({})
  }, [feedback])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setErrors({})
  }

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    })
    setErrors({})
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (formData.email && formData.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message cannot exceed 1000 characters'
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      await axios.put(`/api/feedback/${feedback.id}/`, formData)
      toast.success('Feedback updated successfully!')
      onUpdate()
      onClose()
    } catch (err) {
      const errorMsg =
        err.response?.data?.name?.[0] ||
        err.response?.data?.message?.[0] ||
        err.response?.data?.rating?.[0] ||
        'Failed to update feedback. Please try again.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Feedback</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-name">Name *</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="edit-email">Email</label>
            <input
              type="email"
              id="edit-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="edit-message">Message *</label>
            <textarea
              id="edit-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
            />
            {errors.message && <div className="error">{errors.message}</div>}
          </div>
          <div className="form-group">
            <label>Rating *</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${formData.rating >= star ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
            {errors.rating && <div className="error">{errors.rating}</div>}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditFeedbackModal

