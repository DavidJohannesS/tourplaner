package com.uni.service;

import com.uni.dto.TourDTO;
import com.uni.dto.TourEntryDTO;
import com.uni.mapper.TourMapper;
import com.uni.mapper.TourEntryMapper;
import com.uni.model.Tour;
import com.uni.model.TourEntry;
import com.uni.repo.TourRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
@Service
public class TourService {
    private final TourRepo tourRepo;
    private final TourMapper tourMapper;
    private final TourEntryService tourEntryService;  // Inject the TourEntryService
    private final TourEntryMapper tourEntryMapper;
    public TourService(TourRepo tourRepo, TourMapper tourMapper, TourEntryService tourEntryService, TourEntryMapper tourEntryMapper) {
        this.tourRepo = tourRepo;
        this.tourMapper = tourMapper;
        this.tourEntryService = tourEntryService;
        this.tourEntryMapper = tourEntryMapper;
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

  @Transactional
  public TourDTO addEntryToTour(Long tourId, TourEntryDTO dto) {
    Tour tour = tourRepo.findById(tourId)
        .orElseThrow(() -> new EntityNotFoundException("…"));

    TourEntry entry = tourEntryMapper.toEntity(dto);
    entry.setTour(tour);
    tour.getTourEntries().add(entry);

    Tour saved = tourRepo.save(tour);

    return tourMapper.toDto(saved);
  }

    public List<TourDTO> searchTours(String query) {
    return tourRepo.searchTours(query)
                   .stream()
                   .map(tourMapper::toDto)
                   .toList();
}

}
