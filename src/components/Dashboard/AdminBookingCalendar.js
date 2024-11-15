import { Calendar, Badge, Modal, message, Button } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import api from '../../services/api';

const AdminBookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/booking/admin');
      setBookings(data);
    } catch (error) {
      message.error('Failed to load bookings');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/booking/admin/${id}`, { status: 'approved' });
      message.success('Booking approved');
      fetchBookings();
    } catch (error) {
      message.error('Failed to approve booking');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/booking/admin/${id}`, { status: 'rejected' });
      message.success('Booking rejected');
      fetchBookings();
    } catch (error) {
      message.error('Failed to reject booking');
    }
  };

  const dateCellRender = (date) => {
    var tempdate = new Date();
    tempdate = date.toDate();
    var ddate = tempdate.getYear() + '-' + tempdate.getMonth() + '-' + tempdate.getDate();
  
    const dayBookings = bookings.filter((booking) => {
      if (!booking || !booking.start_time) return false;
      const bookingData = new Date(booking.start_time);
      if (booking.recurrence === 'daily') return true;
  
      if (booking.recurrence === 'weekly') {
        return bookingData.getDay() == tempdate.getDay();
      }
      var tempbooking = bookingData.getYear() + '-' + bookingData.getMonth() + '-' + bookingData.getDate();
      return ddate == tempbooking;
    });
  

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {dayBookings.map((booking) => (
          <li key={booking.id}>
            <Badge
              status={booking.status === 'approved' ? 'success' : 'processing'}
              text={`${booking.space_name} (${booking.status})`}
              onClick={() => setSelectedBooking(booking)}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Calendar dateCellRender={dateCellRender} />
      {selectedBooking && (
        <Modal
          title="Approve or Reject Booking"
          visible={!!selectedBooking}
          onCancel={() => setSelectedBooking(null)}
          footer={[
            <Button key="reject" danger onClick={() => handleReject(selectedBooking.id)}>
              Reject
            </Button>,
            <Button key="approve" type="primary" onClick={() => handleApprove(selectedBooking.id)}>
              Approve
            </Button>,
          ]}
        >
          <p><strong>Space:</strong> {selectedBooking.space_name}</p>
          <p><strong>Purpose:</strong> {selectedBooking.purpose}</p>
          <p><strong>Time:</strong> {moment(selectedBooking.start_time).format('YYYY-MM-DD HH:mm')}</p>
        </Modal>
      )}
    </>
  );
};

export default AdminBookingCalendar;
