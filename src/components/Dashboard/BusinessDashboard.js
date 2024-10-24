import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import api from '../../services/api';

const BusinessDashboard = () => {
  const [venues, setVenues] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await api.get('/business/venue', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setVenues(response.data);
    } catch (error) {
      console.error('Failed to fetch venues', error);
    }
  };

  const handleCreateVenue = async (values) => {
    try {
      await api.post('/business/venue', values, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      fetchVenues();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to create venue', error);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)}>Create Venue</Button>
      <Table dataSource={venues} columns={[{ title: 'Name', dataIndex: 'name' }, { title: 'Address', dataIndex: 'address' }]} />

      <Modal
        title="Create Venue"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleCreateVenue}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input the venue name!' }]}>
            <Input placeholder="Venue Name" />
          </Form.Item>
          <Form.Item name="address" rules={[{ required: true, message: 'Please input the venue address!' }]}>
            <Input placeholder="Address" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Create</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessDashboard;
