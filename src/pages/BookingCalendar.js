// src/components/BookingCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Button, Form, Input, DatePicker, Select, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/bookings');
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
      <Badge
        key={booking.id}
        status="success"
        text={`${booking.purpose} (${booking.status})`}
      />
    ));
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { purpose, timeRange, class_size, status, amount } = values;
      const [start_time, end_time] = timeRange;
      await axios.post('http://localhost:5000/bookings', {
        user_id: 1, // Replace with dynamic user ID
        purpose,
        start_time,
        end_time,
        class_size,
        status,
        amount,
      });
      message.success('Booking created successfully');
      fetchBookings();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create booking');
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Booking
      </Button>
      <Calendar dateCellRender={dateCellRender} />
      <Modal
        title="Create Booking"
        open={isModalOpen}
        onOk={handleOk}
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
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="requested">Requested</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="starting">Starting</Option>
              <Option value="started">Started</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BookingCalendar;
