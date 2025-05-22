package com.uni.controller;

import com.uni.model.Tour;
import com.uni.model.TourEntry;
import com.uni.service.TourService;
import com.uni.service.TourEntryService;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
@RestController
@RequestMapping("/api/tour-entries")
public class TourEntryController {
    private final TourEntryService tourEntryService;

    public TourEntryController(TourEntryService tourEntryService) {
        this.tourEntryService = tourEntryService;
    }

    @GetMapping
    public List<TourEntry> getAllEntries() {
        return tourEntryService.getAllEntries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourEntry> getEntryById(@PathVariable Long id) {
        return tourEntryService.getEntryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TourEntry> createEntry(@RequestBody TourEntry entry) {
        return ResponseEntity.ok(tourEntryService.createEntry(entry));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourEntry> updateEntry(@PathVariable Long id, @RequestBody TourEntry updatedEntry) {
        return ResponseEntity.ok(tourEntryService.updateEntry(id, updatedEntry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        tourEntryService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}
