package com.uni.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import com.uni.dto.TourEntryDTO;
import com.uni.mapper.TourEntryMapper;
import com.uni.model.Tour;
import com.uni.model.TourEntry;
import com.uni.repo.TourEntryRepository;
import com.uni.repo.TourRepo;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class TourEntryServiceTest {

    @Mock
    private TourEntryRepository tourEntryRepository;

    @Mock
    private TourEntryMapper tourEntryMapper;

    @Mock
    private TourRepo tourRepo;

    @InjectMocks
    private TourEntryService tourEntryService;

    private TourEntryDTO inputEntryDTO;
    private TourEntry entryEntity;
    private TourEntry savedEntryEntity;
    private TourEntryDTO outputEntryDTO;
    private Tour sampleTour;

    @BeforeEach
    public void setUp() {
        sampleTour = new Tour();
        sampleTour.setId(1L);
        sampleTour.setName("Test Tour");

        inputEntryDTO = new TourEntryDTO();
        inputEntryDTO.setComment("Amazing view!");
        inputEntryDTO.setDifficulty("Medium");
        inputEntryDTO.setDistance("15");
        inputEntryDTO.setTime("3");
        inputEntryDTO.setRating("5");
        inputEntryDTO.setDateTime(null);

        entryEntity = new TourEntry();
        entryEntity.setComment("Amazing view!");
        entryEntity.setDifficulty("Medium");
        entryEntity.setDistance("15");
        entryEntity.setTime("3");
        entryEntity.setRating("5");
        entryEntity.setTour(sampleTour);

        savedEntryEntity = new TourEntry();
        savedEntryEntity.setId(1L);
        savedEntryEntity.setComment("Amazing view!");
        savedEntryEntity.setDifficulty("Medium");
        savedEntryEntity.setDistance("15");
        savedEntryEntity.setTime("3");
        savedEntryEntity.setRating("5");
        savedEntryEntity.setTour(sampleTour);

        outputEntryDTO = new TourEntryDTO();
        outputEntryDTO.setId(1L);
        outputEntryDTO.setComment("Amazing view!");
        outputEntryDTO.setDifficulty("Medium");
        outputEntryDTO.setDistance("15");
        outputEntryDTO.setTime("3");
        outputEntryDTO.setRating("5");
        outputEntryDTO.setDateTime(null);
    }

    @Test
    public void testCreateEntry() {
        when(tourRepo.findById(1L)).thenReturn(Optional.of(sampleTour));
        when(tourEntryMapper.toEntity(inputEntryDTO)).thenReturn(entryEntity);
        when(tourEntryRepository.save(entryEntity)).thenReturn(savedEntryEntity);
        when(tourEntryMapper.toDto(savedEntryEntity)).thenReturn(outputEntryDTO);

        TourEntryDTO result = tourEntryService.createEntry(1L, inputEntryDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Amazing view!", result.getComment());

        verify(tourRepo).findById(1L);
        verify(tourEntryRepository).save(entryEntity);
        verify(tourEntryMapper).toDto(savedEntryEntity);
    }

    @Test
    public void testGetEntryById_Found() {
        when(tourEntryRepository.findById(1L)).thenReturn(Optional.of(savedEntryEntity));
        when(tourEntryMapper.toDto(savedEntryEntity)).thenReturn(outputEntryDTO);

        TourEntryDTO result = tourEntryService.getEntryById(1L).orElse(null);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Amazing view!", result.getComment());

        verify(tourEntryRepository).findById(1L);
        verify(tourEntryMapper).toDto(savedEntryEntity);
    }

    @Test
    public void testGetEntryById_NotFound() {
        when(tourEntryRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertFalse(tourEntryService.getEntryById(999L).isPresent());

        verify(tourEntryRepository).findById(999L);
    }

    @Test
    public void testUpdateEntry() {
        TourEntryDTO updatedEntryDTO = new TourEntryDTO();
        updatedEntryDTO.setComment("Breathtaking landscape!");
        updatedEntryDTO.setDifficulty("Hard");
        updatedEntryDTO.setDistance("20");
        updatedEntryDTO.setTime("4");
        updatedEntryDTO.setRating("5");

        TourEntry updatedEntryEntity = new TourEntry();
        updatedEntryEntity.setId(1L);
        updatedEntryEntity.setComment("Breathtaking landscape!");
        updatedEntryEntity.setDifficulty("Hard");
        updatedEntryEntity.setDistance("20");
        updatedEntryEntity.setTime("4");
        updatedEntryEntity.setRating("5");
        updatedEntryEntity.setTour(sampleTour);

        when(tourEntryRepository.findById(1L)).thenReturn(Optional.of(savedEntryEntity));
        when(tourEntryRepository.save(any(TourEntry.class))).thenReturn(updatedEntryEntity);
        when(tourEntryMapper.toDto(updatedEntryEntity)).thenReturn(updatedEntryDTO);

        TourEntryDTO result = tourEntryService.updateEntry(1L, updatedEntryDTO);

        assertNotNull(result);
        assertEquals("Breathtaking landscape!", result.getComment());
        assertEquals("Hard", result.getDifficulty());
        assertEquals("20", result.getDistance());

        verify(tourEntryRepository).findById(1L);
        verify(tourEntryRepository).save(any(TourEntry.class));
        verify(tourEntryMapper).toDto(updatedEntryEntity);
    }

    @Test
    public void testDeleteEntry() {
        when(tourEntryRepository.findById(1L)).thenReturn(Optional.of(savedEntryEntity));

        tourEntryService.deleteEntry(1L);

        verify(tourEntryRepository).findById(1L);
        verify(tourEntryRepository).delete(savedEntryEntity);
    }

    @Test
    public void testSearchEntries() {
        TourEntry matchingEntry = new TourEntry();
        matchingEntry.setId(1L);
        matchingEntry.setComment("Amazing view!");
        matchingEntry.setDifficulty("Medium");
        matchingEntry.setDistance("15");
        matchingEntry.setTime("3");
        matchingEntry.setRating("5");
        matchingEntry.setTour(sampleTour);
        matchingEntry.setSearchVector("amazing view medium difficulty");

        List<TourEntry> mockEntries = List.of(matchingEntry);
        when(tourEntryRepository.searchEntries("amazing")).thenReturn(mockEntries);

        TourEntryDTO matchingDTO = new TourEntryDTO();
        matchingDTO.setId(1L);
        matchingDTO.setComment("Amazing view!");
        matchingDTO.setDifficulty("Medium");
        matchingDTO.setDistance("15");
        matchingDTO.setTime("3");
        matchingDTO.setRating("5");
        matchingDTO.setDateTime(null);

        when(tourEntryMapper.toDto(matchingEntry)).thenReturn(matchingDTO);

        List<TourEntryDTO> result = tourEntryService.searchEntries("amazing");

        assertEquals(1, result.size());
        assertEquals("Amazing view!", result.get(0).getComment());

        verify(tourEntryRepository).searchEntries("amazing");
    }
}
