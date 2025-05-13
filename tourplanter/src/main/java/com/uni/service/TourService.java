package com.uni.service;

import com.uni.model.Tour;
import com.uni.repo.TourRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourService
{
    private final TourRepo tourRepo;

    public TourService(TourRepo tourRepo){
        this.tourRepo = tourRepo;
    }
    public List<Tour> getAllTours(){
        return tourRepo.findAll();
    }
    public Tour addTour(Tour tour){
        return tourRepo.save(tour);
    }
}
