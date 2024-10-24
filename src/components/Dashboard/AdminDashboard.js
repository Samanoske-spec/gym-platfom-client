import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Popconfirm, notification, Space, Modal, Input, Form, Select, Upload, Image } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'; 
import api from '../../services/api';

const { TabPane } = Tabs;
const { Option } = Select;
const AdminDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal state
  const [form] = Form.useForm();
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false); // Modal state
  const [projectform] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const handleUserEdit = (record) =>{
    showEditModal(record);
  }
  const handleProjectEdit=  (record) =>{
    showProjectEditModal(record);
  }
  const showEditModal = (record) => {
    if (record.image_file) {
        setFileList([
          {
            uid: '-1',
            name: 'Current Photo',
            status: 'done',
            url: `/uploads/${record.image_file}`, // Ensure this path matches your backend setup
          },
        ]);
      }
    form.setFieldsValue(record); // Set the form with user data
    setIsModalVisible(true);
  };
  const showProjectEditModal = (record) => {
    projectform.setFieldsValue(record);
    setIsProjectModalVisible(true);
  }
  const handleModalOk = async () => {
    try {
    //   const updatedValues = await form.validateFields(); // Get the form values
    //   handleUserUpdate(record.id, updatedValues); // Call update handler with user ID and values
      setIsModalVisible(false); // Close the modal
      notification.success({ message: 'User updated successfully!' });
    } catch (error) {
      console.error('Validation failed:', error);
      notification.error({ message: 'Failed to update user' });
    }
  };
  const handleProjectModalOk = async () => {
    try {
    //   const updatedValues = await form.validateFields(); // Get the form values
    //   handleUserUpdate(record.id, updatedValues); // Call update handler with user ID and values
      setIsProjectModalVisible(false); // Close the modal
      notification.success({ message: 'Project updated successfully!' });
    } catch (error) {
      console.error('Validation failed:', error);
      notification.error({ message: 'Failed to update user' });
    }
  };
  const handleProjectModalCancel = () => {
    setIsProjectModalVisible(false);
  }
  const handleModalCancel = () => {
    setIsModalVisible(false); // Close the modal without saving
  };
  // Fetch all data when component loads
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, projectsResponse, sitesResponse] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/projects'),
        api.get('/admin/sites'),
      ]);
      setUsers(usersResponse.data.users); // Ensure data is always an array
      setProjects(projectsResponse.data.projects); // Ensure data is always an array
      setSites(sitesResponse.data.sites); // Ensure data is always an array
    } catch (error) {
      console.error('Failed to fetch data:', error);
      notification.error({ message: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await api.delete(`/admin/${type}/${id}`);
      notification.success({ message: `${type} deleted successfully` });
      fetchData(); // Refresh the table data
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      notification.error({ message: `Failed to delete ${type}` });
    }
  };
  const handleUserDelete = async (name, email) => {

  }
  const handleSiteDelete = async (content) => {

  }
  const handleProjectDelete = async (pname, price, description) => {

  }
  const usercolumns = [
    {title:'Name', dataIndex: 'name', key: 'name'},
    {title:'Email', dataIndex: 'email', key: 'email'},
    {title:'Role', dataIndex: 'role', key: 'role'},
    {title:'CountryCode', dataIndex: 'country_code', key: 'country_code'},
    {title:'MobileNo', dataIndex: 'mobile_no', key: 'mobile_no'},
    {title:'Profile', dataIndex: 'profile', key: 'profile'},
    {title:'Photo', dataIndex: 'image_file', key: 'image_file', 
        render: (image_file) =>
        image_file ? (
          <Image
            width={50}
            src={`localhost:5000/uploads/${image_file}`} // Ensure your backend serves this path
            alt="Profile"
            style={{ borderRadius: '50%' }} // Optional: Make the image circular
          />
        ) : (
          <Image
            width={50}
            src="https://via.placeholder.com/50" // Placeholder if no image
            alt="No Profile"
            style={{ borderRadius: '50%' }}
          />
        ),},
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button icon={<EditOutlined />} type="primary"  onClick={() => handleUserEdit(record)}>Edit</Button>
            <Popconfirm
              title={`Are you sure to delete this user?`}
              onConfirm={() => handleUserDelete(record.name, record.email)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger>Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
  ];
  const projectcolumns = [
    {title:'UserName', dataIndex: 'name', key: 'name'},
    {title:'Email', dataIndex: 'email', key: 'email'},
    {title:'ProjectName', dataIndex: 'pname', key: 'pname'},
    {title:'Description', dataIndex: 'description', key: 'description'},
    {title:'Price', dataIndex: 'price', key: 'price'},
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button icon={<EditOutlined />} type="primary"  onClick={() => handleProjectEdit(record)}>Edit</Button>
            <Popconfirm
              title={`Are you sure to delete this project?`}
              onConfirm={() => handleProjectDelete(record.pname, record.price, record.description)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger>Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
  ];
  const sitecolumns = [
    {title:'UserName', dataIndex: 'name', key: 'name'},
    {title:'Email', dataIndex: 'email', key: 'email'},
    {title:'Content', dataIndex: 'content', key: 'content'},
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Popconfirm
              title={`Are you sure to delete this site?`}
              onConfirm={() => handleSiteDelete(record.content)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger>Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Users" key="1">
          <Table
            columns={usercolumns}
            dataSource={users||[]}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
          <Modal
                title="Edit User"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical" name="edit_user_form">
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter the user name' }]}
                >
                    <Input placeholder="Enter user name" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                    { required: true, message: 'Please enter the user email' },
                    { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input placeholder="Enter user email" />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select the user role' }]}
                >
                    <Select placeholder="Select user role">
                    <Option value="user">User</Option>
                    <Option value="staff">Staff</Option>
                    <Option value="trainer">Trainer</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="country_code" label="Country Code">
                    <Input placeholder="+1" />
                </Form.Item>

                <Form.Item name="mobile_no" label="Mobile Number">
                    <Input placeholder="Enter mobile number" />
                </Form.Item>

                <Form.Item name="profile" label="Profile">
                    <Input.TextArea rows={4} placeholder="Enter user profile" />
                </Form.Item>

                <Form.Item label="Upload Photo">
                    <Upload
                    listType="picture"
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    beforeUpload={() => false} // Prevent automatic upload
                    >
                    <Button icon={<UploadOutlined />}>Upload Photo</Button>
                    </Upload>
                </Form.Item>
                </Form>
            </Modal>
        </TabPane>
        <TabPane tab="Projects" key="2">
          <Table
            columns={projectcolumns}
            dataSource={projects||[]}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
          <Modal
                title="Edit Project"
                visible={isProjectModalVisible}
                onOk={handleProjectModalOk}
                onCancel={handleProjectModalCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Form form={projectform} layout="vertical" name="edit_project_form">
                <Form.Item
                    name="name"
                    label="ProjectName"
                    rules={[{ required: true, message: 'Please enter the project name' }]}
                >
                    <Input placeholder="Enter project name" readOnly/>
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                    { required: true, message: 'Please enter the user email' },
                    { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input placeholder="Enter user email" readOnly/>
                </Form.Item>

                <Form.Item
                    name="pname"
                    label="ProjectName"
                    rules={[{ required: true, message: 'Please select the project name' }]}
                >
                    <Input placeholder="Enter project name" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input placeholder="Enter Project Description" />
                </Form.Item>

                <Form.Item name="price" label="Price">
                    <Input placeholder="Enter Price" />
                </Form.Item>
                </Form>
            </Modal>
        </TabPane>
        <TabPane tab="Sites" key="3">
          <Table
            columns={sitecolumns}
            dataSource={sites||[]}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

