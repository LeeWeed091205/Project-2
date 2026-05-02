package com.project2.demo.Services;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.project2.demo.Auth.SecurityUtil;
import com.project2.demo.DTO.Requests.LostPetCreateDTO;
import com.project2.demo.DTO.Requests.LostPetUpdateDTO;
import com.project2.demo.DTO.Responses.LostPetDetailInfoDTO;
import com.project2.demo.DTO.Responses.LostPetInfoDTO;
import com.project2.demo.Mapper.LostPetMapper;
import com.project2.demo.Models.LostPet;
import com.project2.demo.Models.LostPetImage;
import com.project2.demo.Repositories.LostPetRepository;
import com.project2.demo.Repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class LostPetService {

    private final LostPetRepository lostPetRepository;

    private final UserRepository userRepository;

    private final LostPetMapper lostPetMapper;


    @Transactional
    public void createLostPet(LostPetCreateDTO dto,Integer userId){
        LostPet create_lostpet = lostPetMapper.toEntity(dto);
        create_lostpet.setUser(userRepository.findById(userId).orElseThrow(()->new RuntimeException("can not found the user who create this")));
        lostPetRepository.save(create_lostpet);
    }


    @Transactional
    public void updateLostPet(LostPetUpdateDTO dto, Integer lostpetId, Integer userId){
        LostPet update_lostpet = lostPetRepository.findById(lostpetId).orElseThrow(()->new RuntimeException("No such lost pet found"));

        if (!update_lostpet.getUser().getUserId().equals(userId)){
            throw new RuntimeException("you can not update others's lost pet");
        }

        //Update lostpet Imgs
        if (dto.lostpetImages() != null){
            List<LostPetImage> lostpetImages = dto.lostpetImages().stream().map(img->{
                LostPetImage lostPetImage = new LostPetImage();
                lostPetImage.setImgPetUrl(img);
                lostPetImage.setLostpet(update_lostpet);
                return lostPetImage;
            }).toList();

            update_lostpet.getLostpetImages().clear();
            update_lostpet.getLostpetImages().addAll(lostpetImages);
        }


        //Update thông tin cơ bản
        lostPetMapper.updateLostPet(dto, update_lostpet);

        lostPetRepository.save(update_lostpet);
    }

    @Transactional
    public void deleteLostPet(Integer lostpetId, Integer userId){
        LostPet delete_lostpet = lostPetRepository.findById(lostpetId).orElseThrow(()->new RuntimeException("can not found the lost pet"));

        if (!delete_lostpet.getUser().getUserId().equals(userId) && !SecurityUtil.isAdmin()){
            throw new RuntimeException("You can not delete lost pet that are not yours");
        }

        lostPetRepository.delete(delete_lostpet);
    }


    public Slice<LostPetInfoDTO> getAllLostPet(int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo, pageSize);

        Slice<LostPet> lostPetImages = lostPetRepository.findAllByOrderByLostpetIdDesc(pageable);

        return lostPetImages.map(lostPetMapper::toLostPetInfoDTO);

    }

    public LostPetDetailInfoDTO getLostPetDetailInfo(Integer lostpetId){
        return lostPetMapper.toLostPetDetailInfoDTO(lostPetRepository.findById(lostpetId).orElseThrow(()->new RuntimeException("can not find this pet")));
    }

    
    



    
}
