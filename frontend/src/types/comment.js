// Comment types
export const Comment = {
  commentId: '',
  content: '',
  createdAt: '',
  username: '',
  avatarUrl: '',
};

export const CommentCreateDTO = {
  content: '',
};

export const CommentUpdateDTO = {
  content: '',
};

export const CommentResponseDTO = {
  ...Comment,
};