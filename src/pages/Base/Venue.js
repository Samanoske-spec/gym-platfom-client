import React, { useState, useEffect } from 'react';
import styles from '../../styles/Base/Venue.module.css';
import { getVenues, addVenue, updateVenue, deleteVenue } from '../../services/Base/venue';

const Venue = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVenueIndex, setSelectedVenueIndex] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    venue_name: '',
    peak_start: '',
    peak_end: '',
    credit_per_peak: '',
    credit_per_unpeak: ''
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const data = await getVenues();
      setVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Add error handling (e.g., show error message to user)
    }
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setSelectedVenueIndex(index);
    setFormData(venues[index]);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteVenue(venues[deleteIndex].id);
      await fetchVenues(); // Refresh the list
      setShowDeleteConfirm(false);
      setDeleteIndex(null);
      // Add success message
    } catch (error) {
      console.error('Error deleting venue:', error);
      // Add error handling
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedVenueIndex(null);
    setFormData({
      venue_name: '',
      peak_start: '',
      peak_end: '',
      credit_per_peak: '',
      credit_per_unpeak: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateVenue(venues[selectedVenueIndex].id, formData);
      } else {
        await addVenue(formData);
      }
      await fetchVenues(); // Refresh the list
      setIsModalOpen(false);
      resetForm();
      // Add success message
    } catch (error) {
      console.error('Error saving venue:', error);
      // Add error handling
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedVenueIndex(null);
    setFormData({
      venue_name: '',
      peak_start: '',
      peak_end: '',
      credit_per_peak: '',
      credit_per_unpeak: ''
    });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className={styles['venue-container']}>
      <h1><center>Venue</center></h1>
      <div className={styles['venue-content']}>
        <div className={styles['add-button-container']}>
          <button 
            className={styles['add-btn']}
            onClick={handleAdd}
          >
            Add New Venue
          </button>
        </div>

        <table className={styles['venue-table']}>
          <thead>
            <tr>
                <th>No.</th>
              <th>Venue Name</th>
              <th>Peak Start</th>
              <th>Peak End</th>
              <th>Credits (Peak)</th>
              <th>Credits (Non-Peak)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue, index) => (
              <tr key={index}>
                <td>{(index+1)}</td>
                <td>{venue.venue_name}</td>
                <td>{venue.peak_start}</td>
                <td>{venue.peak_end}</td>
                <td>{venue.credit_per_peak}</td>
                <td>{venue.credit_per_unpeak}</td>
                <td className={styles['action-buttons']}>
                  <button 
                    className={styles['edit-btn']}
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button 
                    className={styles['delete-btn']}
                    onClick={() => handleDeleteClick(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete Confirmation Popup */}
        {showDeleteConfirm && (
          <div className={styles['modal-overlay']}>
            <div className={styles['confirm-popup']}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this venue?</p>
              <div className={styles['confirm-buttons']}>
                <button 
                  className={styles['confirm-btn']}
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
                <button 
                  className={styles['cancel-btn']}
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className={styles['modal-overlay']}>
            <div className={styles['modal']}>
              <h2>{isEditing ? 'Edit Venue' : 'Add New Venue'}</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles['form-group']}>
                  <label>Venue Name:</label>
                  <input
                    type="text"
                    value={formData.venue_name}
                    onChange={(e) => setFormData({...formData, venue_name: e.target.value})}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Peak Start:</label>
                  <input
                    type="time"
                    value={formData.peak_start}
                    onChange={(e) => setFormData({...formData, peak_start: e.target.value})}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Peak End:</label>
                  <input
                    type="time"
                    value={formData.peak_end}
                    onChange={(e) => setFormData({...formData, peak_end: e.target.value})}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Credits (Peak):</label>
                  <input
                    type="number"
                    value={formData.credit_per_peak}
                    onChange={(e) => setFormData({...formData, credit_per_peak: e.target.value})}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Credits (Non-Peak):</label>
                  <input
                    type="number"
                    value={formData.credit_per_unpeak}
                    onChange={(e) => setFormData({...formData, credit_per_unpeak: e.target.value})}
                    required
                  />
                </div>
                <div className={styles['modal-buttons']}>
                  <button type="submit" className={styles['submit-btn']}>
                    {isEditing ? 'Save Changes' : 'Add Venue'}
                  </button>
                  <button 
                    type="button" 
                    className={styles['cancel-btn']}
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venue;
