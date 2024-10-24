import React from 'react';
import { Card, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const Section = ({ section, onEdit }) => {
  return (
    <Card
      style={{ marginBottom: '10px' }}
      actions={[
        <Button icon={<EditOutlined />} onClick={onEdit}>
          Edit
        </Button>,
      ]}
    >
      {section.type === 'text' && <p>{section.content || 'Text Section'}</p>}
      {section.type === 'image' && (
        <img
          src={section.content || 'https://via.placeholder.com/150'}
          alt="Section"
          style={{ width: '100%' }}
        />
      )}
      {section.type === 'button' && (
        <Button type="primary">{section.content || 'Button'}</Button>
      )}
    </Card>
  );
};

export default Section;
