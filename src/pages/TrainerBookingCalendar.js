// src/components/TrainerBookingCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Form, Select, Button, DatePicker, Input, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TrainerBookingCalendar = () => {
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [form] = Form.useForm();
  const trainerId = localStorage.getItem("userId");
  useEffect(() => {
    fetchSpaces();
    fetchBookings();
  }, []);

  const fetchSpaces = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/booking/available-spaces', {
        params: { start_date: moment().startOf('week').format(), end_date: moment().endOf('week').format() },
      });
      setSpaces(data);
    } catch (error) {
      message.error('Failed to load spaces');
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/booking/trainer/${trainerId}`);
      setBookings(data);
    } catch (error) {
      message.error('Failed to load bookings');
    }
  };

  const handleRequestBooking = async () => {
    const values = await form.validateFields();
    const { space_id, timeRange, purpose } = values;
    const [start_time, end_time] = timeRange;

    try {
      await axios.post('http://localhost:5000/booking/request', {
        user_id: trainerId,
        space_id,
        start_time,
        end_time,
        purpose,
      });

      message.success('Booking request submitted');
      fetchBookings();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit booking request');
    }
  };

  const dateCellRender = (date) => {
    const currentDate = moment(date).utc().startOf('day');  // Start of the day in UTC
    const nextDate = moment(date).utc().endOf('day');  // End of the day in UTC

    console.log(`Current Date (Start): ${currentDate.format()}`);
    console.log(`Current Date (End): ${nextDate.format()}`);

    // Filter bookings where `start_time` falls within the same day (UTC)
    const dayBookings = bookings.filter((booking) =>
        moment(booking.start_time).isBetween(currentDate, nextDate, null, '[]')
    );

    return dayBookings.map((booking) => (
      <div key={booking.id}>
        <span>{booking.space_name} ({booking.status})</span>
      </div>
    ));
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: '16px' }}>
        Request Booking
      </Button>
      <Calendar dateCellRender={dateCellRender} />

      <Modal
        title="Request Booking"
        open={isModalOpen}
        onOk={handleRequestBooking}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="space_id" label="Select Space" rules={[{ required: true }]}>
            <Select>
              {spaces.map((space) => (
                <Option key={space.id} value={space.id}>
                  {space.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="timeRange" label="Select Time" rules={[{ required: true }]}>
            <RangePicker showTime />
          </Form.Item>
          <Form.Item name="purpose" label="Purpose" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TrainerBookingCalendar;
