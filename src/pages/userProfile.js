import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, notification, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../services/api';

const UserProfile = () => {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user-profiles', {
        headers: { Authorization: localStorage.getItem('token') },
      });

      console.log('Fetched Profile:', response.data);
      setProfile(response.data);
      form.setFieldsValue(response.data);
      if (response.data.image_file) {
        setFileList([
          {
            uid: '-1',
            name: 'Profile Image',
            status: 'done',
            url: `/uploads/${response.data.image_file}`,
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      notification.error({ message: 'Failed to load profile' });
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = form.getFieldsValue(); // Get all form values
  
      console.log('Form Values:', values); // Log to ensure values are correct
  
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
  
      if (fileList.length > 0) {
        formData.append('imageFile', fileList[0].originFileObj);
      }
  
      setLoading(true);
      await api.post('/user-profiles', formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
  
      notification.success({ message: 'Profile saved successfully!' });
      fetchProfile(); // Reload profile data after save
    } catch (error) {
      console.error('Error saving profile:', error);
      notification.error({ message: 'Failed to save profile' });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h2>User Profile</h2>
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        {/* {profile?.image_file ? (
            <Image
            width={200}
            src={`/uploads/${profile.image_file}`} // Render the uploaded image
            alt="Profile Image"
            style={{ marginBottom: '20px' }}
            />
        ) : (
            <Image
            width={200}
            src="https://via.placeholder.com/200" // Placeholder image if no profile image
            alt="Default Placeholder"
            style={{ marginBottom: '20px' }}
            />
        )} */}
        <Form.Item name="country_code" label="Country Code">
          <Input placeholder="+1" />
        </Form.Item>
        <Form.Item name="mobile_no" label="Mobile Number">
          <Input placeholder="123-456-7890" />
        </Form.Item>
        <Form.Item name="profile" label="Profile">
          <Input.TextArea rows={4} placeholder="Tell us about yourself" />
        </Form.Item>
        <Form.Item label="Profile Image">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Save Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserProfile;
