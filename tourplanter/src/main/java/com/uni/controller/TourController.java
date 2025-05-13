package com.uni.controller;

import com.uni.model.Tour;
import com.uni.service.TourService;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours")
@Slf4j
public class TourController
{
    private final TourService tourService;

    public TourController(TourService tourService){
        this.tourService = tourService;
    }
    @GetMapping
    public List<Tour> getAllTours(){
        log.info("Fetching all tours");
        return tourService.getAllTours();
    }
    @PostMapping
    public Tour addTour(@RequestBody Tour tour){
        log.info("Adding new Tour: {}", tour);
        return tourService.addTour(tour);
    }
}
