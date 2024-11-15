import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button, Table, Modal, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreditPackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await api.credits.getCreditPackages();
      setPackages(response.data);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const totalPrice = values.credits * values.pricePerCredit;
      await api.credits.createCreditPackage({
        ...values,
        price: totalPrice,
      });
      setIsModalOpen(false);
      form.resetFields();
      loadPackages();
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  const columns = [
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
    },
    {
      title: 'Price Per Credit',
      dataIndex: 'pricePerCredit',
      key: 'pricePerCredit',
      render: (value) => `$${value}`,
    },
    {
      title: 'Total Price',
      dataIndex: 'price',
      key: 'price',
      render: (value) => `$${value}`,
    },
    {
      title: 'Duration (months)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link">Edit</Button>
          <Button type="link" danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add New Package
      </Button>

      <Table
        columns={columns}
        dataSource={packages}
        rowKey="_id"
      />

      <Modal
        title="Create New Credit Package"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="credits"
            label="Credits"
            rules={[{ required: true, message: 'Please input credits!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="pricePerCredit"
            label="Price Per Credit"
            rules={[{ required: true, message: 'Please input price per credit!' }]}
          >
            <InputNumber
              min={0}
              prefix="$"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Total Price"
          >
            <InputNumber
              disabled
              prefix="$"
              style={{ width: '100%' }}
              value={form.getFieldValue('credits') * form.getFieldValue('pricePerCredit')}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (months)"
            rules={[{ required: true, message: 'Please select duration!' }]}
          >
            <Select>
              {[1, 3, 6, 12, 24].map((month) => (
                <Option key={month} value={month}>{month} months</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="userType"
            label="User Type"
            rules={[{ required: true, message: 'Please select user type!' }]}
            initialValue="business"
          >
            <Select>
              <Option value="business">Business</Option>
              <Option value="trainer">Trainer</Option>
              <Option value="trainee">Trainee</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreditPackageManager; 