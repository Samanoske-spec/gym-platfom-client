import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Button, Form, Input, DatePicker, Select, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminBookingCalendar = ({ userRole }) => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [price, setPrice] = useState(0);
  const [bookform] = Form.useForm();
  const [booking, setBooking] = useState([]);

  const fetchSpaces = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/spaces');
      setSpaces(data);
    } catch (error) {
      message.error('Failed to load spaces');
    }
  };

  const handleSpaceChange = async (spaceId) => {
    setSelectedSpace(spaceId);
    const values = await bookform.getFieldsValue();
    if (values.timeRange) calculatePrice(spaceId, values.timeRange);
  };

  const calculatePrice = async (spaceId, timeRange) => {
    const [start_time, end_time] = timeRange;
    try {
      const { data } = await axios.post('http://localhost:5000/api/calculate-price', {
        space_id: spaceId,
        start_time,
        end_time,
      });
      setPrice(data.price);
    } catch (error) {
      message.error('Failed to calculate price');
    }
  };

  const handleApprove = async () => {
    const values = await bookform.validateFields();
    const { timeRange } = values;
    const [start_time, end_time] = timeRange;

    try {
      await axios.put(`http://localhost:5000/api/bookings/${booking.id}/approve`, {
        space_id: selectedSpace,
        start_time,
        end_time,
        status: 'approved',
      });
      message.success('Booking approved');
      onClose();
    } catch (error) {
      message.error('Failed to approve booking');
    }
  };
  useEffect(() => {
    // fetchBookings();
    // fetchSpaces();
  }, []);
  const onClose = () => {

  }
  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/bookings');
      setBookings(data);
    } catch (error) {
      message.error('Failed to load bookings');
    }
  };

  const dateCellRender = (date) => {
    const dailyBookings = bookings.filter((booking) =>
      moment(booking.start_time).isSame(date, 'day')
    );
    return dailyBookings.map((booking) => (
      <Badge key={booking.id} status="success" text={`${booking.purpose} (${booking.status})`} />
    ));
  };

  const handleRequestBooking = async () => {
    try {
      const values = await form.validateFields();
      const { purpose, timeRange, class_size } = values;
      const [start_time, end_time] = timeRange;

      await axios.post('http://localhost:5000/api/bookings/request', {
        user_id: 1, // Dynamic user ID
        purpose,
        start_time,
        end_time,
        class_size,
      });

      message.success('Booking request submitted');
      fetchBookings();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to request booking');
    }
  };

  const handleApproveBooking = async (status, price) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${selectedBooking.id}/approve`, {
        status,
        price,
      });
      message.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      message.error('Failed to update booking');
    }
  };

  return (
    <>
      {userRole === 'trainer' && (
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Request Booking
        </Button>
      )}
      <Calendar dateCellRender={dateCellRender} />
      <Modal
        title="Request Booking"
        open={isModalOpen}
        onOk={handleRequestBooking}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="purpose" label="Purpose" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="timeRange" label="Time Range" rules={[{ required: true }]}>
            <RangePicker showTime />
          </Form.Item>
          <Form.Item name="class_size" label="Class Size" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {userRole === 'staff' && selectedBooking && (
        <div>
          <h3>Approve or Reject Booking</h3>
          <Button
            type="primary"
            onClick={() => handleApproveBooking('approved', selectedBooking.amount)}
          >
            Approve
          </Button>
          <Button
            danger
            onClick={() => handleApproveBooking('rejected', 0)}
          >
            Reject
          </Button>
        </div>
      )}
      <Modal
      title="Approve Booking"
      open={null}
      //open = {!!booking}
      onCancel={onClose}
      onOk={handleApprove}
    >
      <Form form={bookform} layout="vertical">
        <Form.Item name="space" label="Select Space" rules={[{ required: true }]}>
          <Select onChange={handleSpaceChange}>
            {spaces.map((space) => (
              <Option key={space.id} value={space.id}>
                {space.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="timeRange" label="Time Range" rules={[{ required: true }]}>
          <RangePicker showTime onChange={(range) => calculatePrice(selectedSpace, range)} />
        </Form.Item>
        <div>
          <strong>Calculated Price:</strong> ${price.toFixed(2)}
        </div>
      </Form>
    </Modal>
    </>
  );
};

export default AdminBookingCalendar;
