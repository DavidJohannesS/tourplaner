import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Create a spy function that we can use in our useMap mock.
let fitBoundsMock = vi.fn();

// We need to mock react-leaflet BEFORE we import MapView.
vi.mock("react-leaflet", () => ({
  __esModule: true, // Ensure ESModule compatibility
  MapContainer: ({ children, ...props }) => (
    <div data-testid="map-container" {...props}>
      {children}
    </div>
  ),
  TileLayer: (props) => (
    <div data-testid="tile-layer" data-url={props.url} />
  ),
  Polyline: ({ positions, color }) => (
    <div
      data-testid="polyline"
      data-positions={JSON.stringify(positions)}
      data-color={color}
    />
  ),
  // useMap returns an object with a fitBounds function which we spy on.
  useMap: () => ({
    fitBounds: fitBoundsMock,
  }),
}));

// Now import MapView – it will use our mocked react-leaflet components.
import MapView from "../MapView";

describe("MapView", () => {
  // Reset the spy before each test so calls don’t leak between tests.
  beforeEach(() => {
    fitBoundsMock.mockClear();
  });

  it("renders the map container and tile layer when no routeCoords are provided", () => {
    render(<MapView routeCoords={[]} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
    // When no routeCoords are provided, no Polyline (or FitBounds) should be rendered.
    expect(screen.queryByTestId("polyline")).not.toBeInTheDocument();
  });

  it("renders Polyline and calls fitBounds when routeCoords are provided", () => {
    const route = [
      [51.5, -0.1],
      [51.51, -0.12],
    ];
    render(<MapView routeCoords={route} />);
    // The Polyline component should render with our route.
    const polylineEl = screen.getByTestId("polyline");
    expect(polylineEl).toBeInTheDocument();
    expect(polylineEl).toHaveAttribute(
      "data-positions",
      JSON.stringify(route)
    );
    // Our FitBounds effect inside the FitBounds component should have been called.
    expect(fitBoundsMock).toHaveBeenCalledWith(route);
  });
});
