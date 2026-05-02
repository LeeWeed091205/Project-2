import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ProfileDetailCard from '../../components/ProfileDetailCard/ProfileDetailCard';
import userService from '../../services/userService';

const ProfileDetail = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUser = storedUser || { id: 'me' };

  const [fullUserInfo, setFullUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyProfile = async () => {
      setIsLoading(true);
      try {
        const data = await userService.getMyInfoDetail();
        setFullUserInfo({
          userId: currentUser.id || 'me',
          username: data.username,
          email: data.email,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
        });
      } catch (error) {
        try {
          if (currentUser.id) {
            const data = await userService.getUserProfile(currentUser.id);
            setFullUserInfo({
              userId: currentUser.id,
              username: data.username,
              email: data.email,
              bio: data.bio,
              avatarUrl: data.avatarUrl,
            });
          } else {
            throw error;
          }
        } catch (nestedError) {
          console.error('Lỗi tải profile:', nestedError);
          message.error('Không thể tải thông tin cá nhân.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProfile();
  }, [currentUser.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-pink-500">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 animate-fade-in">
      <div className="max-w-[600px] mx-auto">
        {fullUserInfo && (
          <ProfileDetailCard 
            userId={fullUserInfo.userId}
            username={fullUserInfo.username}
            email={fullUserInfo.email}
            bio={fullUserInfo.bio}
            avatarUrl={fullUserInfo.avatarUrl}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;