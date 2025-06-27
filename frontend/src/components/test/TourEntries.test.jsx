vi.mock(
  // adjust the path if your test file is located elsewhere
  "../../context/DarkModeContext",
  async (importOriginal) => {
    const actual = await importOriginal();   // the real module’s exports
    return {
      ...actual,                            // keep DarkModeProvider, etc.
      useDarkMode: () => ({                 // override only the hook
        darkMode: false,
        setDarkMode: vi.fn(),
      }),
    };
  }
);

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TourEntries from "../TourEntries";
import { vi, describe, beforeEach, it, expect } from "vitest";
import axios from "axios";
import { DarkModeProvider } from "../../context/DarkModeContext";

vi.mock("axios");

const mockTour = {
  id: 1,
  name: "Test Tour",
};

const mockEntries = [
  {
    id: 101,
    comment: "Wunderschöne Tour",
    difficulty: "medium",
    distance: 10,
    time: 60,
    rating: 4,
    dateTime: new Date().toISOString(),
  },
];

describe("TourEntries", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { tourEntries: mockEntries },
    });
  });

  it("renders loading initially", async () => {
    render(
      <DarkModeProvider>
        <TourEntries selectedTour={mockTour} onClose={() => {}} />
      </DarkModeProvider>
    );
    expect(screen.getByText(/lade einträge/i)).toBeInTheDocument();
    await waitFor(() => screen.getByText(/tour logs/i));
  });

  it("renders entries after loading", async () => {
    render(
      <DarkModeProvider>
        <TourEntries selectedTour={mockTour} onClose={() => {}} />
      </DarkModeProvider>
    );
    await waitFor(() => screen.getByText(/Wunderschöne Tour/i));
    expect(screen.getByText(/Wunderschöne Tour/i)).toBeInTheDocument();
    expect(screen.getByText(/10 km/i)).toBeInTheDocument();
    expect(screen.getByText(/60 min/i)).toBeInTheDocument();
  });


  it("disables submit when form is incomplete", async () => {
    render(
      <DarkModeProvider>
        <TourEntries selectedTour={mockTour} onClose={() => {}} />
      </DarkModeProvider>
    );
    await waitFor(() => screen.getByText(/neuen log hinzufügen/i));
    fireEvent.click(screen.getByText(/neuen log hinzufügen/i));
    const saveBtn = screen.getByText(/log speichern/i);
    expect(saveBtn).toBeDisabled();
  });
});
