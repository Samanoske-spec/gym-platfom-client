import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification } from 'antd';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/business/venue', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setData(response.data);
    } catch (error) {
      notification.error({ message: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post('http://localhost:5000/business/venue', values, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      notification.success({ message: 'Venue created successfully' });
      fetchData();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      notification.error({ message: 'Failed to create venue' });
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Create Venue
      </Button>
      <Table dataSource={data} loading={loading} rowKey="id" columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Location', dataIndex: 'location' },
        { title: 'Price', dataIndex: 'price' },
      ]} />
      <Modal
        title="Create Venue"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate}>
          <Form.Item name="venueName" label="Venue Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
