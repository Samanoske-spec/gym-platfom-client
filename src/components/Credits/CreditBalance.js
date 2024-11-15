import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Typography, Table, Card } from 'antd';

const { Title } = Typography;

const CreditBalance = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadCreditInfo();
  }, []);

  const loadCreditInfo = async () => {
    try {
      const [balanceRes, historyRes] = await Promise.all([
        api.credits.getCreditBalance(),
        api.credits.getCreditHistory(),
      ]);
      setBalance(balanceRes.data.balance);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Error loading credit info:', error);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={4}>Credit Balance: {balance}</Title>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Title level={5}>Transaction History</Title>
        <Table
          columns={columns}
          dataSource={history}
          rowKey="_id"
        />
      </Card>
    </div>
  );
};

export default CreditBalance; 