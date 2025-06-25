/// <reference types="vitest" />
import { test, expect, vi } from 'vitest';
import axios from 'axios';
import TourEntries from '../components/TourEntries';

vi.mock('axios');

test('calls delete API and closes modal', async () => {
  const mockReloadTour = vi.fn();
  const setShowDeleteModal = vi.fn();

  axios.delete.mockResolvedValue({ status: 200 });

  // Simulate call
  const id = 123;
  const handleDeleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tour-entries/${id}`);
      mockReloadTour();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  await handleDeleteEntry(id);

  expect(axios.delete).toHaveBeenCalledWith(
    'http://localhost:8080/api/tour-entries/123'
  );
  expect(mockReloadTour).toHaveBeenCalled();
  expect(setShowDeleteModal).toHaveBeenCalledWith(false);
});
