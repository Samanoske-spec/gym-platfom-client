import { Calendar, Badge, Modal, message, Button, Form, Input, DatePicker, Select, Radio } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import api from '../services/api';
import { isCompositeComponent } from 'react-dom/test-utils';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TrainerBookingCalendar = ({ currentUser }) => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [recurrence, setRecurrence] = useState('none');
  const trainer_id = localStorage.getItem('userId');
  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch bookings for the trainer
  const fetchBookings = async () => {
    try {
      const { data } = await api.get(`/booking/trainer/${trainer_id}`);
      setBookings(data);
    } catch (error) {
      message.error('Failed to load bookings');
    }
  };

  // Handle the booking form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { space_id, timeRange, purpose, recurrence_day } = values;
      const [start_time, end_time] = timeRange.map((time) => moment(time).format('YYYY-MM-DD HH:mm:ss'));

      await api.post('/booking/request', {
        user_id: trainer_id,
        space_id,
        start_time,
        end_time,
        purpose,
        recurrence,
        recurrence_day: recurrence === 'weekly' ? recurrence_day : null,
      });

      message.success('Booking request submitted');
      setIsModalOpen(false);
      fetchBookings();
    } catch (error) {
      message.error('Failed to create booking');
    }
  };

  const dateCellRender = (date) => {
    var tempdate = new Date();
    tempdate = date.toDate();
    var ddate = tempdate.getYear() + '-' + tempdate.getMonth() + '-' + tempdate.getDate();
    const currentDate = moment(date).startOf('day'); // Use the provided `date` parameter
    const nativeDateString = date.toDate().toString(); // Convert Moment object to native Date string
    // console.log('Native Date String:', nativeDateString);
  
    const dayBookings = bookings.filter((booking) => {
      if (!booking || !booking.start_time) return false; // Validate booking
      const bookingData = new Date(booking.start_time);
      if (booking.recurrence === 'daily') return true; // Show daily bookings every day
  
      if (booking.recurrence === 'weekly') {
        return bookingData.getDay() == tempdate.getDay();
      }
      var tempbooking = bookingData.getYear() + '-' + bookingData.getMonth() + '-' + bookingData.getDate();
      // Match exact day for one-time bookings
      return ddate == tempbooking;
      // return bookingDate.isSame(currentDate, 'day');
    });
  
  
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {dayBookings.length > 0 ? (
          dayBookings.map((booking) =>
            booking && booking.id ? (
              <li key={booking.id}>
                <Badge
                  status={booking.user_id === trainer_id ? 'processing' : 'default'}
                  text={`${booking.space_name} (${booking.status})`}
                />
              </li>
            ) : null
          )
        ) : (
          <li>No bookings for this date</li>
        )}
      </ul>
    );
  };
  

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: '16px' }}>
        Request Booking
      </Button>
      <Calendar dateCellRender={dateCellRender} />
      
      <Modal
        title="Request Booking"
        visible={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="space_id" label="Select Space" rules={[{ required: true }]}>
            <Select>
              <Option value={1}>Volley Ball Court</Option>
              <Option value={2}>Tennis Court</Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeRange" label="Select Time" rules={[{ required: true }]}>
            <RangePicker showTime />
          </Form.Item>
          <Form.Item name="purpose" label="Purpose" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Recurrence">
            <Radio.Group onChange={(e) => setRecurrence(e.target.value)} value={recurrence}>
              <Radio value="none">Only Today</Radio>
              <Radio value="daily">Daily</Radio>
              <Radio value="weekly">Weekly</Radio>
            </Radio.Group>
          </Form.Item>
          {recurrence === 'weekly' && (
            <Form.Item name="recurrence_day" label="Select Day of Week" rules={[{ required: true }]}>
              <Select>
                <Option value="Monday">Monday</Option>
                <Option value="Tuesday">Tuesday</Option>
                <Option value="Wednesday">Wednesday</Option>
                <Option value="Thursday">Thursday</Option>
                <Option value="Friday">Friday</Option>
                <Option value="Saturday">Saturday</Option>
                <Option value="Sunday">Sunday</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default TrainerBookingCalendar;
