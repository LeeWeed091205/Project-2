package com.project2.demo.Controllers;

import org.springframework.web.bind.annotation.RestController;

import com.project2.demo.Auth.SecurityUtil;
import com.project2.demo.DTO.Requests.PostCreateDTO;
import com.project2.demo.DTO.Requests.PostUpdateDTO;
import com.project2.demo.DTO.Responses.PostResponseDTO;
import com.project2.demo.Services.PostService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;






@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
public class PostController {
    private final PostService postService;


    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public String createPost(@RequestBody PostCreateDTO dto) {
        Integer currentUserId = SecurityUtil.getCurrentUserId();

        postService.createPost(dto, currentUserId);

        return "Create post successfully";
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public String updatePost(@PathVariable(name = "id") Integer postId, @RequestBody PostUpdateDTO dto) {
        Integer currentUserId = SecurityUtil.getCurrentUserId();
        if (currentUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        
        
        postService.updatePost(dto, postId, currentUserId);

        return "Update post successfully";
    }



    @GetMapping("/{id}")
    public PostResponseDTO getPostById(@PathVariable(name = "id") Integer postId) {
        return postService.getPostById(postId);
    }

    @GetMapping
    public Slice<PostResponseDTO> getAllPost(@RequestParam int pageNo, @RequestParam int pageSize) {
        return postService.getAllPost(pageNo, pageSize);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Slice<PostResponseDTO> getMyPosts(@RequestParam int pageNo, @RequestParam int pageSize) {
        Integer currentUserId = SecurityUtil.getCurrentUserId();
        if (currentUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        return postService.getPostsByUserId(currentUserId, pageNo, pageSize);
    }

    @GetMapping("/user/{userId}")
    public Slice<PostResponseDTO> getPostsByUser(@PathVariable(name = "userId") Integer userId,
            @RequestParam int pageNo, @RequestParam int pageSize) {
        return postService.getPostsByUserId(userId, pageNo, pageSize);
    }
    

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public String deletePost(@PathVariable(name = "id") Integer postId){
        Integer currentUserId = SecurityUtil.getCurrentUserId();
    
        postService.deletePost(postId, currentUserId);

        return "Delete post successfully";
    }

    
    
}
