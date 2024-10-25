// src/components/AdminBookingCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Button, List, message, Popover, Typography, Space } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Text } = Typography;

const statusColors = {
  requested: 'processing',
  approved: 'success',
  rejected: 'error',
};

const AdminBookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/booking/admin');
      setBookings(data);
    } catch (error) {
      message.error('Failed to load bookings');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/booking/admin/${id}`, { status: 'approved' });
      message.success('Booking approved');
      fetchBookings();
      setIsModalOpen(false);
    } catch (error) {
      message.error('Failed to approve booking');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/booking/admin/${id}`, { status: 'rejected' });
      message.success('Booking rejected');
      fetchBookings();
      setIsModalOpen(false);
    } catch (error) {
      message.error('Failed to reject booking');
    }
  };

  // Render bookings as badges inside a Popover
 
  
  const dateCellRender = (date) => {
    const currentDate = moment(date).utc().startOf('day');  // Start of the day in UTC
    const nextDate = moment(date).utc().endOf('day');  // End of the day in UTC

    console.log(`Current Date (Start): ${currentDate.format()}`);
    console.log(`Current Date (End): ${nextDate.format()}`);

    // Filter bookings where `start_time` falls within the same day (UTC)
    const dayBookings = bookings.filter((booking) =>
        moment(booking.start_time).isBetween(currentDate, nextDate, null, '[]')
    );

    console.log(`Bookings for ${currentDate.format('YYYY-MM-DD')}:`, dayBookings);

    return (
      <Space direction="vertical" size="small">
        {dayBookings.map((booking) => (
          <Popover
            key={booking.id}
            content={
              <div>
                <Text strong>{booking.space_name}</Text>
                <p>{moment(booking.start_time).format('HH:mm')} - {moment(booking.end_time).format('HH:mm')}</p>
                <Text>Status: <Badge status={statusColors[booking.status]} text={booking.status} /></Text>
              </div>
            }
            title="Booking Details"
            trigger="hover"
          >
            <Badge
              status={statusColors[booking.status]}
              text={`${booking.space_name}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedBooking(booking);
                setIsModalOpen(true);
              }}
            />
          </Popover>
        ))}
      </Space>
    );
  };

  return (
    <>
      <Calendar dateCellRender={dateCellRender} />

      <Modal
        title="Approve or Reject Booking"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="reject" danger onClick={() => handleReject(selectedBooking.id)}>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleApprove(selectedBooking.id)}>
            Approve
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div>
            <p><strong>Space:</strong> {selectedBooking.space_name}</p>
            <p><strong>Purpose:</strong> {selectedBooking.purpose}</p>
            <p>
              <strong>Time:</strong> {moment(selectedBooking.start_time).format('YYYY-MM-DD HH:mm')} 
              to {moment(selectedBooking.end_time).format('YYYY-MM-DD HH:mm')}
            </p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminBookingCalendar;
