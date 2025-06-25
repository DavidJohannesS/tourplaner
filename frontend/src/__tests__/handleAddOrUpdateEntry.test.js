/// <reference types="vitest" />
/*import { test, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { renderHook, act } from "@testing-library/react";
import handleAddOrUpdateEntry from '../components/TourEntries'

vi.mock("axios");

beforeEach(() => {
  vi.clearAllMocks();
});

test("should create a new entry via POST when editingEntryId is null", async () => {
  const fakeTourId = 123;
  const fakeEntry = {
    comment: "Great hike!",
    difficulty: "medium",
    distance: "12",
    time: "90",
    rating: 5,
  };

  axios.post.mockResolvedValue({ data: { id: 1, ...fakeEntry } });

  const { result } = renderHook(() => handleAddOrUpdateEntry());

  act(() => {
    result.current.setSelectedTour({ id: fakeTourId });
    result.current.setNewEntry(fakeEntry);
    result.current.setEditingEntryId(null); // Ensures CREATE path
  });

  await act(async () => {
    await result.current.handleAddOrUpdateEntry();
  });

  expect(axios.post).toHaveBeenCalledWith(
    `http://localhost:8080/api/tours/${fakeTourId}/entries`,
    expect.objectContaining({
      comment: "Great hike!",
      difficulty: "medium",
      distance: "12",
      time: "90",
      rating: 5,
    })
  );

  // Assert reset state
  expect(result.current.newEntry).toEqual({
    comment: "",
    difficulty: "",
    distance: "",
    time: "",
    rating: 0,
  });
  expect(result.current.editingEntryId).toBe(null);
  expect(result.current.showForm).toBe(false);
});
*/