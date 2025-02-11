import React, { Component } from "react";
import "leaflet/dist/leaflet.css"; // ✅ Ensure CSS is loaded
import { MapContainer, TileLayer } from "react-leaflet";
import map from "../../Data/map.json";

class MapFloor extends Component {
  state = {};

  componentDidMount() {
    console.log(map);
  }
  render() {
    return (
      <div>
        <MapContainer
          center={[51.505, -0.09]} // Default coordinates (London)
          zoom={13}
          style={{ height: "1400px", width: "1300px", zIndex: "1" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Default OpenStreetMap layer
          />
        </MapContainer>
      </div>
    );
  }
}

export default MapFloor;
