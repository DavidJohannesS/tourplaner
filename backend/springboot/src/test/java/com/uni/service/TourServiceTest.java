package com.uni.service;

import java.util.ArrayList;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import com.uni.dto.TourDTO;
import com.uni.mapper.TourMapper;
import com.uni.model.Tour;
import com.uni.repo.TourRepo;
import com.uni.service.TourEntryService;
import com.uni.service.TourService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Assertions;
import java.util.Optional;
import jakarta.persistence.EntityNotFoundException;
@ExtendWith(MockitoExtension.class)
public class TourServiceTest {

    @Mock
    private TourRepo tourRepo;

    @Mock
    private TourMapper tourMapper;

    @Mock
    private TourEntryService tourEntryService;

    @InjectMocks
    private TourService tourService;

    private TourDTO inputTourDTO;
    private Tour tourEntity;
    private Tour savedTourEntity;
    private TourDTO outputTourDTO;

    @BeforeEach
    public void setUp() {
        inputTourDTO = new TourDTO();
        inputTourDTO.setName("Test Tour");
        inputTourDTO.setDescription("A tour for testing");
        inputTourDTO.setFromLocation("Start City");
        inputTourDTO.setToLocation("End City");
        inputTourDTO.setTransportType("Car");
        inputTourDTO.setDistance("100");
        inputTourDTO.setEstimatedTime("2");
        inputTourDTO.setTourEntries(null);

        tourEntity = new Tour();
        tourEntity.setName("Test Tour");
        tourEntity.setDescription("A tour for testing");
        tourEntity.setFromLocation("Start City");
        tourEntity.setToLocation("End City");
        tourEntity.setTransportType("Car");
        tourEntity.setDistance("100");
        tourEntity.setEstimatedTime("2");

        savedTourEntity = new Tour();
        savedTourEntity.setId(1L);
        savedTourEntity.setName("Test Tour");
        savedTourEntity.setDescription("A tour for testing");
        savedTourEntity.setFromLocation("Start City");
        savedTourEntity.setToLocation("End City");
        savedTourEntity.setTransportType("Car");
        savedTourEntity.setDistance("100");
        savedTourEntity.setEstimatedTime("2");

        outputTourDTO = new TourDTO();
        outputTourDTO.setId(1L);
        outputTourDTO.setName("Test Tour");
        outputTourDTO.setDescription("A tour for testing");
        outputTourDTO.setFromLocation("Start City");
        outputTourDTO.setToLocation("End City");
        outputTourDTO.setTransportType("Car");
        outputTourDTO.setDistance("100");
        outputTourDTO.setEstimatedTime("2");
        outputTourDTO.setTourEntries(null);
    }

    @Test
    public void testAddTour() {
        when(tourMapper.toEntity(inputTourDTO)).thenReturn(tourEntity);
        when(tourRepo.save(tourEntity)).thenReturn(savedTourEntity);
        when(tourMapper.toDto(savedTourEntity)).thenReturn(outputTourDTO);

        TourDTO result = tourService.addTour(inputTourDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Tour", result.getName());

        verify(tourMapper).toEntity(inputTourDTO);
        verify(tourRepo).save(tourEntity);
        verify(tourMapper).toDto(savedTourEntity);
    }
    @Test
    public void testGetTourFound() {
        when(tourRepo.findById(1L)).thenReturn(Optional.of(savedTourEntity));
        when(tourMapper.toDto(savedTourEntity)).thenReturn(outputTourDTO);

        TourDTO result = tourService.getTour(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Tour", result.getName());

        verify(tourRepo).findById(1L);
        verify(tourMapper).toDto(savedTourEntity);
    }

    @Test
    public void testGetTourNotFound() {
        when(tourRepo.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            tourService.getTour(999L);
        });

        verify(tourRepo).findById(999L);
    }
    @Test
    public void testUpdateTour() {
        TourDTO updatedTourDTO = new TourDTO();
        updatedTourDTO.setName("Updated Tour Name");
        updatedTourDTO.setDescription("Updated Description");
        updatedTourDTO.setFromLocation("Updated Start");
        updatedTourDTO.setToLocation("Updated End");
        updatedTourDTO.setTransportType("Bike");
        updatedTourDTO.setDistance("200");
        updatedTourDTO.setEstimatedTime("5");
        updatedTourDTO.setTourEntries(null);

        Tour updatedTourEntity = new Tour();
        updatedTourEntity.setId(1L);
        updatedTourEntity.setName("Updated Tour Name");
        updatedTourEntity.setDescription("Updated Description");
        updatedTourEntity.setFromLocation("Updated Start");
        updatedTourEntity.setToLocation("Updated End");
        updatedTourEntity.setTransportType("Bike");
        updatedTourEntity.setDistance("200");
        updatedTourEntity.setEstimatedTime("5");

        TourDTO expectedDTO = new TourDTO();
        expectedDTO.setId(1L);
        expectedDTO.setName("Updated Tour Name");
        expectedDTO.setDescription("Updated Description");
        expectedDTO.setFromLocation("Updated Start");
        expectedDTO.setToLocation("Updated End");
        expectedDTO.setTransportType("Bike");
        expectedDTO.setDistance("200");
        expectedDTO.setEstimatedTime("5");

        when(tourRepo.findById(1L)).thenReturn(Optional.of(savedTourEntity));
        when(tourRepo.save(any(Tour.class))).thenReturn(updatedTourEntity);
        when(tourMapper.toDto(updatedTourEntity)).thenReturn(expectedDTO);

        TourDTO result = tourService.updateTour(1L, updatedTourDTO);

        assertNotNull(result);
        assertEquals("Updated Tour Name", result.getName());
        assertEquals("Updated Description", result.getDescription());
        assertEquals("Updated Start", result.getFromLocation());
        assertEquals("Updated End", result.getToLocation());
        assertEquals("Bike", result.getTransportType());
        assertEquals("200", result.getDistance());
        assertEquals("5", result.getEstimatedTime());

        verify(tourRepo).findById(1L);
        verify(tourRepo).save(any(Tour.class));
        verify(tourMapper).toDto(updatedTourEntity);
    }
    @Test
    public void testDeleteTour() {
        when(tourRepo.findById(1L)).thenReturn(Optional.of(savedTourEntity));

        tourService.deleteTour(1L);

        verify(tourRepo).findById(1L);
        verify(tourRepo).delete(savedTourEntity);
    }

    @Test
    public void testSearchTours() {
        // Arrange: Provide two matching tour objects.
        List<Tour> mockTours = List.of(
            new Tour(1L, "Test Tour", "A sample tour", "Start", "End", "Hiking", "10", "2", null, new ArrayList<>(), "test tour start end hiking"),
            new Tour(2L, "Test Tour 2", "Another sample tour", "Start", "Destination", "Biking", "15", "3", null, new ArrayList<>(), "test tour2 start destination biking")
        );
        when(tourRepo.searchTours("test")).thenReturn(mockTours);
        // Act:
        List<TourDTO> result = tourService.searchTours("test");
        // Assert: Now expect two entries.
        assertEquals(2, result.size());
        verify(tourRepo).searchTours("test");
    }
}

