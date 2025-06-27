vi.mock("../../context/DarkModeContext", () => ({
  useDarkMode: () => ({
    darkMode: false,
    setDarkMode: vi.fn(),
  }),
}));
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TourPreview from "../TourPreview";
import { updateTour } from "../../api/tours";
import React from "react";

// 🧠 Mock MapView FIRST to prevent leaflet from loading
vi.mock("../MapView", () => ({
  default: () => <div data-testid="mock-map">Map</div>,
}));

// 🧪 Mock API
vi.mock("../../api/tours", () => ({
  updateTour: vi.fn(),
}));

const testTour = {
  id: 1,
  name: "Test Tour",
  description: "A great trip",
  fromLocation: "Vienna",
  toLocation: "Salzburg",
  transportType: "car",
  distance: "300",
  estimatedTime: "180",
  tourEntries: [],
};

const updatedTour = {
  ...testTour,
  name: "Updated Tour",
};

describe("TourPreview", () => {
  it("renders fallback if no tour", () => {
    render(<TourPreview tour={null} routeCoords={[]} onUpdateTour={vi.fn()} />);
    expect(screen.getByText(/noch keine route geladen/i)).toBeInTheDocument();
  });

  it("shows tour preview details", () => {
    render(<TourPreview tour={testTour} routeCoords={[]} onUpdateTour={vi.fn()} />);
    expect(screen.getByText("Test Tour")).toBeInTheDocument();
    expect(screen.getByText("A great trip")).toBeInTheDocument();

      expect(screen.getByText("Start:", { exact: false })).toBeInTheDocument();
expect(screen.getByText("Vienna", { exact: false })).toBeInTheDocument();

  });

  it("edits form and calls updateTour + onUpdateTour", async () => {
    const handleUpdate = vi.fn();
    updateTour.mockResolvedValue({ data: updatedTour });

    render(<TourPreview tour={testTour} routeCoords={[]} onUpdateTour={handleUpdate} />);

    fireEvent.click(screen.getByText(/bearbeiten/i));

    // ✅ Grab the input using its current value
    const nameInput = screen.getByDisplayValue("Test Tour");
    fireEvent.change(nameInput, {
      target: { value: "Updated Tour" },
    });

    fireEvent.click(screen.getByText(/speichern/i));

    await waitFor(() => {
      expect(updateTour).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ name: "Updated Tour" })
      );
      expect(handleUpdate).toHaveBeenCalledWith(updatedTour);
    });
  });
});
