package com.uni.mapper;

import org.springframework.stereotype.Component;

import com.uni.dto.TourEntryDTO;
import com.uni.model.TourEntry;

@Component
public class TourEntryMapper {

    public TourEntryDTO toDto(TourEntry entry) {
        return new TourEntryDTO(
            entry.getId(),
            entry.getComment(),
            entry.getDifficulty(),
            entry.getDistance(),
            entry.getTime(),
            entry.getRating(),
            entry.getDateTime()
        );
    }

    public TourEntry toEntity(TourEntryDTO entryDTO) {
        return new TourEntry(
            null,
            entryDTO.getComment(),
            entryDTO.getDifficulty(),
            entryDTO.getDistance(),
            entryDTO.getTime(),
            entryDTO.getRating(),
            entryDTO.getDateTime(),
            null
        );
    }
}
