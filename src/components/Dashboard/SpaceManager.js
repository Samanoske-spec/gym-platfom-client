// src/components/SpaceManager.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, TimePicker, InputNumber, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const SpaceManager = () => {
  const [spaces, setSpaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/spaces');
      setSpaces(data);
    } catch (error) {
      message.error('Failed to load spaces');
    }
  };

  const handleAddOrEdit = async () => {
    const values = await form.validateFields();
    try {
      if (editingSpace) {
        // Update space
        await axios.put(`http://localhost:5000/spaces/${editingSpace.id}`, values);
        message.success('Space updated successfully');
      } else {
        // Add new space
        await axios.post('http://localhost:5000/spaces', values);
        message.success('Space added successfully');
      }
      fetchSpaces();
      setIsModalOpen(false);
      form.resetFields();
      setEditingSpace(null);
    } catch (error) {
      message.error('Failed to save space');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/spaces/${id}`);
      message.success('Space deleted successfully');
      fetchSpaces();
    } catch (error) {
      message.error('Failed to delete space');
    }
  };

  const openModal = (space = null) => {
    setEditingSpace(space);
    if (space) {
      form.setFieldsValue({
        ...space,
        peak_start: moment(space.peak_start, 'HH:mm'),
        peak_end: moment(space.peak_end, 'HH:mm'),
      });
    }
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Off-Peak Rate', dataIndex: 'hourly_rate_off_peak', key: 'hourly_rate_off_peak' },
    { title: 'Peak Rate', dataIndex: 'hourly_rate_peak', key: 'hourly_rate_peak' },
    { title: 'Peak Start', dataIndex: 'peak_start', key: 'peak_start' },
    { title: 'Peak End', dataIndex: 'peak_end', key: 'peak_end' },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button onClick={() => openModal(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)} style={{ marginLeft: '8px' }}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: '16px' }}>
        Add Space
      </Button>
      <Table columns={columns} dataSource={spaces} rowKey="id" />
      <Modal
        title={editingSpace ? 'Edit Space' : 'Add Space'}
        open={isModalOpen}
        onOk={handleAddOrEdit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hourly_rate_off_peak" label="Off-Peak Rate" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="hourly_rate_peak" label="Peak Rate" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="peak_start" label="Peak Start" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item name="peak_end" label="Peak End" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SpaceManager;
