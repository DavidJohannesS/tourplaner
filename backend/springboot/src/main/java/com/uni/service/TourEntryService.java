package com.uni.service;

import com.uni.model.Tour;
import com.uni.model.TourEntry;
import com.uni.repo.TourRepo;
import com.uni.repo.TourEntryRepository;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
@Service
public class TourEntryService {
    private final TourEntryRepository tourEntryRepository;

    public TourEntryService(TourEntryRepository tourEntryRepository) {
        this.tourEntryRepository = tourEntryRepository;
    }

    public List<TourEntry> getAllEntries() {
        return tourEntryRepository.findAll();
    }

    public Optional<TourEntry> getEntryById(Long id) {
        return tourEntryRepository.findById(id);
    }

    public TourEntry createEntry(TourEntry entry) {
        return tourEntryRepository.save(entry);
    }

    public TourEntry updateEntry(Long id, TourEntry updatedEntry) {
        return tourEntryRepository.findById(id).map(existingEntry -> {
            existingEntry.setComment(updatedEntry.getComment());
            existingEntry.setDifficulty(updatedEntry.getDifficulty());
            existingEntry.setDistance(updatedEntry.getDistance());
            existingEntry.setTime(updatedEntry.getTime());
            existingEntry.setRating(updatedEntry.getRating());
            existingEntry.setDateTime(updatedEntry.getDateTime());
            return tourEntryRepository.save(existingEntry);
        }).orElseThrow(() -> new EntityNotFoundException("Tour Entry not found"));
    }

    public void deleteEntry(Long id) {
        tourEntryRepository.deleteById(id);
    }
}
