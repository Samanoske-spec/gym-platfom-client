import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { CreditCardOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');
  
  // Check if user is admin (staff is considered admin)
  const isAdmin = userType === 'staff' || userType === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const items = [
    {
      key: 'home',
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'credits',
      icon: <CreditCardOutlined />,
      label: 'Credits',
      children: [
        {
          key: 'credit-balance',
          label: <Link to="/credits/balance">Credit Balance</Link>,
        },
        {
          key: 'buy-credits',
          label: <Link to="/credits/packages">Buy Credits</Link>,
        },
        // Show manage credits option for both staff and admin
        isAdmin && {
          key: 'manage-credits',
          label: <Link to="/admin/credits">Manage Credit Packages</Link>,
        },
      ].filter(Boolean),
    },
    {
      key: 'Basedata',
      icon: <CreditCardOutlined />,
      label: 'Basedata',
      children: [
        {
          key: 'base-venue',
          label: <Link to="/base/venue">Venue</Link>,
        },
        {
          key: 'buy-credits',
          label: <Link to="/credits/packages">Buy Credits</Link>,
        },
        // Show manage credits option for both staff and admin
        isAdmin && {
          key: 'manage-credits',
          label: <Link to="/admin/credits">Manage Credit Packages</Link>,
        },
      ].filter(Boolean),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/user-profile">Profile</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <Button type="link" onClick={handleLogout} style={{ color: 'inherit' }}>Logout</Button>,
    },
  ];

  if (!token) {
    return (
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="login">
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/register">Register</Link>
          </Menu.Item>
        </Menu>
      </Header>
    );
  }

  return (
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        items={items}
      />
    </Header>
  );
};

export default Navbar;
