package com.uni.service;

import com.uni.dto.TourEntryDTO;
import com.uni.mapper.TourEntryMapper;
import com.uni.model.Tour;
import com.uni.model.TourEntry;
import com.uni.repo.TourEntryRepository;
import com.uni.repo.TourRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
@Service
public class TourEntryService {
    private final TourEntryRepository tourEntryRepository;
    private final TourEntryMapper tourEntryMapper;
    private final TourRepo tourRepo; 

    public TourEntryService(TourEntryRepository tourEntryRepository, TourEntryMapper tourEntryMapper, TourRepo tourRepo) {
        this.tourEntryRepository = tourEntryRepository;
        this.tourEntryMapper = tourEntryMapper;
        this.tourRepo = tourRepo;
    }

    public List<TourEntryDTO> getAllEntries() {
        return tourEntryRepository.findAll()
        .stream()
        .map(tourEntryMapper::toDto)
        .toList();
    }

    public Optional<TourEntryDTO> getEntryById(Long id) {
        return tourEntryRepository.findById(id)
        .map(tourEntryMapper::toDto);
    }

    public TourEntryDTO createEntry(Long tourId, TourEntryDTO entryDTO) {
        Tour tour = tourRepo.findById(tourId)
        .orElseThrow(() -> new EntityNotFoundException("Tour not found"));

        TourEntry entry = tourEntryMapper.toEntity(entryDTO);
        entry.setTour(tour);

        return tourEntryMapper.toDto(tourEntryRepository.save(entry));
    }

    public TourEntryDTO createEntry(TourEntryDTO entryDTO) {
        TourEntry entry = tourEntryMapper.toEntity(entryDTO);
        return tourEntryMapper.toDto(tourEntryRepository.save(entry));
    }

    public TourEntryDTO updateEntry(Long id, TourEntryDTO updatedEntryDTO) {
        return tourEntryRepository.findById(id)
        .map(existingEntry -> {
            existingEntry.setComment(updatedEntryDTO.getComment());
            existingEntry.setDifficulty(updatedEntryDTO.getDifficulty());
            existingEntry.setDistance(updatedEntryDTO.getDistance());
            existingEntry.setTime(updatedEntryDTO.getTime());
            existingEntry.setRating(updatedEntryDTO.getRating());
            existingEntry.setDateTime(updatedEntryDTO.getDateTime());
            return tourEntryMapper.toDto(tourEntryRepository.save(existingEntry));
        }).orElseThrow(() -> new EntityNotFoundException("Tour Entry not found"));
    }

    @Transactional
    public void deleteEntry(Long id) {
        TourEntry entry = tourEntryRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Tour Entry not found"));

        if (entry.getTour() != null) {
            entry.getTour().getTourEntries().remove(entry);
        }

        tourEntryRepository.delete(entry);
        tourEntryRepository.flush(); 
    }

    public List<TourEntryDTO> searchEntries(String query) {
        return tourEntryRepository.searchEntries(query)
        .stream()
        .map(tourEntryMapper::toDto)
        .toList();
    }
}
