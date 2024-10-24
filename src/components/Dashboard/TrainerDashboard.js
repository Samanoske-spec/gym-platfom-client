import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, notification } from 'antd';
import api from '../services/api';

const TrainerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/trainer/project', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setProjects(response.data);
    } catch (error) {
      notification.error({ message: 'Failed to fetch projects' });
    }
  };

  const handleCreateProject = async (values) => {
    try {
      await api.post('/trainer/project', values, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      notification.success({ message: 'Project created' });
      fetchProjects();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      notification.error({ message: 'Error creating project' });
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Create Project
      </Button>
      <Table
        dataSource={projects}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'description' },
          { title: 'Price', dataIndex: 'price' },
        ]}
        rowKey="id"
      />
      <Modal
        title="Create Project"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateProject}>
          <Form.Item name="name" rules={[{ required: true, message: 'Enter project name' }]}>
            <Input placeholder="Project Name" />
          </Form.Item>
          <Form.Item name="description" rules={[{ required: true, message: 'Enter description' }]}>
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item name="price" rules={[{ required: true, message: 'Enter price' }]}>
            <Input type="number" placeholder="Price" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerDashboard;
