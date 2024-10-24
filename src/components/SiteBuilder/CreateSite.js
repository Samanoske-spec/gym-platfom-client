import React, { useState, useCallback } from 'react';
import { Button, Modal, Input, notification, Row, Col } from 'antd';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import Section from './Section';
import api from '../../services/api';

const CreateSite = () => {
  const [sections, setSections] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formContent, setFormContent] = useState('');

  // Drop area logic
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.SECTION,
    drop: (item) => addSection(item.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const addSection = (type) => {
    const newSection = { id: Date.now(), type, content: '' };
    setSections([...sections, newSection]);
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormContent(section.content);
    setIsModalVisible(true);
  };

  const handleSaveContent = () => {
    setSections((prevSections) =>
      prevSections.map((sec) =>
        sec.id === editingSection.id ? { ...sec, content: formContent } : sec
      )
    );
    setIsModalVisible(false);
    setEditingSection(null);
  };

  const handleSaveSite = async () => {
    try {
      await api.post('/site', { content: sections }, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      notification.success({ message: 'Site saved successfully!' });
    } catch (error) {
      notification.error({ message: 'Failed to save site.' });
    }
  };

  return (
    <div>
      <h2>Create Your Site</h2>

      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col>
          <Button onClick={() => addSection('text')}>Add Text</Button>
        </Col>
        <Col>
          <Button onClick={() => addSection('image')}>Add Image</Button>
        </Col>
        <Col>
          <Button onClick={() => addSection('button')}>Add Button</Button>
        </Col>
      </Row>

      <div
        ref={drop}
        style={{
          minHeight: '300px',
          border: isOver ? '2px dashed #1890ff' : '2px solid #ccc',
          padding: '10px',
          marginBottom: '20px',
        }}
      >
        {sections.map((section) => (
          <Section
            key={section.id}
            section={section}
            onEdit={() => handleEdit(section)}
          />
        ))}
      </div>

      <Button type="primary" onClick={handleSaveSite}>
        Save Site
      </Button>

      <Modal
        title="Edit Section Content"
        visible={isModalVisible}
        onOk={handleSaveContent}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input.TextArea
          rows={4}
          value={formContent}
          onChange={(e) => setFormContent(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default CreateSite;
