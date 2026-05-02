package com.project2.demo.Mapper;


import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.project2.demo.DTO.Requests.PostCreateDTO;
import com.project2.demo.DTO.Requests.PostUpdateDTO;
import com.project2.demo.DTO.Responses.PostResponseDTO;
import com.project2.demo.Models.Post;
import com.project2.demo.Models.PostImage;


@Mapper(componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE ,// không ghi đè nếu trường không update
    unmappedTargetPolicy = ReportingPolicy.IGNORE // Tắt thông báo unmapped
)
public interface PostMapper {
    // Chuyển sang Post, List<String> -> List<PostImage>  thì Post image không biết mình thuộc post nào -> null trong db
    // => Dùng @AfterMapping
    //@BeanMapping để chỉ định map riêng cho hàm mapper nào
    @BeanMapping(qualifiedByName = "create")
    @Mapping(target = "postId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Post toEntity(PostCreateDTO dto);

    // Chieu DTO -> Entity (Cho create)
    @Named("create")
    @AfterMapping
    default void linkToPostImage(@MappingTarget Post post){
        if (post.getPostImages() != null){
            for (PostImage postImage : post.getPostImages()) {
                postImage.setPost(post);
            }
        }
    }



    default PostImage mapPostImages(String string){
        if (string == null) return null;
         PostImage postImage = new PostImage();
         postImage.setImageUrl(string);
         return postImage;
    }

    @Mapping(target = "postId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    //Hibernate đã âm thầm bọc cái danh sách đó lại bằng một class đặc biệt của riêng nó (thường gọi là PersistentBag hoặc PersistentList).
    //Nhiệm vụ của PersistentBag: Nó hoạt động giống như một "cuốn sổ cái". Bất cứ khi nào bạn add() thêm 1 ảnh mới, hoặc remove() 1 ảnh cũ, 
    // cuốn sổ này sẽ ghi chép lại. Nhờ đó, lúc bạn gọi repository.save(), Hibernate mới biết chính xác phải tạo ra câu lệnh SQL INSERT hay DELETE 
    // nào dưới Database. => mapStruct sẽ ngây thơ mà ghi đè lên List cũ
    @Mapping(target = "postImages", ignore = true)
    @Mapping (target = "categories", ignore = true)
    void updatePost(PostUpdateDTO dto, @MappingTarget Post post);



    // Cai nay la chieu Entity -> DTO
    default String mapString(PostImage postimages){
       if(postimages == null){
        return null;
       }

       return postimages.getImageUrl();

    }

    


    @Mapping(source = "user.username",target = "username")
    @Mapping(source = "user.avatarUrl", target = "avatarUrl")
    PostResponseDTO toPostResponseDTO(Post post);



}
