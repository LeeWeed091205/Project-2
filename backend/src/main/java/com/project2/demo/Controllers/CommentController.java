package com.project2.demo.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project2.demo.Auth.SecurityUtil;
import com.project2.demo.DTO.Requests.CommentCreateDTO;
import com.project2.demo.DTO.Requests.CommentUpdateDTO;
import com.project2.demo.DTO.Responses.CommentResponseDTO;
import com.project2.demo.Services.CommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Slice;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public CommentResponseDTO createComment(@RequestBody @Valid CommentCreateDTO dto,@RequestParam Integer postId) {
        Integer userId = SecurityUtil.getCurrentUserId();
        return commentService.createComment(dto, userId, postId);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public CommentResponseDTO updateComment(@RequestBody @Valid CommentUpdateDTO dto, @PathVariable(name = "id") Integer commentId){
        Integer userId = SecurityUtil.getCurrentUserId();
        return commentService.updateComment(dto, commentId, userId);
    }








    @GetMapping
    public Slice<CommentResponseDTO> getCommentsByPostId(@RequestParam Integer postId, @RequestParam int pageNo, @RequestParam int pageSize){
        return commentService.getCommentsByPostId(postId, pageNo, pageSize);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public String deleteComment(@PathVariable(name = "id") Integer commentId){
        Integer userId = SecurityUtil.getCurrentUserId();
        commentService.deleteComment(commentId, userId);

        return "Delete comment successfully";
    }
    

    
}
