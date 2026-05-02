// Review types
export const Review = {
  reviewId: '',
  rating: 0,
  comment: '',
  createdAt: '',
  username: '',
  avatarUrl: '',
  clinicname: '',
};

export const ReviewCreateDTO = {
  comment: '',
  rating: 0,
};

export const ReviewUpdateDTO = {
  comment: '',
  rating: 0,
};

export const ReviewResponseDTO = {
  ...Review,
};