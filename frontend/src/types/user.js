// User types
export const User = {
  userId: '',
  username: '',
  email: '',
  role: '',
  createdAt: '',
  avatarUrl: '',
  bio: '',
};

export const UserLoginDTO = {
  username: '',
  password: '',
};

export const UserRegisterDTO = {
  username: '',
  password: '',
  email: '',
};

export const UserUpdateProfileDTO = {
  bio: '',
  email: '',
  avatarUrl: '',
};

export const UserInfoDTO = {
  userId: '',
  username: '',
  avatarUrl: '',
};

export const UserInfoDetailDTO = {
  username: '',
  avatarUrl: '',
  email: '',
  bio: '',
};

export const UserProfileResponseDTO = {
  ...UserInfoDetailDTO,
};