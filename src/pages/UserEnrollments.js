import React, { useState, useEffect } from 'react';
import { Table, notification } from 'antd';
import api from '../services/api';

const UserEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/user/enrollments', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setEnrollments(response.data);
    } catch (error) {
      notification.error({ message: 'Failed to fetch enrollments' });
    }
  };

  return (
    <Table
      dataSource={enrollments}
      columns={[
        { title: 'Project ID', dataIndex: 'project_id' },
        { title: 'Enrolled At', dataIndex: 'created_at' },
      ]}
      rowKey="id"
    />
  );
};

export default UserEnrollments;
