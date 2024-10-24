import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Input, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../services/api';

const TrainerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  // Fetch projects when the component loads
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

  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/trainer/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      notification.success({ message: 'Project deleted successfully' });
      fetchProjects();
    } catch (error) {
      notification.error({ message: 'Failed to delete project' });
    }
  };

  const handleEdit = (record) => {
    setEditingProject(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingProject) {
        // Update project
        await api.put(`/trainer/project/${editingProject.id}`, values, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        notification.success({ message: 'Project updated successfully' });
      } else {
        // Create new project
        await api.post('/trainer/project', values, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        notification.success({ message: 'Project created successfully' });
      }
      fetchProjects();
      setIsModalVisible(false);
      form.resetFields();
      setEditingProject(null);
    } catch (error) {
      notification.error({ message: 'Operation failed' });
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text}` },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Projects" bordered={false}>
            {projects.length}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Active Trainees" bordered={false}>
            {/* Add logic to fetch trainee count */}
            10
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Revenue" bordered={false}>
            {/* Add logic to calculate total revenue */}
            $5000
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Create New Project
        </Button>
      </div>

      <Table
        dataSource={projects}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingProject ? 'Edit Project' : 'Create Project'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            label="Project Name"
            name="name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter project description' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please enter project price' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerDashboard;
