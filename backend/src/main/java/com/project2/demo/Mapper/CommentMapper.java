package com.project2.demo.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.project2.demo.DTO.Requests.CommentCreateDTO;
import com.project2.demo.DTO.Requests.CommentUpdateDTO;
import com.project2.demo.DTO.Responses.CommentResponseDTO;
import com.project2.demo.Models.Comment;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CommentMapper {

     //DTO->Entity
    @Mapping(target = "commentId",ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Comment toEntity(CommentCreateDTO dto);


    @Mapping(target = "commentId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateComment(CommentUpdateDTO dto, @MappingTarget Comment comment);

    //Entity->DTO
    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.avatarUrl", target = "avatarUrl")
    CommentResponseDTO toCommentResponseDTO(Comment comment);


    
    
}
