package com.uni.repo;

import com.uni.model.Tour;
import com.uni.model.TourEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourEntryRepository extends JpaRepository<TourEntry, Long>
{
}
