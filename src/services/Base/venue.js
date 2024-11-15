import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getVenues = async () => {
  try {
    const response = await axios.get(`${API_URL}/base/venues`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addVenue = async (venueData) => {
  try {
    const response = await axios.post(`${API_URL}/base/venues`, venueData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVenue = async (id, venueData) => {
  try {
    const response = await axios.put(`${API_URL}/base/venues/${id}`, venueData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVenue = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/base/venues/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
