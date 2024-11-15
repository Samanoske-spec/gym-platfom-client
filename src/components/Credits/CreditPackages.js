import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, Button, Typography, Row, Col, Spin } from 'antd';

const { Title, Text } = Typography;

const CreditPackages = ({ userType }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreditPackages();
  }, []);

  const loadCreditPackages = async () => {
    try {
      const response = await api.credits.getCreditPackages();
      const filteredPackages = response.data.filter(pkg => pkg.userType === userType);
      setPackages(filteredPackages);
    } catch (error) {
      console.error('Error loading credit packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId) => {
    try {
      await api.credits.purchaseCredits({
        packageId,
      });
      // Handle successful purchase
    } catch (error) {
      console.error('Error purchasing credits:', error);
    }
  };

  if (loading) return <Spin size="large" />;

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>Credit Packages</Title>
      <Row gutter={[16, 16]}>
        {packages.map((pkg) => (
          <Col xs={24} sm={12} md={8} key={pkg._id}>
            <Card>
              <Title level={5}>{pkg.credits} Credits</Title>
              <Text>Duration: {pkg.duration} months</Text>
              <br />
              <Title level={4}>${pkg.price}</Title>
              <Button
                type="primary"
                block
                onClick={() => handlePurchase(pkg._id)}
                style={{ marginTop: 16 }}
              >
                Purchase
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CreditPackages; 