// Post types
export const Post = {
  postId: '',
  title: '',
  content: '',
  createdAt: '',
  username: '',
  avatarUrl: '',
  postImages: [],
  categories: [],
  comments: [],
};

export const PostCreateDTO = {
  title: '',
  content: '',
  categories: [],
  postImages: [],
};

export const PostUpdateDTO = {
  title: '',
  content: '',
  updatedAt: '',
  categories: [],
  postImages: [],
};

export const PostResponseDTO = {
  ...Post,
};