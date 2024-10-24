import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Button, Layout } from 'antd';
import {
    HomeOutlined,
    AppstoreOutlined,
    ProfileOutlined,
    UserOutlined,
    FileTextOutlined,
    EyeOutlined,
    LogoutOutlined,
  } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    navigate('/login'); // Redirect to login page
  };
  const userrole = localStorage.getItem('role');
  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo">
        <h2 style={{ color: 'white' }}>Gym Platform</h2>
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/trainer">Dashboard</Link>
        </Menu.Item>
        {isLoggedIn && (
          <Menu.Item key="profile" icon={<ProfileOutlined />}>
            <Link to="/user-profile">Profile</Link>
          </Menu.Item>
        )}
        {isLoggedIn&&userrole === 'staff' && (
          <Menu.Item key="manage" icon={<AppstoreOutlined />}>
            <Link to="/manage">Manage</Link>
          </Menu.Item>
        )}
        {isLoggedIn&&(userrole === 'staff'|| userrole ==="trainer") && (
          <Menu.Item key="booking-calendar" icon={<AppstoreOutlined />}>
            <Link to="/booking-calendar">Calendar</Link>
          </Menu.Item>
        )}
        <Menu.Item key="enrollments" icon={<AppstoreOutlined />}>
          <Link to="/enrollments">Enrollments</Link>
        </Menu.Item>
        <Menu.Item key="create-site" icon={<FileTextOutlined />}>
          <Link to="/create-site">Create Site</Link>
        </Menu.Item>
        <Menu.Item key="preview-site" icon={<EyeOutlined />}>
          <Link to="/preview-site">Preview Site</Link>
        </Menu.Item>
        <Menu.Item key="login" icon={<UserOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item key="register" icon={<UserOutlined />}>
          <Link to="/register">Register</Link>
        </Menu.Item>
      </Menu>
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{ marginLeft: '20px' }}
      >
        Logout
      </Button>
    </Header>
  );
};

export default Navbar;
