import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

function FeedbackForm({ onFeedbackAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

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
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters'
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
    
    if (formData.rating === 0) {
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
      await axios.post('/api/feedback/', formData)
      toast.success('Feedback submitted successfully!')
      setFormData({
        name: '',
        email: '',
        message: '',
        rating: 0,
      })
      setErrors({})
      onFeedbackAdded()
    } catch (err) {
      const errorMsg =
        err.response?.data?.name?.[0] ||
        err.response?.data?.message?.[0] ||
        err.response?.data?.rating?.[0] ||
        'Failed to submit feedback. Please try again.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
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
      </div>
      {errors.name && <div className="error">{errors.name}</div>}
      {errors.email && <div className="error">{errors.email}</div>}
      {errors.message && <div className="error">{errors.message}</div>}
      {errors.rating && <div className="error">{errors.rating}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
}

export default FeedbackForm

