import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate to programmatically go to other pages

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', values);
      localStorage.setItem('token', response.data.token); // Store JWT token in localStorage
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId)
      notification.success({ message: 'Login Successful' });
      navigate('/trainer'); // Redirect to dashboard or trainer page
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ddd' }}>
      <h2>Login</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>

      <p style={{ textAlign: 'center' }}>
        Don't have an account?{' '}
        <Button type="link" onClick={() => navigate('/register')}>
          Register Here
        </Button>
      </p>
    </div>
  );
};

export default Login;
