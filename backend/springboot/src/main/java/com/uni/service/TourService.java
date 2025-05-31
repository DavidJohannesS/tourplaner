package com.uni.service;

import com.uni.dto.TourDTO;
import com.uni.dto.TourEntryDTO;
import com.uni.mapper.TourMapper;
import com.uni.model.Tour;
import com.uni.repo.TourRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TourService {
    private final TourRepo tourRepo;
    private final TourMapper tourMapper;
    private final TourEntryService tourEntryService;  // Inject the TourEntryService

    public TourService(TourRepo tourRepo, TourMapper tourMapper, TourEntryService tourEntryService) {
        this.tourRepo = tourRepo;
        this.tourMapper = tourMapper;
        this.tourEntryService = tourEntryService;
    }

    public List<TourDTO> getAllTours() {
        return tourRepo.findAll()
                .stream()
                .map(tourMapper::toDto)
                .toList();
    }
    public TourDTO getTour(Long id) {
        Tour tour = tourRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour not found"));
        return tourMapper.toDto(tour);
    }
    public TourDTO updateTour(Long id, TourDTO updatedTourDTO) {
        Tour tour = tourRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour not found"));

        tour.setName(updatedTourDTO.getName());
        tour.setDescription(updatedTourDTO.getDescription());
        tour.setFromLocation(updatedTourDTO.getFromLocation());
        tour.setToLocation(updatedTourDTO.getToLocation());
        tour.setTransportType(updatedTourDTO.getTransportType());
        tour.setDistance(updatedTourDTO.getDistance());
        tour.setEstimatedTime(updatedTourDTO.getEstimatedTime());
        
        Tour savedTour = tourRepo.save(tour);
        return tourMapper.toDto(savedTour);
    }
    public void deleteTour(Long id) {
        Tour tour = tourRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour not found"));
        tourRepo.delete(tour);
    }
    public TourDTO addTour(TourDTO tourDTO) {
        Tour tour = tourMapper.toEntity(tourDTO);
        return tourMapper.toDto(tourRepo.save(tour));
    }

    public TourDTO addEntryToTour(Long tourId, TourEntryDTO tourEntryDTO) {
        tourEntryService.createEntry(tourId, tourEntryDTO);
        
        Tour updatedTour = tourRepo.findById(tourId)
                .orElseThrow(() -> new EntityNotFoundException("Tour not found"));
        
        return tourMapper.toDto(updatedTour);
    }
}
