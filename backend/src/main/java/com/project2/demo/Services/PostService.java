package com.project2.demo.Services;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.project2.demo.DTO.Requests.PostCreateDTO;
import com.project2.demo.DTO.Requests.PostUpdateDTO;
import com.project2.demo.DTO.Responses.PostResponseDTO;
import com.project2.demo.Enums.PostCategory;
import com.project2.demo.Mapper.PostMapper;
import com.project2.demo.Models.Post;
import com.project2.demo.Models.PostImage;
import com.project2.demo.Repositories.PostRepository;
import com.project2.demo.Repositories.UserRepository;



import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    private final UserRepository userRepository;

    private final PostMapper postMapper;

    @Transactional // Cái này để rollback tất cả hành vi khi gặp lỗi giữa chừng
    public void createPost(PostCreateDTO dto,Integer userId){
        Post create_post = postMapper.toEntity(dto);
        create_post.setUser(userRepository.getReferenceById(userId));

        
        postRepository.save(create_post);
    }

    @Transactional
    public void updatePost(PostUpdateDTO dto, Integer postId, Integer userId){
        Post update_post = postRepository.findById(postId).orElseThrow(()->new RuntimeException("No post found"));

        if(!update_post.getUser().getUserId().equals(userId)){
            throw new RuntimeException("You can only update your post");
        }

        // update các field cơ bản
        postMapper.updatePost(dto, update_post);

        // update các field phức tạp hơn (ignore trong file PostMapper)

        //update categories
        if (dto.categories() != null){
            Set<PostCategory> update_Categories = dto.categories();
            update_post.getCategories().clear();
            update_post.getCategories().addAll(update_Categories);

        }

        //update postImage
        if (dto.postImages() != null){
            List<PostImage> update_PostImages = dto.postImages().stream().map(url -> {
                PostImage postImg = new PostImage();
                postImg.setImageUrl(url);
                postImg.setPost(update_post);
                return postImg;
            }).collect(Collectors.toList());

            update_post.getPostImages().clear();
            update_post.getPostImages().addAll(update_PostImages);
            
        }

        postRepository.save(update_post);
        }


    @Transactional
    public void deletePost(Integer postId, Integer userId){
        Post delete_post = postRepository.findById(postId).orElseThrow(()->new RuntimeException("post not found"));

        if (!delete_post.getUser().getUserId().equals(userId)){
            throw new RuntimeException("you can not delete others's post");
        }

        postRepository.delete(delete_post);

        
    }

    public Slice<PostResponseDTO> getAllPost(int pageNo, int pageSize){

        //Tạo Pageable với pageNo và pageSize
        Pageable pageable = PageRequest.of(pageNo,pageSize);

        Slice<Post> posts = postRepository.findAllByOrderByPostIdDesc(pageable);

        return posts.map(postMapper::toPostResponseDTO);

        
    }

    public Slice<PostResponseDTO> getPostsByUserId(Integer userId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Slice<Post> posts = postRepository.findAllByUserUserIdOrderByPostIdDesc(userId, pageable);
        return posts.map(postMapper::toPostResponseDTO);
    }


    public PostResponseDTO getPostById(Integer postId){
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("no post found"));
        return postMapper.toPostResponseDTO(post);
    }
}
