import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TourSearch from "../TourSearch";
import axios from "axios";
import { vi, describe, beforeEach, it, expect } from "vitest";

// Mock axios
vi.mock("axios");

// Mock DarkModeContext
vi.mock("../../context/DarkModeContext", () => ({
  useDarkMode: () => ({ darkMode: false }),
}));

const mockTours = [
  {
    id: 1,
    name: "Test Tour",
    description: "A nice walk",
    fromLocation: "Vienna",
    toLocation: "Salzburg",
    transportType: "foot-walking",
    distance: "300",
    estimatedTime: "240",
    tourEntries: [],
  },
];

describe("TourSearch", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockTours });
    axios.post.mockResolvedValue({ data: { ...mockTours[0], id: 2 } });
    axios.delete.mockResolvedValue({});
  });

  it("renders form inputs and submit button", async () => {
    render(<TourSearch onSearch={() => {}} searchedTour={null} onSelectTour={() => {}} />);
    expect(screen.getByLabelText(/Startpunkt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zielpunkt/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Route suchen/i })).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  it("calls onSearch when form is submitted with start and end", () => {
    const onSearch = vi.fn();
    render(<TourSearch onSearch={onSearch} searchedTour={null} onSelectTour={() => {}} />);
    fireEvent.change(screen.getByLabelText(/Startpunkt/i), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/Zielpunkt/i), { target: { value: "B" } });
    fireEvent.click(screen.getByRole("button", { name: /Route suchen/i }));
    expect(onSearch).toHaveBeenCalledWith("A", "B");
  });

  it("does not call onSearch when start or end is empty", () => {
    const onSearch = vi.fn();
    render(<TourSearch onSearch={onSearch} searchedTour={null} onSelectTour={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Route suchen/i }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("shows save form when searchedTour is not already saved", async () => {
    render(
      <TourSearch
        onSearch={() => {}}
        searchedTour={{ start: "Linz", end: "Graz", distance: "100", estimatedTime: "120" }}
        onSelectTour={() => {}}
      />
    );
    expect(await screen.findByText(/Neue Route speichern/i)).toBeInTheDocument();
  });

  it("hides save form when searchedTour is already saved", async () => {
    render(
      <TourSearch
        onSearch={() => {}}
        searchedTour={{ start: "Vienna", end: "Salzburg" }}
        onSelectTour={() => {}}
      />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(screen.queryByText(/Neue Route speichern/i)).not.toBeInTheDocument();
  });

  it("disables save button when name or description is empty", async () => {
    render(
      <TourSearch
        onSearch={() => {}}
        searchedTour={{ start: "Linz", end: "Graz", distance: "100", estimatedTime: "120" }}
        onSelectTour={() => {}}
      />
    );
    const saveButton = await screen.findByRole("button", { name: /Route speichern/i });
    expect(saveButton).toBeDisabled();
  });

  it("calls API and adds new tour when saving", async () => {
    render(
      <TourSearch
        onSearch={() => {}}
        searchedTour={{ start: "Linz", end: "Graz", distance: "100", estimatedTime: "120" }}
        onSelectTour={() => {}}
      />
    );
    fireEvent.change(screen.getByPlaceholderText(/Name der Route/i), {
      target: { value: "New Tour" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Beschreibung/i), {
      target: { value: "Some info" },
    });
    fireEvent.click(await screen.findByRole("button", { name: /Route speichern/i }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  it("does not save tour when searchedTour is null", async () => {
    render(<TourSearch onSearch={() => {}} searchedTour={null} onSelectTour={() => {}} />);
    expect(screen.queryByText(/Neue Route speichern/i)).not.toBeInTheDocument();
  });

  it("renders saved tours correctly", async () => {
    render(<TourSearch onSearch={() => {}} searchedTour={null} onSelectTour={() => {}} />);
    expect(await screen.findByText(/Test Tour/i)).toBeInTheDocument();
  });

  it("expands and collapses tour details on click", async () => {
    render(
      <TourSearch
        onSearch={() => {}}
        searchedTour={null}
        onSelectTour={() => {}}
      />
    );
    const tourBtn = await screen.findByText(/Test Tour/i);
    fireEvent.click(tourBtn);
    expect(await screen.findByText(/Beschreibung:/i)).toBeInTheDocument();
    fireEvent.click(tourBtn);
    await waitFor(() => {
      expect(screen.queryByText(/Beschreibung:/i)).not.toBeInTheDocument();
    });
  });

  it("calls onSelectTour with correct tour", async () => {
    const onSelectTour = vi.fn();
    render(<TourSearch onSearch={() => {}} searchedTour={null} onSelectTour={onSelectTour} />);
    fireEvent.click(await screen.findByText(/Test Tour/i));
    expect(onSelectTour).toHaveBeenCalledWith(mockTours[0]);
  });

  it("opens delete modal when trash icon is clicked", async () => {
    render(<TourSearch onSearch={() => {}} searchedTour={null} onSelectTour={() => {}} />);
    fireEvent.click(await screen.findByRole("button", { name: "" })); // Trash icon has no label
    expect(await screen.findByText(/Tour löschen/i)).toBeInTheDocument();
  });

  it("closes delete modal when cancel is clicked", async () => {
    render(<TourSearch onSearch={() => {}} searchedTour={null} onSelectTour={() => {}} />);
    fireEvent.click(await screen.findByRole("button", { name: "" }));
    const cancelBtn = await screen.findByText(/Abbrechen/i);
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(screen.queryByText(/Tour löschen/i)).not.toBeInTheDocument();
    });
  });

  it("deletes tour when confirmed in modal", async () => {
    render(<TourSearch onSearch={() => {}} searchedTour={null} onSelectTour={() => {}} />);
    fireEvent.click(await screen.findByRole("button", { name: "" }));
    fireEvent.click(await screen.findByText(/Löschen/i));
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
  });
});
