package com.uni.controller;

import com.uni.dto.TourEntryDTO;
import com.uni.service.TourEntryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tour-entries")
@Slf4j
public class TourEntryController {
    private final TourEntryService tourEntryService;

    public TourEntryController(TourEntryService tourEntryService) {
        this.tourEntryService = tourEntryService;
    }

    @GetMapping
    public List<TourEntryDTO> getAllEntries() {
        log.info("Fetching all tour entries");
        return tourEntryService.getAllEntries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourEntryDTO> getEntryById(@PathVariable Long id) {
        return tourEntryService.getEntryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TourEntryDTO> createEntry(@RequestBody TourEntryDTO tourEntryDTO) {
        log.info("Creating new tour entry: {}", tourEntryDTO);
        return ResponseEntity.ok(tourEntryService.createEntry(tourEntryDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourEntryDTO> updateEntry(@PathVariable Long id, @RequestBody TourEntryDTO updatedEntryDTO) {
        return ResponseEntity.ok(tourEntryService.updateEntry(id, updatedEntryDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        tourEntryService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}
