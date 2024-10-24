import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { notification, Spin } from 'antd';

const PreviewSite = () => {
  const [siteContent, setSiteContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    try {
      const response = await api.get('/site', {
        headers: { Authorization: localStorage.getItem('token') },
      });

      console.log('Fetched Site Content:', response.data); // Debug
      setSiteContent(response.data || []); // Ensure the state is set properly
    } catch (error) {
      console.error('Error fetching site content:', error);
      notification.error({ message: 'Failed to load site content' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Loading site..." />;
  }

  if (siteContent.length === 0) {
    return <p>No site content available. Please create a site.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Site Preview</h2>
      {siteContent.map((section, index) => (
        <div
          key={section.id || index}
          style={{
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};

// Helper function to render sections based on type
const renderSection = (section) => {
  switch (section.type) {
    case 'text':
      return <p>{section.content || 'Text Section'}</p>;
    case 'image':
      return (
        <img
          src={section.content || 'https://via.placeholder.com/150'}
          alt="Section"
          style={{ width: '100%' }}
        />
      );
    case 'button':
      return <button>{section.content || 'Button'}</button>;
    default:
      return <p>Unknown Section</p>;
  }
};

export default PreviewSite;
