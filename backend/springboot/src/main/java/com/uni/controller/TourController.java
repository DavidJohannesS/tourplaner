package com.uni.controller;


import com.uni.dto.TourDTO;
import com.uni.dto.TourEntryDTO;
import com.uni.service.TourService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@Slf4j
public class TourController {
    private final TourService tourService;

    public TourController(TourService tourService){
        this.tourService = tourService;
    }

    @GetMapping
    public List<TourDTO> getAllTours(){
        log.info("Fetching all tours");
        return tourService.getAllTours();
    }

    @PostMapping
    public TourDTO createTour(@RequestBody TourDTO tourDTO){
        log.info("Adding new Tour: {}", tourDTO);
        return tourService.addTour(tourDTO);
    }

    @PostMapping("/{tourId}/entries")
    public TourDTO addEntryToTour(@PathVariable Long tourId, @RequestBody TourEntryDTO tourEntryDTO) {
        log.info("Adding new Tour Entry for tourId {}: {}", tourId, tourEntryDTO);
        return tourService.addEntryToTour(tourId, tourEntryDTO);
    }
    @GetMapping("/{id}")
    public TourDTO getTour(@PathVariable Long id) {
        log.info("Fetching tour with id {}", id);
        return tourService.getTour(id);
    }
    @PutMapping("/{id}")
    public TourDTO updateTour(@PathVariable Long id, @RequestBody TourDTO tourDTO) {
        log.info("Updating tour with id {}", id);
        return tourService.updateTour(id, tourDTO);
    }
    @DeleteMapping("/{id}")
    public void deleteTour(@PathVariable Long id) {
        log.info("Deleting tour with id {}", id);
        tourService.deleteTour(id);
    }
    @GetMapping("/search")
    public List<TourDTO> searchTours(@RequestParam String query) {
        return tourService.searchTours(query);
    }

}
