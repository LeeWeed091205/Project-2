package com.project2.demo.Services;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.project2.demo.DTO.Requests.CommentCreateDTO;
import com.project2.demo.DTO.Requests.CommentUpdateDTO;
import com.project2.demo.DTO.Responses.CommentResponseDTO;
import com.project2.demo.Mapper.CommentMapper;
import com.project2.demo.Models.Comment;
import com.project2.demo.Repositories.CommentRepository;
import com.project2.demo.Repositories.PostRepository;
import com.project2.demo.Repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;

    private final UserRepository userRepository;

    private final PostRepository postRepository;

    private final CommentMapper commentMapper;


    @Transactional
    public CommentResponseDTO createComment(CommentCreateDTO dto, Integer userId, Integer postId){
        Comment create_comment = commentMapper.toEntity(dto);

        create_comment.setUser(userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found")));
        create_comment.setPost(postRepository.findById(postId).orElseThrow(()->new RuntimeException("Post not found")));
        commentRepository.save(create_comment);
        return commentMapper.toCommentResponseDTO(create_comment);
    }
    



    @Transactional
    public CommentResponseDTO updateComment(CommentUpdateDTO dto, Integer commentId, Integer userId){
        Comment update_comment = commentRepository.findById(commentId).orElseThrow(()->new RuntimeException("Comment not found"));

        if(!update_comment.getUser().getUserId().equals(userId)){
            throw new RuntimeException("You are not the owner of this comment");
        }


        commentMapper.updateComment(dto, update_comment);
        commentRepository.save(update_comment);
        return commentMapper.toCommentResponseDTO(update_comment);
    }



    @Transactional
    public void deleteComment(Integer commentId, Integer userId){
        Comment delete_comment = commentRepository.findById(commentId).orElseThrow(()->new RuntimeException("Comment not found"));

        if(!delete_comment.getUser().getUserId().equals(userId)){
            throw new RuntimeException("You are not the owner of this comment");
        }

        commentRepository.delete(delete_comment);
    }

    

    public Slice<CommentResponseDTO> getCommentsByPostId(Integer postId, int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo,pageSize);

        Slice<Comment> comments = commentRepository.findByPost_PostIdOrderByCommentIdDesc(postId, pageable);
        return comments.map(commentMapper::toCommentResponseDTO);
    }
}
