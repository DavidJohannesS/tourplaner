package com.uni.mapper;

import com.uni.dto.*;
import com.uni.model.Tour;
import com.uni.mapper.TourEntryMapper;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.springframework.stereotype.Component;
@Component

public class TourMapper
{
    private final TourEntryMapper tourEntryMapper;
    public TourMapper(TourEntryMapper tourEntryMapper) {
        this.tourEntryMapper = tourEntryMapper;
    }
    public TourDTO toDto(Tour tour) {
        return new TourDTO(
            tour.getId(),
            tour.getName(),
            tour.getDescription(),
            tour.getFromLocation(),
            tour.getToLocation(),
            tour.getTransportType(),
            tour.getDistance(),
            tour.getEstimatedTime(),
            tour.getTourEntries()
                .stream()
                .map(entry -> tourEntryMapper.toDto(entry))
                .toList()
        );
    }

    public Tour toEntity(TourDTO tourDTO) {
        return new Tour(
            null,
            tourDTO.getName(),
            tourDTO.getDescription(),
            tourDTO.getFromLocation(),
            tourDTO.getToLocation(),
            tourDTO.getTransportType(),
            tourDTO.getDistance(),
            tourDTO.getEstimatedTime(),
            null,
            tourDTO.getTourEntries()
                .stream()
                .map(tourEntryMapper::toEntity)
                .toList()
        );
    }
}
